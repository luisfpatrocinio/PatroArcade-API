import request from "supertest";
import app from "../app";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Player } from "../entities/Player";
import { Game } from "../entities/Game";
import { Score } from "../entities/Score";
import jwt from "jsonwebtoken";

let token: string;
let mockPlayerId: number;
let mockGameId: number;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "testsecret";
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Create Mock Data
  const userRepository = AppDataSource.getRepository(User);
  const playerRepository = AppDataSource.getRepository(Player);
  const gameRepository = AppDataSource.getRepository(Game);

  const testUser = new User();
  testUser.username = "scoretester";
  testUser.email = "score@tester.com";
  testUser.password = "fakepassword";
  testUser.role = "player";
  await userRepository.save(testUser);

  const testPlayer = new Player();
  testPlayer.name = "scoretester";
  testPlayer.user = testUser;
  await playerRepository.save(testPlayer);
  mockPlayerId = testPlayer.id;

  const testGame = new Game();
  testGame.title = "Test Game";
  testGame.description = "A game for testing";
  testGame.genre = "Action";
  testGame.tags = ["test", "action"];
  testGame.dataLabels = { "points": "Score" };
  await gameRepository.save(testGame);
  mockGameId = testGame.id;

  // Generate Test Token
  token = jwt.sign(
    {
      userId: testUser.id,
      playerId: testPlayer.id,
      username: testUser.username,
      role: testUser.role,
    },
    process.env.JWT_SECRET
  );
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Score Integration Tests", () => {
  it("should successfully save a valid score record", async () => {
    const res = await request(app)
      .post(`/score/${mockGameId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        score: 500,
        sessionTimeInSeconds: 60,
        richPresenceText: "Online and playing safe",
      });

    expect(res.status).toBe(201); // created
    expect(res.body.type).toBe("scoreSuccess");
  });

  it("should block impossible scores based on anti-cheat logic (Zod Validation)", async () => {
    // 6000 points in 2 seconds is far beyond the new limit of 5500 points (5000 buffer + 500 generated in 2s)
    const res = await request(app)
      .post(`/score/${mockGameId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        score: 6000,
        sessionTimeInSeconds: 2,
        richPresenceText: "Speed runner hack",
      });

    expect(res.status).toBe(400); // blocked by schema
    expect(res.body.type).toBe("validationError");
    // Path includes 'AntiCheat'
    expect(res.body.content[0].field).toBe("body.AntiCheat");
  });

  it("should only update rich presence and preserving higher score logically", async () => {
    // Send a smaller score this time
    const res = await request(app)
      .post(`/score/${mockGameId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        score: 200,
        sessionTimeInSeconds: 60,
        richPresenceText: "Just chilling now",
      });

    expect(res.status).toBe(200); // updated
    expect(res.body.content).toContain("(Score não superou o recorde atual)");

    // Check DB manually to ensure the High Score is still 500, but presence is updated
    const scoreRepository = AppDataSource.getRepository(Score);
    const savedRecord = await scoreRepository.findOne({
      where: {
        player: { id: mockPlayerId },
        game: { id: mockGameId },
      },
    });

    expect(savedRecord).toBeDefined();
    expect(savedRecord!.score).toBe(500); // Kept the 500
    expect(savedRecord!.richPresenceText).toBe("Just chilling now"); // Updated text
  });
});
