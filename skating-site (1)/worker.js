// Cloudflare Worker: принимает заявки с сайта и отправляет их вашему Telegram-боту.
// Секреты BOT_TOKEN и CHAT_ID храните в настройках Worker (Settings → Variables → Secrets), НЕ в коде сайта.
export default{async fetch(req,env){
 const cors={'Access-Control-Allow-Origin':env.ORIGIN||'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST,OPTIONS'};
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST')return new Response('ok',{headers:cors});
 const {message}=await req.json();
 const r=await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:env.CHAT_ID,text:String(message).slice(0,3500)})});
 return new Response(r.ok?'ok':'error',{status:r.ok?200:502,headers:cors})}}
