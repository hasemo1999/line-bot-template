const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Renderの環境変数から取得
const LINE_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const USER_ID = process.env.USER_ID;

// TradingViewからWebhookを受け取ってLINEに送る
app.post('/webhook', async (req, res) => {
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

    res.status(200).send('✅ LINE送信成功');
  } catch (error) {
    console.error('❌ LINE送信失敗:', error.response?.data || error.message);
    res.status(500).send('LINE送信エラー');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Webhook受信エンドポイント：ユーザーID取得用
app.post('/webhook', (req, res) => {
  const events = req.body.events;
  if (!events || events.length === 0) {
    return res.status(200).send('No events');
  }

  events.forEach(event => {
    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId;
      const text = event.message.text;
      console.log('🆔 送信者のユーザーID:', userId);
      console.log('📩 メッセージ内容:', text);
    }
  });

  res.status(200).send('OK');
});