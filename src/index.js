const startBot = require('./utils/bot.js');
const express = require('express');
const env = require('./utils/env.js');

const app = express();

const PORT = Number(env('PORT', '3000'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Запускаємо бот
startBot();
