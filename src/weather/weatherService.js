const axios = require('axios');

const getWeather = async (city, apiKey) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric', // Використовуємо градуси Цельсія
          lang: 'uk', // Українська мова
        },
      },
    );

    const { weather, main, wind } = response.data;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('uk-UA', {
      weekday: 'long', // День тижня
      year: 'numeric', // Рік
      month: 'long', // Місяць
      day: 'numeric', // День
    });
    return `
        🌟 *Погода* 🌟
        📅 Дата: ${formattedDate},
        📍 Місто: ${response.data.name}
        🌤️ Погода: ${weather[0].description}
        🌡️ Температура: ${main.temp}°C
        🌡️ Відчувається як: ${main.feels_like}°C
        💧 Вологість: ${main.humidity}%
        🌬️ Вітер: ${wind.speed} м/с
        `;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    return 'Не вдалося отримати погоду. Перевірте назву міста або API-ключ.';
  }
};

module.exports = getWeather;
