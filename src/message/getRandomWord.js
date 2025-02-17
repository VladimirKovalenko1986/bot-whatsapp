const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../english-ukrainian.json');
let words = require(filePath);

const getRandomWord = () => {
  if (words.length === 0) {
    return '❌ Список слів порожній!';
  }

  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];

  // Формуємо відповідь
  const response = `🇬🇧 ${word.english} [${word.transcription}] - 🇺🇦 ${word.ukrainian}`;

  // Видаляємо вибране слово
  words.splice(randomIndex, 1);

  // Оновлюємо JSON-файл
  fs.writeFileSync(filePath, JSON.stringify(words, null, 2), 'utf8');

  return response;
};

module.exports = getRandomWord;
