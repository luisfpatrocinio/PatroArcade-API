import request from "supertest";
import app from "../app";
import { AppDataSource } from "../data-source";

beforeAll(async () => {
  // Ensure we are in test environment before initialization
  process.env.NODE_ENV = "test";
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Auth Integration Tests", () => {
  it("should successfully register a valid user", async () => {
    const res = await request(app).post("/register").send({
      username: "testuser1",
      email: "testuser1@example.com",
      password: "password123",
      confirmPassword: "password123"
    });

    expect(res.status).toBe(201);
    expect(res.body.type).toBe("registerSuccess");
  });

  it("should block registration without required fields (Zod Error)", async () => {
    const res = await request(app).post("/register").send({
      username: "test", // Missing email and password
    });

    expect(res.status).toBe(400);
    expect(res.body.type).toBe("validationError");
    // Verify Zod caught the structural error
    expect(res.body.content[0].field).toBeDefined();
  });
});
