"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestNews = void 0;
function getLatestNews(req, res) {
    // Retorna um json com informação aleatória para fim de teste:
    const news = [
        {
            id: 1,
            title: "PatroAsteroids chegou! Desafie a galáxia!",
            content: "Prepare-se para uma jornada épica! PatroAsteroids, nosso novo jogo de tiro espacial, já está disponível. Desvie de asteroides, destrua naves inimigas e alcance a pontuação máxima. Divirta-se!",
        },
        {
            id: 2,
            title: "PatroArcade no ar! Comemore com a gente!",
            content: "É com grande alegria que anunciamos o lançamento oficial do PatroArcade! A plataforma completa de jogos retrô já está disponível para você. Convide seus amigos e comemore conosco!",
        },
        {
            id: 3,
            title: "Novidades quentes! O que vem por aí no PatroArcade?",
            content: "Fique ligado! Estamos trabalhando em novas funcionalidades incríveis para o PatroArcade. Em breve, você poderá criar seus próprios torneios, personalizar seu perfil e muito mais. Acompanhe nossas redes sociais para não perder nenhuma novidade!",
        },
    ];
    res.json({ type: "latestNews", content: news });
}
exports.getLatestNews = getLatestNews;
//# sourceMappingURL=newsController.js.map