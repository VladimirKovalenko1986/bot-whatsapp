const schedule = require('node-schedule');

const lunchMessage = (client, groupChatId) => {
  schedule.scheduleJob('20 14 * * 1-5', () => {
    console.log('Надсилаємо повідомлення групі:', groupChatId);

    client
      .sendMessage(
        groupChatId,
        'Доброго дня! 😊 Тим, хто ще не подав заявки, будь ласка, зробіть це якомога швидше. У протилежному випадку ваші машини можуть не бути включені в планування. Дякуємо за розуміння та співпрацю!',
      )
      .then(() => {
        console.log('Повідомлення надіслано lunchMessage');
      })
      .catch((error) => {
        console.error('Помилка при надсиланні повідомлення:', error);
      });
  });
};

module.exports = lunchMessage;
