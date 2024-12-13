const schedule = require('node-schedule');

const scheduleMessages = (client, messageConfig, isConnected, messageQueue) => {
  messageConfig.forEach(({ time, groupChatId, message }) => {
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
        await client.sendMessage(groupChatId, message);
        console.log(
          `Message sent successfully to group ${groupChatId}: ${message}`,
        );
      } catch (error) {
        console.error('Error while sending the message:', error);
        messageQueue.push({ groupChatId, message });
      }
    });
  });
};

module.exports = scheduleMessages;
