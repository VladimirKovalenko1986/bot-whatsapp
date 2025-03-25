const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../english-ukrainian.json');
const usedWordsPath = path.join(__dirname, '../../usedWords.json');

const getRandomWord = () => {
  try {
    // Читаємо основний список слів
    let words = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (words.length === 0) {
      return '❌ Список слів порожній!';
    }

    // Читаємо або створюємо файл для використаних слів
    let usedWords = [];
    if (fs.existsSync(usedWordsPath)) {
      usedWords = JSON.parse(fs.readFileSync(usedWordsPath, 'utf8'));
    }

    // Вибираємо випадкове слово
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words.splice(randomIndex, 1)[0]; // Вирізаємо слово

    // Формуємо відповідь
    const response = `🇬🇧 ${word.english} - [${word.transcription}] - ${word.ukrainian_transcription} - 🇺🇦 ${word.ukrainian}`;

    // Додаємо слово у використані
    usedWords.push(word);

    // Оновлюємо JSON-файли
    fs.writeFileSync(filePath, JSON.stringify(words, null, 2), 'utf8');
    fs.writeFileSync(usedWordsPath, JSON.stringify(usedWords, null, 2), 'utf8');

    return response;
  } catch (error) {
    console.error('❌ Помилка при роботі з файлом JSON:', error);
    return '❌ Сталася помилка при обробці файлу!';
  }
};

module.exports = getRandomWord;
