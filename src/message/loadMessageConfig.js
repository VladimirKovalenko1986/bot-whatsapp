const fs = require('fs');
const path = require('path');

const loadMessageConfig = () => {
  try {
    const filePath = path.join(__dirname, 'messageConfig.json'); // Шлях до файлу
    const data = fs.readFileSync(filePath, 'utf8'); // Зчитуємо файл
    // console.log('Loaded message config:', data); // Лог для перевірки
    return JSON.parse(data); // Парсимо JSON
  } catch (err) {
    console.error('Error loading message config:', err);
    return []; // Повертаємо порожній масив, якщо є помилка
  }
};

module.exports = loadMessageConfig;
