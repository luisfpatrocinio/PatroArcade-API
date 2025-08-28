# PatroArcade API

PatroArcade is the backend server for an online arcade system, developed as part of a TCC (undergraduate thesis) project. This API manages arcade information, connected players, and their save data, providing a robust platform for online arcade experiences.

## Features

- **Arcade Management:** Handles data for multiple arcades, including game lists and arcade info.
- **Player Management:** Registers, authenticates, and tracks players, including login/logout and user profiles.
- **Save Data:** Stores and retrieves player save data for games.
- **Leaderboards:** Manages and displays high scores and rankings.
- **News & Updates:** Provides news endpoints for arcade announcements.
- **Rate Limiting:** Middleware to protect endpoints from abuse.

## Technologies

- **Node.js** with **TypeScript**
- **Express.js** for HTTP server and routing
- **SQLite** (via `database.db`) for persistent storage
- **TypeORM** for database management
- **RESTful API** design

## Project Structure

```
src/
  app.ts                # Express app setup
  main.ts               # Server entry point
  data-source.ts        # Database connection
  controllers/          # Request handlers for each feature
  entities/             # Database models (e.g., User)
  exceptions/           # Custom error handling
  middleware/           # Rate limiting and other middlewares
  models/               # Data models for arcade, game, player, etc.
  routes/               # API route definitions
  services/             # Business logic for each feature
database.db             # SQLite database file
tsconfig.json           # TypeScript configuration
package.json            # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)
- SQLite (database file included)

### Installation

1. Clone the repository:

   ```powershell
   git clone https://github.com/luisfpatrocinio/patroArcadeServer.git
   cd patroArcadeServer
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Start the server:
   ```powershell
   npm run start
   ```
   The server will run on the default port (check `main.ts` for configuration).

### API Endpoints

- `/arcades` - List and manage arcades
- `/players` - Register, login, logout, and manage players
- `/games` - Game information and save data
- `/leaderboard` - View and update leaderboards
- `/news` - Get arcade news and updates

See the `src/routes/` folder for detailed route definitions.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For major changes, open an issue first to discuss what you would like to change.

## License

This project is for academic purposes (TCC) and is open for learning and collaboration.

## Author

- **Luis F. Patrocínio**  
  [GitHub](https://github.com/luisfpatrocinio)
