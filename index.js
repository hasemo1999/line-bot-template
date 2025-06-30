const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// LINEアクセストークンと送信先IDをここに設定
const LINE_ACCESS_TOKEN = 'ここにあなたのチャネルアクセストークン';
const USER_ID = 'ここにあなたのLINEユーザーID';

app.post('/webhook', async (req, res) => {
  const message = req.body.message || 'TradingViewから通知が届きました📈';

  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: USER_ID,
      messages: [
        {
          type: 'text',
          text: message
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
      }
    });

    res.status(200).send('Message sent to LINE!');
  } catch (error) {
    console.error('LINE送信失敗:', error.response?.data || error);
    res.status(500).send('LINE送信エラー');
  }
});

// Renderが使うポート
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバー起動中：ポート${PORT}`);
});