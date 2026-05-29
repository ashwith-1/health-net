const axios = require("axios");

const sendTelegram = async (message) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });

    console.log("✅ Telegram alert sent");

  } catch (err) {
    console.log("❌ Telegram error:", err.message);
  }
};

module.exports = sendTelegram;