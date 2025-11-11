# PatroArcade API

PatroArcade é o servidor backend para um sistema de fliperama online, desenvolvido como parte de um projeto de TCC. Esta API gerencia informações dos fliperamas, jogadores conectados e seus dados salvos, fornecendo uma plataforma robusta para experiências de fliperama online.

## Features

- **Gerenciamento de Usuários:** Registro, autenticação e perfis de jogador.
- **Segurança de Senha:** As senhas são protegidas usando hashing `bcrypt`.
- **Persistência de Dados:** Armazena e recupera dados de save, pontuações e perfis de um banco de dados persistente.
- **Leaderboards:** Gerencia e exibe pontuações mais altas por jogo.
- **Validação de Entrada:** Usa `express-validator` para proteger rotas contra dados maliciosos.
- **Proteção de API:** Inclui `rate-limit` para proteger os endpoints contra abuso.
- **Notícias e Atualizações:** Fornece endpoints de notícias para anúncios do fliperama.

## Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** para o servidor HTTP e roteamento
- **PostgreSQL** (Hospedado no [Neon](https://neon.tech/)) para armazenamento persistente.
- **TypeORM** para gerenciamento do banco de dados e ORM.
- **WebSockets** (`ws`) para comunicação em tempo real com clientes (fliperamas).
- Design de **API RESTful**

## Estrutura do Projeto

```
src/
  app.ts                # Configuração do app Express e middlewares
  main.ts               # Ponto de entrada do servidor (HTTP e WebSocket) e script de seed
  data-source.ts        # Configuração da conexão do TypeORM (PostgreSQL)
  controllers/          # Lógica de manipulação de requisições (Request Handlers)
  entities/             # Entidades do TypeORM (Modelos do banco de dados)
  exceptions/           # Classes de erro customizadas
  middleware/           # Middlewares (auth, admin, rate-limit)
  models/               # Modelos de dados legados (usados para o seed do banco)
  routes/               # Definições das rotas da API
  services/             # Lógica de negócios
.env.example            # Arquivo de exemplo para variáveis de ambiente
package.json            # Dependências do projeto e scripts
tsconfig.json           # Configuração do TypeScript
```

## Começando

### Pré-requisitos

- Node.js (v16+ recomendado)
- npm (vem com o Node.js)
- Um banco de dados **PostgreSQL**. (Recomendado criar uma conta gratuita no [Neon](https://neon.tech/)).

### Instalação e Configuração

1.  Clone o repositório:

    ```bash
    git clone https://github.com/luisfpatrocinio/patroArcadeServer.git
    cd patroArcadeServer
    ```

2.  Instale as dependências:

    ```bash
    npm install
    ```

3.  **Crie seu arquivo `.env`:**
    Copie o conteúdo do `.env.example` para um novo arquivo chamado `.env`.

    ```bash
    cp .env.example .env
    ```

    Você **precisa** preencher as variáveis no arquivo `.env`:

    - `DATABASE_URL`: A URL de conexão do seu banco de dados PostgreSQL (ex: do Neon).
    - `JWT_SECRET`: Uma string secreta longa para assinar seus tokens JWT.

### Executando o Servidor

**Para Desenvolvimento (com hot-reload):**

```bash
npm run dev
```

*(Isso usa `ts-node` para executar `src/main.ts`. Na primeira vez, ele também executará o script de *seed* no seu banco Neon.)*

**Para Produção:**

```bash
# 1. Compilar o TypeScript para JavaScript
npm run build

# 2. Iniciar o servidor compilado
npm run start
```

_(Isso executa `node dist/main.js`.)_

### Endpoints Principais da API

- `/register`: (POST) Registra um novo usuário.
- `/login`: (POST) Autentica um usuário e retorna um token JWT.
- `/player/me`: (GET) Obtém o perfil do jogador autenticado.
- `/player/:playerId`: (GET) Obtém o perfil público de qualquer jogador.
- `/save/me/:gameId`: (POST) Salva dados do jogo para o jogador autenticado.
- `/games`: (GET) Lista todos os jogos disponíveis.
- `/leaderboard/:gameId`: (GET) Exibe o ranking de um jogo.
- `/latestNews`: (GET) Obtém as últimas notícias.

(Veja a pasta `src/routes/` para todas as definições de rotas.)

## Contribuições

Contribuições são bem-vindas\! Por favor, faça um fork do repositório e envie um pull request. Para mudanças maiores, abra uma _issue_ primeiro para discutir o que você gostaria de mudar.

## Licença

Este projeto é para fins acadêmicos (TCC) e está aberto para aprendizado e colaboração.

## Autor

- **Luis F. Patrocínio**
  [GitHub](https://github.com/luisfpatrocinio)
