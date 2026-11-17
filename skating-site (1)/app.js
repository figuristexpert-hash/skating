const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
// FAQ: конёк ездит от вопроса к вопросу
const cl=$('#cloud');
if(cl){const qs=$$('.q',cl),sk=$('#sk'),tr=$('#trail');let d='',px=0,py=0,t;
 function go(n){clearTimeout(t);cl.classList.remove('has');qs.forEach(a=>{a.classList.remove('on');a.style.marginLeft='0px'});
  const q=qs[n],x=parseFloat(q.style.left),y=parseFloat(q.style.top);
  if(n===0||!d){d='M'+x+','+y}else{d+=` Q${(px+x)/2+(n%2?6:-6)},${(py+y)/2+8} ${x},${y}`}
  tr.setAttribute('d',d);px=x;py=y;sk.style.left=x+'%';sk.style.top=`calc(${y}% + 24px)`;
  t=setTimeout(()=>{q.classList.add('on');cl.classList.add('has');if(n===qs.length-1)$('#ask').classList.add('in');{const cx=x*cl.clientWidth/100,h=q.offsetWidth*.6;let s=0;if(cx-h<8)s=8-(cx-h);else if(cx+h>cl.clientWidth-8)s=cl.clientWidth-8-(cx+h);q.style.marginLeft=s+'px'}t=setTimeout(()=>go((n+1)%qs.length),4500)},1700)}
 qs.forEach((q,i)=>q.onclick=()=>go(i));go(0)}
// Калькулятор: select с data-mul умножает, остальное складывается
$$('[data-calc]').forEach(c=>{const out=$('.sum',c);
 const f=()=>{let s=0,m=1,l=[];$$('select',c).forEach(e=>{const o=e.selectedOptions[0];if(e.dataset.mul)m*=+e.value;else s+=+e.value;l.push(o.text)});
  $$('input[type=checkbox]:checked',c).forEach(e=>{s+=+e.value;l.push(e.dataset.n)});
  const tot=s*m;out.textContent=tot.toLocaleString('ru')+' ₽';
  c.dataset.sum=document.title+': '+l.join(', ')+' — '+tot+' ₽'};
 c.addEventListener('input',f);f()});
// === НАСТРОЙКИ: впишите свои данные ===
const CFG={email:'your@email.com',phone:'',max:'',bot:'',worker:'',formspree:'',miniapp:'',giftApp:'',tg:''};
const pg=(location.pathname.split('/').pop()||'index').replace('.html','')||'index';
$$('.tel').forEach(a=>CFG.phone?a.href='tel:'+CFG.phone.replace(/[^+\d]/g,''):a.style.display='none');
$$('.mx').forEach(a=>CFG.max?(a.href=CFG.max,a.target='_blank'):a.style.display='none');
$$('.bot').forEach(a=>CFG.bot?(a.href='https://t.me/'+CFG.bot+'?start='+(a.dataset.start||pg),a.target='_blank'):a.style.display='none');
$$('.mini').forEach(a=>{const u=CFG.miniapp||CFG.tg;u?(a.href=u,a.target='_blank'):a.style.display='none'});
async function send(f,subject,text){const v=$$('input,select,textarea',f).filter(i=>i.name!=='q').map(i=>i.value).join('; '),body=text+'\nКонтакт: '+v;
 if(CFG.worker){try{const r=await fetch(CFG.worker,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:subject+'\n'+body})});if(r.ok)return}catch(e){}}
 if(CFG.formspree){try{const r=await fetch(CFG.formspree,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({subject,message:body})});if(r.ok)return}catch(e){}}
 location.href='mailto:'+CFG.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)}
$$('form.req').forEach(f=>f.onsubmit=async e=>{e.preventDefault();const c=f.closest('[data-calc]'),g=$('#cert');
 let t=c?c.dataset.sum:'Заявка на созвон';if(g&&c)t+=' | Сертификат: '+$('#cn').textContent+', '+$('#cp').textContent;
 await send(f,document.title,t);f.innerHTML='<b>Заявка отправлена, скоро свяжусь ♡</b>'});
// Лид-магнит: файл скачивается после ввода e-mail
$$('form.lead').forEach(f=>f.onsubmit=async e=>{e.preventDefault();await send(f,'Лид: '+f.dataset.file,'Скачал гайд '+f.dataset.file);const a=document.createElement('a');a.href=f.dataset.file;a.download='';a.click();f.innerHTML='<b>Спасибо! Гайд скачивается ♡</b>'});
// Сертификат
const cp=$('#cert');
if(cp){$$('input[name=d]').forEach(r=>r.onchange=()=>cp.className='cert '+r.value);
 $('#nm').oninput=e=>$('#cn',cp).textContent=e.target.value||'Имя получателя';
 $('#pl').onchange=e=>$('#cp',cp).textContent=e.target.value;$('#pr').onclick=()=>print()}

// UX: меню, шапка при скролле, плавное появление блоков
$$('.bg').forEach(b=>{const n=b.previousElementSibling;b.onclick=()=>n.classList.toggle('open');n.onclick=()=>n.classList.remove('open')});
const hs=()=>$$('header').forEach(h=>h.classList.toggle('sc',scrollY>40));addEventListener('scroll',hs,{passive:true});hs();
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
 $$('.card,.box,details,.pol,.feat').forEach(e=>{e.classList.add('rv');io.observe(e)})}

// Вопрос лично: форма на фото
$$('form.reqq').forEach(f=>f.onsubmit=async e=>{e.preventDefault();await send(f,'Вопрос с сайта','Вопрос: '+f.q.value);f.innerHTML='<b style="padding:6px;font-size:14px">Спасибо! Отвечу лично ♡</b>'});

// Сертификат в шапке: ссылка в мини-апп (если задана) или страница выбора на сайте
const gt=$('#giftTag');if(gt&&CFG.giftApp){gt.href=CFG.giftApp;gt.target='_blank'}

// Онлайн / офлайн: подсвечиваем подходящие форматы и прокручиваем к выбору
$$('.mbtn').forEach(b=>b.onclick=()=>{const was=b.classList.contains('sel');$$('.mbtn').forEach(x=>x.classList.remove('sel'));
 if(!was)b.classList.add('sel');$$('#ways ~ .cards .card').forEach(c=>c.classList.toggle('dim',!was&&c.dataset.mode!==b.dataset.mode));
 $('#ways').scrollIntoView({behavior:'smooth'})});
