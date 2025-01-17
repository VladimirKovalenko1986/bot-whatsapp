const words = require('../../english-ukrainian.json');

const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
  return `🇬🇧 ${word.english} - 🇺🇦 ${word.ukrainian}`;
};

module.exports = getRandomWord;
