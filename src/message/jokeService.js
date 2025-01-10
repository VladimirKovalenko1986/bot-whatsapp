const axios = require('axios');

const getJoke = async () => {
  try {
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any', {
      params: {
        lang: 'en', // Мова жарту
        type: 'single', // Однорядковий жарт
      },
    });

    return response.data.joke || 'Анекдот не знайдено 😅';
  } catch (error) {
    console.error('Error fetching joke:', error.message);
    return 'Не вдалося отримати анекдот. Спробуйте пізніше.';
  }
};

module.exports = getJoke;
