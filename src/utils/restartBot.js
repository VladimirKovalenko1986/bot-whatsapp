const startBot = require('./restartBot');

const restartBot = (app) => {
  console.log('Restarting bot...');
  startBot(app);
};

module.exports = restartBot;
