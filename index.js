const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const LINE_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const USER_ID = process.env.USER_ID;

// LINE Bot 経由でユーザーIDをログに出す
app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  // TradingViewからの通知（旧形式）を受け取った場合
  if (!events) {
    const message = req.body.message || '📈 TradingViewから通知が届きました';
    try {
      await axios.post('https://api.line.me/v2/bot/message/push', {
        to: USER_ID,
        messages: [{ type: 'text', text: message }]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
        }
      });
      return res.status(200).send('✅ LINE送信成功');
    } catch (error) {
      console.error('❌ LINE送信失敗:', error.response?.data || error.message);
      return res.status(500).send('LINE送信エラー');
    }
  }

  // LINEからのメッセージ（ユーザーID取得）
  events.forEach(event => {
    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId;
      const text = event.message.text;
      console.log('🆔 送信者のユーザーID:', userId);
      console.log('✉️ メッセージ内容:', text);
    }
  });

  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});