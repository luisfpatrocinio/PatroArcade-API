"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDatabase = void 0;
exports.saveDatabase = [
    {
        gameId: 1,
        playerId: 1,
        lastPlayed: new Date("2024-12-15"),
        richPresenceText: "Tentando bater o recorde: 500 pontos.",
        data: {
            highestScore: 500,
            totalScore: 1100,
            asteroidsDestroyed: 13,
            coinsCollected: 50,
        },
    },
    {
        gameId: 2,
        playerId: 1,
        richPresenceText: "Desbravando territórios perigosos.",
        lastPlayed: new Date("2024-12-14"),
        data: {
            highestScore: 300,
            totalScore: 800,
            levelsCompleted: 5,
            enemiesDefeated: 20,
            coinsCollected: 100,
        },
    },
    {
        gameId: 1,
        playerId: 2,
        lastPlayed: new Date("2024-12-13"),
        richPresenceText: "Explorando o espaço sideral.",
        data: {
            highestScore: 450,
            totalScore: 950,
            asteroidsDestroyed: 20,
            coinsCollected: 70,
        },
    },
    {
        gameId: 2,
        playerId: 2,
        richPresenceText: "Lutando contra inimigos ferozes.",
        lastPlayed: new Date("2024-12-12"),
        data: {
            highestScore: 350,
            totalScore: 900,
            levelsCompleted: 6,
            enemiesDefeated: 25,
            coinsCollected: 120,
        },
    },
    {
        gameId: 1,
        playerId: 3,
        lastPlayed: new Date("2024-12-11"),
        richPresenceText: "Destruindo asteroides.",
        data: {
            highestScore: 400,
            totalScore: 1000,
            asteroidsDestroyed: 15,
            coinsCollected: 60,
        },
    },
    {
        gameId: 2,
        playerId: 3,
        richPresenceText: "Conquistando territórios.",
        lastPlayed: new Date("2024-12-10"),
        data: {
            highestScore: 320,
            totalScore: 850,
            levelsCompleted: 7,
            enemiesDefeated: 30,
            coinsCollected: 110,
        },
    },
    {
        gameId: 1,
        playerId: 4,
        lastPlayed: new Date("2024-12-09"),
        richPresenceText: "Atingindo novos recordes.",
        data: {
            highestScore: 480,
            totalScore: 1050,
            asteroidsDestroyed: 18,
            coinsCollected: 80,
        },
    },
    {
        gameId: 2,
        playerId: 4,
        richPresenceText: "Enfrentando desafios épicos.",
        lastPlayed: new Date("2024-12-08"),
        data: {
            highestScore: 370,
            totalScore: 920,
            levelsCompleted: 8,
            enemiesDefeated: 35,
            coinsCollected: 130,
        },
    },
    {
        gameId: 1,
        playerId: 5,
        lastPlayed: new Date("2024-12-07"),
        richPresenceText: "Superando obstáculos.",
        data: {
            highestScore: 460,
            totalScore: 1020,
            asteroidsDestroyed: 22,
            coinsCollected: 90,
        },
    },
    {
        gameId: 2,
        playerId: 5,
        richPresenceText: "Dominando o campo de batalha.",
        lastPlayed: new Date("2024-12-06"),
        data: {
            highestScore: 340,
            totalScore: 880,
            levelsCompleted: 9,
            enemiesDefeated: 40,
            coinsCollected: 140,
        },
    },
];
/*

{
    racesWon: 50,
    totalPoints: 1100
}

h1 JOGO PATROCARS
{
    racesWon: "Corridas Vencidas",
    totalPoints: "Distancia maxima alcançada"

    Stats:
    Corridas Vencidas: 11,
    Vitórias: 5,
    Troféus Intergaláticos: 50,
    Pistas debloqueadas: 9

    Conquistas:
    ["run1000mAchievement", "unbeatableAchievement", ]

}

patro.saveDatas[0] =
{
    gameId: 1,
    playerId: 1,
    data: [
        {
            label: "Corridas Vencidas",
            value: 44
        },
        {
            label: "Asteroids Destruidos",
            value: 11
        },
        {
            label: "Pontuação Total",
            value: 3300
        }
    ]
}

patro.saveDatas[0] =
{
    gameId: 1,
    playerId: 1,
    data: [
        racesWon: 44,
        asteroidsDestroyed: 11,
        totalPoints: 3300
    ]
}

Ao exibir:
Jogos Jogados:
    • game.name:
        game.labels.get("racesWon"): 44
        game.labels.get("asteroidsDestroyed"): 11
        game.labels.get("totalPoints"): 3300



Criando a pagina:
Perfil de playerData.name:
playerData.bio
Patropontos: playerData.expPoints

Jogos Jogados:
for game in playerData.saveDatas:
    • Jogo <getGameNameById(game.gameId)
    for data in game.data:
        • data.label: data.value



Jogos Jogados:
    • PatroAsteroids:
        Corridas Vencidas: 44
        Asteroids Destruidos: 11
        Pontuação Total: 3300
*/
