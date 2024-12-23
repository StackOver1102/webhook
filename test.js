const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

// Thay bằng token xác thực của bạn từ Zoom Developer Portal
const VERIFICATION_TOKEN = "zgmQfPmLQmCfi-dctxeBFA";

// Middleware để xử lý JSON
app.use(bodyParser.json());

// Route chính để xử lý Webhook
app.post("/webhook", (req, res) => {
  const { event, payload } = req.body;
  // Xác thực URL từ Zoom
  if (event === "endpoint.url_validation") {
    const plainToken = payload.plainToken;
    // console.log(plainToken)
    const encryptedToken = crypto.createHmac('sha256', VERIFICATION_TOKEN).update(plainToken).digest('hex');
    // console.log(encryptedToken)

    return res.status(200).json({ plainToken, encryptedToken });
  }

  // Xác thực token trong Header
  // if (req.headers.authorization !== VERIFICATION_TOKEN) {
  //   return res.status(200).json({ message: "ok" });
  //   // return res.status(401).send("Unauthorized");
  // }

  // Xử lý sự kiện người tham gia
  if (event === "meeting.participant_joined") {
    const participant = payload.object.participant;
    console.log(`User ${participant.user_name} joined the meeting.`);
  } else if (event === "meeting.participant_left") {
    const participant = payload.object.participant;
    console.log(`User ${participant.user_name} left the meeting.`);
  } else {
    console.log(`Unhandled event: ${event}`);
  }

  // Phản hồi thành công
  res.status(200).send("Event received");
});
// console.log("🚀 ~ app.post ~ encryptedToken:", encryptedToken)

// Khởi động server
app.listen(PORT, () => {
  console.log(`Webhook server is running on http://localhost:${PORT}`);
});
