const fs = require('fs');

const replacements = [
  {
    file: 'src/controllers/logoutController.ts',
    from: /disconnectPlayer/g,
    to: 'DisconnectPlayer'
  },
  {
    file: 'src/controllers/saveController.ts',
    from: /getRelevantPlayerId/g,
    to: 'GetRelevantPlayerId'
  },
  {
    file: 'src/routes/authRoutes.ts',
    from: /connectPlayer/g,
    to: 'ConnectPlayer'
  },
  {
    file: 'src/routes/debugRoutes.ts',
    from: /showSaveDatas/g,
    to: 'ShowSaveDatas'
  },
  {
    file: 'src/services/arcadeService.ts',
    from: /disconnectPlayer/g,
    to: 'DisconnectPlayer'
  }
];

replacements.forEach(r => {
  let content = fs.readFileSync(r.file, 'utf8');
  content = content.replace(r.from, r.to);
  fs.writeFileSync(r.file, content, 'utf8');
});

console.log("Fixes applied");
