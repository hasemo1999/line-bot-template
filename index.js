require("dotenv").config();
const express = require("express");
const { Client, middleware } = require("@line/bot-sdk");

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new Client(config);

app.use(middleware(config));
app.use(express.json());

app.post("/webhook", (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "しん、通知が届いたよ📈📩"
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LINE Bot listening on port ${port}`);
});