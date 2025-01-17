const schedule = require('node-schedule');
const getWeather = require('../weather/weatherService');
const getJoke = require('../message/jokeService');
const env = require('../utils/env'); // Підключаємо модуль env
const getRandomWord = require('../message/getRandomWord');

const scheduleMessages = (client, messageConfig, isConnected, messageQueue) => {
  messageConfig.forEach(({ time, groupChatId, message, type, city }) => {
    schedule.scheduleJob(time, async () => {
      console.log(
        `Attempting to send message to group ${groupChatId} at ${time}`,
      );

      if (!isConnected) {
        console.log('Connection lost, adding message to queue.');
        messageQueue.push({ groupChatId, message });
        return;
      }

      try {
        let finalMessage;

        // Перевіряємо тип повідомлення
        if (type === 'weather') {
          const weatherApiKey = env('WEATHER_API_KEY'); // Отримуємо ключ через env
          finalMessage = await getWeather(city, weatherApiKey);
        } else if (type === 'joke') {
          finalMessage = await getJoke(); // Отримуємо анекдот
        } else if (type === 'word') {
          finalMessage = getRandomWord(); // Отримуємо випадкове слово чи фразу
        } else if (message) {
          finalMessage = message; // Використовуємо надане повідомлення
        } else {
          finalMessage = 'Тип повідомлення не підтримується.';
        }

        await client.sendMessage(groupChatId, finalMessage);
        console.log(
          `Message sent successfully to group ${groupChatId}: ${finalMessage}`,
        );
      } catch (error) {
        console.error('Error while sending the message:', error);
        messageQueue.push({ groupChatId, message });
      }
    });
  });
};

module.exports = scheduleMessages;
