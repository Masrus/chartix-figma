
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={logo:'M4 20 13 4h8M10 20l9-16',plus:'M12 5v14M5 12h14',back:'m15 5-7 7 7 7',close:'m6 6 12 12M6 18 18 6',chat:'M20 11a8 8 0 0 1-8 8H5l-3 3V11a9 9 0 0 1 18 0Z',chart:'M4 20V4M4 20h17M7 15l4-5 4 2 6-7',computer:'M3 4h18v13H3zM8 21h8M12 17v4',expand:'M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5',arrow:'M12 19V5m-6 6 6-6 6 6',chevron:'m7 14 5-5 5 5',settings:'M4 7h16M4 17h16M9 4v6M15 14v6',shield:'m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6',mic:'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0zM5 10v2a7 7 0 0 0 14 0v-2M12 19v3',code:'m8 7-5 5 5 5M16 7l5 5-5 5M14 3l-4 18',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-3.5-3.5',doc:'M13 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8zM13 3v5h5M9 13h6M9 17h4',globe:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c4.5 5 4.5 13 0 18M12 3c-4.5 5-4.5 13 0 18',bell:'M18 16v-5a6 6 0 1 0-12 0v5l-2 3h16zM10 22h4',wallet:'M3 8h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 8V6a2 2 0 0 1 2-2h11M15 14h2',check:'m5 13 4 4 10-10',pin:'M9 3h6l-1 6 4 4H6l4-4zM12 13v8',link:'M10 14a4 4 0 0 0 6 0l2-2a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-2 2a4 4 0 0 0 6 6l1-1',pencil:'M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16zM14 6l4 4',swap:'M7 20V4M3 8l4-4 4 4M17 4v16M13 16l4 4 4-4',spark:'M12 3.2l1.75 4.65a3 3 0 0 0 1.4 1.6l4.65 1.75-4.65 1.75a3 3 0 0 0-1.4 1.6L12 18.2l-1.75-4.65a3 3 0 0 0-1.4-1.6L4.2 10.2l4.65-1.75a3 3 0 0 0 1.4-1.6zM18.5 3.5l.55 1.45L20.5 5.5l-1.45.55L18.5 7.5l-.55-1.45L16.5 5.5l1.45-.55z'};
const icon=k=>'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="'+paths[k]+'"/></svg>';
const roles={
 swing:{name:'Свинг-трейдер',sub:'Тренды на несколько дней',sym:'BTC/USD',tf:'4H',kind:'trade',ico:'chart',goal:'Следи за BTC/USD на 4H. Отмечай уровни и объясняй сценарии. Без моего подтверждения сделки не открывать.'},
 day:{name:'Дейтрейдер',sub:'Внутридневные сценарии',sym:'EUR/USD',tf:'1H',kind:'trade',ico:'chart',goal:'Разбирай EUR/USD на 1H. Ищи уровни и каналы внутри дня. Перед действиями спрашивай меня.'},
 quant:{name:'Алго-разработчик',sub:'Стратегии и проверка на истории',sym:'BTC/USD',tf:'1H',kind:'trade',ico:'code',goal:'Формализуй мои торговые идеи, проверяй их на истории и отмечай входы и выходы на графике.'},
 gold:{name:'Трейдер по золоту',sub:'Фокус на XAU/USD',sym:'XAU/USD',tf:'1H',kind:'trade',ico:'chart',goal:'Анализируй XAU/USD на 1H. Покажи ключевые уровни и возможные сценарии. Сделки только с моего подтверждения.'},
 risk:{name:'Старший трейдер',sub:'Общий контроль команды',sym:null,tf:null,kind:'ops',ico:'shield',goal:'Проверяй ограничения риска у всех моих трейдеров и собирай общую сводку. Сообщай, если ограничение не задано.'},
 news:{name:'Новостной аналитик',sub:'События и повестка дня',sym:null,tf:null,kind:'info',ico:'globe',goal:'Следи за новостной повесткой и присылай короткие сводки: что произошло и почему это важно.'},
 research:{name:'Аналитик-исследователь',sub:'Отчёты и сравнения',sym:null,tf:null,kind:'info',ico:'doc',goal:'Собирай отчёты и сравнения по моим запросам. Пиши коротко, с выводом в начале.'},
 helper:{name:'Личный помощник',sub:'Заметки и напоминания',sym:null,tf:null,kind:'info',ico:'bell',goal:'Веди мои заметки и напоминания. Держи список коротким и напоминай о важном.'}
};
const kindOf=a=>roles[a.role].kind;
const instruments={'BTC/USD':{base:67842,step:490,digits:0},'ETH/USD':{base:3520,step:36,digits:2},'EUR/USD':{base:1.0842,step:.0011,digits:4},'XAU/USD':{base:2418,step:14,digits:2},'NAS100':{base:20418,step:130,digits:0}};
const brokers={'cTrader':{apps:'cTrader Web',pre:'CT'},'MetaTrader 5':{apps:'MetaTrader Web',pre:'MT5'},'MetaTrader 4':{apps:'MetaTrader Web',pre:'MT4'}};
let state={agents:[],runs:[]};
// Прототип не хранит состояние: каждая перезагрузка начинается с чистого листа.
try{localStorage.removeItem('trenda.v5');localStorage.removeItem('trenda.v4')}catch{}
const ago=m=>Date.now()-m*60000;
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
state.agents.forEach(a=>{if(!a.notes)a.notes=[];
 if(!Array.isArray(a.charts))a.charts=kindOf(a)==='trade'?[{id:uid(),sym:a.sym||roles[a.role].sym,tf:a.tf||roles[a.role].tf,drawing:a.drawing||null,shift:a.shift||0}].concat(a.tf2?[{id:uid(),sym:a.sym||roles[a.role].sym,tf:a.tf2,drawing:null,shift:0}]:[]):[];
 delete a.tf2;delete a.sym;delete a.tf;delete a.drawing;delete a.shift});
if(!state.multi){state.agents.forEach(a=>{if(a.role==='gold'&&a.charts.length===1)a.charts.push({id:uid(),sym:a.charts[0].sym,tf:a.charts[0].tf==='4H'?'1D':'4H',drawing:null,shift:0})});state.multi=1;save()}
if(!state.agents.length){state.agents=[
 {id:'btc-demo',role:'swing',name:'BTC trader',goal:roles.swing.goal,charts:[{id:'c3',sym:'BTC/USD',tf:'1H',drawing:null,shift:0},{id:'c4',sym:'BTC/USD',tf:'4H',drawing:null,shift:0}],focus:0,risk:1,paused:false,notes:[],tasks:[],account:null,messages:[{role:'assistant',ts:ago(180),text:'Готов. Слежу за BTC/USD и жду вашего поручения.'}]}
 ];save()}
let pickIdx=0,pendingSym='BTC/USD',searching=false;
// Закрытие поиска сбрасывает запрос — иначе список остался бы отфильтрованным втихую.
// Переключение идёт правкой класса на живом элементе, без перерисовки —
// только так у соседей отрабатывает переход и видно, как их вытесняет.
function toggleSearch(){
 searching=!searching;
 const head=$('sidehead');
 if(!head)return render();
 head.classList.toggle('searching',searching);
 // строка поручения внизу уезжает: на время поиска список — единственное, что имеет значение
 $('sidebar')?.classList.toggle('searching',searching);
 const q=$('q');
 head.querySelectorAll('.brand,.addbtn').forEach(el=>el.tabIndex=searching?-1:0);
 head.querySelectorAll('#q,.clearbtn').forEach(el=>el.tabIndex=searching?0:-1);
 const t=head.querySelector('.searchtoggle');
 t.setAttribute('aria-expanded',searching);
 t.setAttribute('aria-label',searching?'Закрыть поиск':'Поиск по ботам');
 if(searching)q?.focus();
 else{q?.blur();if(query){query='';if(q)q.value='';renderList()}}
}
// Поиск: в присланной версии matchAgent и foundLine не были определены, и поиск падал.
const matchAgent=(x,q)=>x.name.toLowerCase().includes(q)||roles[x.role].name.toLowerCase().includes(q)||x.messages.some(m=>m.text&&m.text.toLowerCase().includes(q));
const foundLine=(x,q)=>{const m=x.messages.find(m=>m.text&&m.text.toLowerCase().includes(q));if(!m)return null;const t=m.text.replace(/\s+/g,' '),i=t.toLowerCase().indexOf(q);return (i>30?'…':'')+t.slice(Math.max(0,i-30),i+50)};
// Перерисовываем только список: шапку трогать нельзя, там идёт переход.
function renderList(){
 const body=document.querySelector('.sidebody');if(!body)return render();
 const qq=query.trim().toLowerCase();
 const list=state.agents.filter(x=>!qq||matchAgent(x,qq));
 body.innerHTML=(qq||searching?'':storiesHTML(list))+(list.length?list.map(x=>rowHTML(x,qq)).join(''):'<div class="emptylist">'+(qq?'Ничего не найдено — ни в названиях ботов, ни в диалогах.':'Здесь появятся новые боты.')+'</div>')
}
// Режим «только график»: панель ассистента убрана, вместо неё плавающая кнопка с микрофоном.
let immersive=false;
// Обмен: диалог на экране, рабочий стол в шторке. Строка ввода при этом остаётся в шторке —
// у неё одно место при любом раскладе, и шторка её никогда не перекрывает.
let swapped=false;
// Экранная клавиатура прототипа: на десктопе системной нет, а решение по вёрстке нужно принимать с ней.
let kb=false;
let active=state.agents[0]?.id??null,view=window.matchMedia('(min-width: 701px)').matches?'agent':'home',expanded=false,dock='small',query='',dragging=false;
function save(){}
const current=()=>state.agents.find(a=>a.id===active);
const byId=id=>state.agents.find(a=>a.id===id);
const fmt=(n,s)=>n.toLocaleString('en-US',{minimumFractionDigits:instruments[s].digits,maximumFractionDigits:instruments[s].digits});
const money=(n,c)=>n.toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+c;
const clock=ts=>new Date(ts||Date.now()).toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'});
const live=id=>state.runs.filter(r=>!r.done&&(!id||r.a===id));
const chartsOf=a=>Array.isArray(a.charts)?a.charts:[];
const focusIdx=a=>Math.min(Math.max(0,a.focus||0),Math.max(0,chartsOf(a).length-1));
const focusCh=a=>chartsOf(a)[focusIdx(a)]||null;
const chLabel=c=>c?c.sym+' · '+c.tf:'график не добавлен';
// Аватарки ботов из Figma. Ролей восемь, рисунков пять: часть ролей делит рисунок.
const BOT_ART={gold:'hex',swing:'brown',day:'red',quant:'pink',news:'orange',risk:'hex',research:'brown',helper:'orange'};
const botArt=a=>BOT_ART[a.role]||'hex';
function avatar(a,big){const k=a.role;return '<div class="avatar '+(k==='gold'?'gold':k==='risk'?'risk':kindOf(a)==='info'?'info':'')+(big?' big':'')+'"><img src="./bots/'+botArt(a)+'.svg" alt="" draggable="false"></div>'}
function storiesHTML(list){return list.length?'<div class="stories" role="list">'+list.map(x=>'<button class="story" role="listitem" aria-label="'+esc(x.name)+'" onclick="openAgent(\''+x.id+'\')"><img src="./bots/story-'+botArt(x)+'.svg" alt="" draggable="false">'+(live(x.id)[0]?'<span class="livedot"></span>':'')+'</button>').join('')+'</div>':''}

/* ---------- каркас ---------- */
function render(){
 const keep=document.activeElement,kid=keep&&keep.id,pos=keep&&keep.selectionStart,val=keep&&'value' in keep?keep.value:null;
 const a=current();
 // прокрутка рабочего стола в шторке переживает перерисовку по тику
 const ds=document.querySelector('.dockdash')?.scrollTop;
 $('app').innerHTML='<div class="appframe '+(view!=='home'?'detail':'')+'">'+sidebarHTML()+'<main class="main '+(expanded?'fullscreen':'')+(expanded&&immersive?' immersive':'')+(kb?' kb':'')+(swapped&&!expanded?' swapped':'')+'">'+(a&&view==='agent'?agentHTML(a):emptyMain())+'</main></div>';
 if(ds){const d=document.querySelector('.dockdash');if(d)d.scrollTop=ds}
 if(view==='agent'&&a){bindDock();scrollMessages();bindCharts();bindKeyboard();bindComposerMic();growPrompt()}
 if(kid&&$(kid)){const el=$(kid);if(val!==null&&el.value!==val)el.value=val;el.focus();try{el.setSelectionRange(pos,pos)}catch{}}
}
function sidebarHTML(){
 const q=query.trim().toLowerCase();
 const list=state.agents.filter(x=>!q||matchAgent(x,q));
 const working=live().length;
 // Логотип, поиск и «плюс» живут в разметке одновременно: поиск разрастается по потоку
 // и вытесняет соседей в стороны. Появляйся он по перерисовке — движения бы не было вовсе.
 return '<aside class="sidebar'+(searching?' searching':'')+'" id="sidebar"><div class="sidehead'+(searching?' searching':'')+'" id="sidehead">'
 +'<button class="brand" id="brand" onclick="toggleTheme()" aria-label="Сменить тему: сейчас '+(theme==='light'?'светлая':'тёмная')+'" title="Сменить тему" tabindex="'+(searching?'-1':'0')+'"><img src="./bots/user.png" alt="" draggable="false"></button>'
 +'<span class="headgap"></span>'
 +'<div class="searchbox" id="searchbox">'
  +'<button class="iconbtn searchtoggle" aria-label="'+(searching?'Закрыть поиск':'Поиск по ботам')+'" aria-expanded="'+searching+'" onclick="toggleSearch()">'+icon('search')+'</button>'
  +'<input id="q" value="'+esc(query)+'" placeholder="Поиск по ботам" aria-label="Поиск по ботам и диалогам" oninput="setQuery(this.value)" tabindex="'+(searching?'0':'-1')+'">'
  +'<button class="iconbtn clearbtn" aria-label="Закрыть поиск" onclick="toggleSearch()" tabindex="'+(searching?'0':'-1')+'">'+icon('close')+'</button>'
 +'</div>'
 +'<button class="iconbtn roundbtn addbtn" aria-label="Новый бот" onclick="createDialog()" tabindex="'+(searching?'-1':'0')+'">'+icon('plus')+'</button>'
 +'</div><div class="sidebody">'+(searching?'':storiesHTML(list))
  +(list.length?list.map(x=>rowHTML(x,q)).join(''):'<div class="emptylist">'+(q?'Ничего не найдено — ни в названиях ботов, ни в диалогах.':'Здесь появятся новые боты.')+'</div>')
 +'</div></aside>'
}
function rowHTML(x,q){
 const r=live(x.id)[0],last=x.messages.at(-1);
 const hit=q&&!x.name.toLowerCase().includes(q)?foundLine(x,q):null;
 const prev=r?'<span class="working">'+esc(step(r))+'</span>':hit?'<span class="hit">'+esc(hit)+'</span>':esc((last&&last.role==='user'?'Вы: ':'')+(last?last.text.split('\n')[0]:roles[x.role].sub));
 return '<button class="chatrow '+(x.id===active&&view==='agent'?'active':'')+'" onclick="openAgent(\''+x.id+'\')">'+avatar(x)+(r?'<span class="livedot"></span>':'')+'<div class="grow"><div class="row between"><b>'+esc(x.name)+'</b><time>'+clock(last&&last.ts)+'</time></div><p>'+prev+'</p></div></button>'
}
function emptyMain(){return '<div class="empty"><div class="emblem">'+icon('chat')+'</div><h1>Выберите бота</h1><p>Слева — ваши боты и общий компьютер. Каждый бот работает в своём диалоге.</p><button class="primary" onclick="createDialog()">Новый бот</button></div>'}
function setQuery(v){query=v;searching?renderList():render()}
function openAgent(id){active=id;view='agent';expanded=false;dock='small';render()}
function home(){view='home';expanded=false;render()}

/* ---------- чат помощника ---------- */
function agentHTML(a){
 const r=live(a.id)[0],sw=swapped&&!expanded;
 const status=r?'<span class="working">'+esc(step(r))+'</span>':a.paused?'на паузе':'';
 // Два слоя: нижний и шторка. В каждом из них может жить дашборд или диалог.
 // Заголовок верхней шапки — про то, что лежит в нижнем слое; кнопка с двумя стрелками меняет слои местами.
 const title=sw?'Диалог с ботом':esc(a.name);
 const swapBtn=expanded?'':'<button class="iconbtn swapbtn" aria-label="'+(sw?'Поменять слои: дашборд вниз, диалог в шторку':'Поменять слои: диалог вниз, дашборд в шторку')+'" title="Поменять слои" onclick="swapContent()">'+icon('swap')+'</button>';
 return '<header class="topbar"><div class="capsule lead"><button class="iconbtn mobileback" aria-label="'+(expanded?'К рабочему столу бота':'К списку ботов')+'" onclick="goBack()">'+icon(expanded?'back':'close')+'</button></div>'+(expanded?'<div class="capsule mode">'+'<button class="iconbtn'+(immersive?' on':'')+'" aria-label="'+(immersive?'Вернуть панель ассистента':'Только график')+'" onclick="toggleImmersive()">'+icon('expand')+'</button>'+'</div>':'')
 +'<div class="capsule title'+(sw?' chat':'')+(status&&!sw?'':' solo')+'"><div class="ttext"><h2>'+title+'</h2>'+(status&&!sw?'<p>'+status+'</p>':'')+'</div></div>'
 +'<div class="capsule actions"><button class="iconbtn" aria-label="Облачная среда бота" onclick="envSheet()">'+icon('computer')+'</button>'+swapBtn+'</div></header>'
 +(sw?'<div class="chatmain">'+chatHTML(a)+'</div>':'<div class="overview">'+dashHTML(a)+'</div>')
 +(expanded&&immersive?fabHTML():dockHTML(a,sw))+(kb?keyboardHTML():'')
}
// Рабочий стол бота: живёт на экране или в шторке — смотря что выбрано обменом.
function dashHTML(a){
 const k=kindOf(a);
 return runPanel(a)+(k==='catalog'?(expanded?chartHTML(a):catalogHTML(a)):k==='trade'?(expanded?chartHTML(a):workspaceHTML(a)):k==='ops'?riskHTML(a):infoHTML(a))
}
function swapContent(){
 // Обмен слоёв: старый нижний слой сжимается в карточку, у неё появляется ручка,
 // затем верхний край падает на таблетку, а ручка карточки доезжает до ручки таблетки.
 const root=document.documentElement;
 const go=()=>{swapped=!swapped;root.classList.replace('vt-old','vt-new');render()};
 const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!document.startViewTransition||reduce){swapped=!swapped;render();return}
 // ручка карточки — отдельный элемент, живёт только в старом состоянии и едет своим путём
 if(dock==='small'&&!expanded){const m=document.querySelector('.main');if(m){const fh=document.createElement('div');fh.className='foldhandle';m.appendChild(fh)}}
 root.classList.add('vt-old');
 const t=document.startViewTransition(go);
 const toPill=dock==='small'&&!expanded;
 // по гифке: слой начинает падать на 500 мс, таблетка начинает сжиматься через ≈240 мс после начала падения
 if(toPill)setTimeout(blinkPill,740);
 t.finished.finally(()=>{root.classList.remove('vt-old','vt-new')});
}
// Когда слой или шторка доехали до таблетки, она «моргает»: чуть сжимается и возвращается к обычному размеру.
function blinkPill(){const c=$('composer');if(!c)return;c.classList.remove('blink','catch');void c.offsetWidth;c.classList.add('blink')}
// Видимый прогресс прямо на экране помощника, а не только в переписке.
function runPanel(a){
 const r=live(a.id)[0];if(!r)return '';
 const done=r.steps.indexOf(step(r)),p=Math.min(98,Math.round((Date.now()-r.start)/r.dur*100));
 return '<div class="runpanel"><div class="row"><span class="spin"></span><div class="grow"><b>'+esc(r.title)+'</b><small>Бот работает над поручением…</small></div><b class="working">'+p+'%</b></div>'
 +'<div class="bar" style="margin:12px 0">'+'<i style="width:'+p+'%"></i></div>'
 +'<ol class="steplist">'+r.steps.map((s,i)=>'<li class="'+(i<done?'ok':i===done?'now':'')+'">'+(i<done?icon('check'):i===done?'<span class="spin"></span>':'<span class="dotmark"></span>')+'<span>'+esc(s)+'</span></li>').join('')+'</ol></div>'
}
function accountStrip(a){
 if(!a.account)return '<button class="thinrow fullwidth" onclick="accountDialog()">'+icon('wallet')+'<span class="grow">Подключить счёт</span>'+icon('chevron')+'</button>';
 const c=a.account,pl=c.equity-c.balance;
 return '<div class="accstrip"><div class="row"><div class="avatar mach">'+icon('wallet')+'</div><div class="grow"><b>'+esc(c.broker)+' · '+esc(c.type)+'</b><small>Счёт '+esc(mask(c.login))+'</small></div><button class="tagbtn" onclick="accountDialog()">Изменить</button></div><div class="summarygrid tight"><div class="stat"><b>'+money(c.balance,c.cur)+'</b><small>Баланс</small></div><div class="stat"><b class="'+(pl>=0?'up':'down')+'">'+(pl>=0?'+':'')+money(pl,c.cur)+'</b><small>Результат сессии</small></div></div></div>'
}
const mask=l=>'••'+String(l).slice(-4);
function chartHTML(a){
 const list=chartsOf(a);
 if(!list.length)return '<div class="intro row between"><div><h2>Графики</h2><p>Пока ни одного</p></div></div><button class="thinrow fullwidth" onclick="addChartDialog()">'+icon('plus')+'<span class="grow">Добавить график</span>'+icon('chevron')+'</button>';
 if(expanded){
  const c=focusCh(a),i=focusIdx(a);
  return '<div class="charts"><section class="chartcard"><div class="charthead">'
  +(c.pending?'<div class="copilotbar">'+(c.suggest||[]).map((sg,n)=>'<button class="chip" onclick="pickSuggest('+n+')">'+(n+1)+' · '+esc(sg.why)+'</button>').join('')
    +'<button class="iconbtn copilotclose" onclick="cancelLine()" aria-label="Отменить построение">'+icon('close')+'</button></div>':'')
  +'<span class="grow"></span></div><div class="chartwrap" id="chartplot">'+chartCanvas(c,i)
  +(toolsOpen?'<div class="toolsrail">'
    +'<button class="railbtn'+(drawTool?' on':'')+'" onclick="drawingsMenu()" aria-label="Разметка" title="Разметка">'+icon('pencil')+'</button>'
    +'<button class="railbtn'+((c.ind&&c.ind.length)?' on':'')+'" onclick="indicatorsMenu()" aria-label="Индикаторы" title="Индикаторы">'+icon('chart')+'</button>'
    +'<button class="railbtn" onclick="chartSettingsMenu()" aria-label="Настройки графика" title="Настройки графика">'+icon('settings')+'</button>'
   +'</div>':'')
  +'<div class="ctbar">'
   +'<button class="ctpill" onclick="symbolDialog('+i+')" aria-label="Инструмент графика">'+esc(c.sym)+icon('chevron')+'</button>'
   +'<button class="ctpill" onclick="tfDialog('+i+')" aria-label="Таймфрейм графика">'+esc(c.tf)+'</button>'
   // Переключатель графиков живёт в том же ряду, что инструмент и таймфрейм.
   +(list.length>1?'<button class="ctpill" onclick="chartsDialog()" aria-label="Другой график бота">'+icon('chart')+'<span>'+(i+1)+'/'+list.length+'</span></button>':'')
  +'</div></div>'
  +((c.ind&&c.ind.length)?'<div class="indbar">'+c.ind.map(k=>'<span class="indchip">'+INDS[k]+'<button onclick="dropInd(\''+k+'\')" aria-label="Убрать">'+icon('close')+'</button></span>').join('')+'</div>':'')

  +'</section></div>'
 }
 // Без заголовка и кнопки добавления: карточки говорят сами за себя,
 // новый график добавляется словами в диалоге или из полноэкранного списка.
 return '<div class="charts'+(list.length>1?' two':'')+(list.length>2?' many':'')+'">'+list.map((c,i)=>chartCard(a,c,i)).join('')+'</div>'
}
function chartCard(a,c,i){
 // На холсте график — картинка: тап по нему раскрывает во весь экран, где он и оживает.
 return '<section class="chartcard'+(i?' second':'')+'"><div class="charthead"><button class="ctl instrument" onclick="symbolDialog('+i+')" aria-label="Инструмент графика"><span class="lbl">'+esc(c.sym)+'</span>'+icon('chevron')+'</button><button class="ctl" onclick="tfDialog('+i+')" aria-label="Таймфрейм графика"><span class="lbl">'+esc(c.tf)+'</span>'+icon('chevron')+'</button><span class="grow"></span></div>'
 +'<button class="chartwrap still"'+(i?'':' id="chartplot"')+' aria-label="Открыть график '+esc(chLabel(c))+' во весь экран" onclick="openFull('+i+')">'+chartCanvas(c,i)+'</button></section>'
}
/* ---------- свечной график на холсте ----------
   Движок взят из прототипа aurora (ручная отрисовка в canvas, без библиотек)
   и дополнен тем, чего там не было: панорамирование, масштаб и прицел с отсчётами. */
const TF_MIN={'5M':5,'15M':15,'1H':60,'4H':240,'1D':1440};
const BARS_TOTAL=260,BARS_VIEW=68;
// Свечи детерминированы: одна и та же пара «инструмент + таймфрейм» всегда даёт один ряд.
function series(c){
 let seed=[...(c.sym+c.tf)].reduce((n,ch)=>n+ch.charCodeAt(0),0);
 const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const {base,step}=instruments[c.sym],mins=TF_MIN[c.tf]||60,now=Date.now();
 let v=0;const raw=Array.from({length:BARS_TOTAL},(_,i)=>{
  const o=v,cl=o+(rnd()-.47)*.9+Math.sin(i*.19)*.22+Math.sin(i*.043)*.5;v=cl;
  return {o,c:cl,h:Math.max(o,cl)+rnd()*.42,l:Math.min(o,cl)-rnd()*.42}
 });
 const last=raw[raw.length-1].c;
 return raw.map((d,i)=>({o:base+(d.o-last)*step,c:base+(d.c-last)*step,h:base+(d.h-last)*step,l:base+(d.l-last)*step,t:now-(BARS_TOTAL-1-i)*mins*60000}))
}
const dayLbl=t=>new Date(t).toLocaleDateString('ru',{day:'numeric',month:'short'});
const timeLbl=t=>new Date(t).toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'});
function axisLbl(t,tf,prev){
 const mins=TF_MIN[tf]||60;
 if(mins>=240)return dayLbl(t);
 if(prev&&new Date(t).getDate()!==new Date(prev).getDate())return dayLbl(t);
 return timeLbl(t)
}
const tfFmt=(t,tf)=>(TF_MIN[tf]||60)>=1440?dayLbl(t):dayLbl(t)+', '+timeLbl(t);
// Положение окна переживает перерисовку: иначе любой тик сбрасывал бы прокрутку под рукой.
const chartView=new Map();
/* ---------- индикаторы: считаются по тому же ряду свечей ---------- */
const PANE_IND={rsi:1,macd:1};                 // рисуются отдельной панелью под ценой
const OVER_IND={ema:1,volume:1,atr:0};         // ema — поверх цены, volume — своей панелью
function emaArr(v,p){const k=2/(p+1);let e=v[0];return v.map((x,i)=>i?e=x*k+e*(1-k):e)}
function rsiArr(d,p){
 const out=[];let g=0,l=0;
 for(let i=1;i<d.length;i++){
  const ch=d[i].c-d[i-1].c,up=Math.max(0,ch),dn=Math.max(0,-ch);
  if(i<=p){g+=up/p;l+=dn/p}else{g=(g*(p-1)+up)/p;l=(l*(p-1)+dn)/p}
  out[i]=l===0?100:100-100/(1+g/l)
 }
 out[0]=out[1]??50;return out
}
function macdArr(d){
 const c=d.map(x=>x.c),f=emaArr(c,12),sl=emaArr(c,26);
 const line=f.map((x,i)=>x-sl[i]),sig=emaArr(line,9);
 return {line,sig,hist:line.map((x,i)=>x-sig[i])}
}
function atrArr(d,p){
 const tr=d.map((x,i)=>i?Math.max(x.h-x.l,Math.abs(x.h-d[i-1].c),Math.abs(x.l-d[i-1].c)):x.h-x.l);
 return emaArr(tr,p)
}
const cssVar=(el,n)=>getComputedStyle(el).getPropertyValue(n).trim()||'#888';
function niceStep(span){const raw=span/6,mag=Math.pow(10,Math.floor(Math.log10(raw)));return [1,2,2.5,5,10].map(m=>m*mag).find(v=>v>=raw)||mag*10}
function chartCanvas(ch,i){
 return '<canvas class="cv" data-ch="'+ch.id+'" role="img" aria-label="Свечной график '+esc(ch.sym)+' '+esc(ch.tf)+', демонстрационные данные"></canvas>'
 +'<div class="cvlegend" data-legend="'+ch.id+'"></div>'
}
function bindCharts(){document.querySelectorAll('canvas.cv').forEach(cv=>{if(!cv._bound)mountChart(cv);else cv._draw()})}
function mountChart(cv){
 cv._bound=true;
 const a=current(),id=cv.dataset.ch;
 const ch=a&&chartsOf(a).find(x=>x.id===id);if(!ch)return;
 const ctx=cv.getContext('2d'),wrap=cv.parentElement,legend=wrap.querySelector('[data-legend]');
 const data=series(ch);
 let v=chartView.get(id);
 if(!v||v.sym!==ch.sym||v.tf!==ch.tf)v={sym:ch.sym,tf:ch.tf,i0:BARS_TOTAL-BARS_VIEW,i1:BARS_TOTAL-1};
 chartView.set(id,v);
 let W=0,H=0,cross=null,drag=null;
 const PAD={l:8,r:64,t:12,b:26};
 // Панели индикаторов делят высоту с ценой: RSI, MACD и объём живут своими окнами.
 const panes=()=>chState(ch).ind.filter(k=>k!=='ema');
 const paneH=()=>{const n=panes().length;return n?Math.min(72,(H-PAD.t-PAD.b)*0.22):0};
 const priceBottom=()=>H-PAD.b-panes().length*(paneH()+8);
 const view=()=>data.slice(Math.max(0,Math.floor(v.i0)),Math.min(data.length,Math.ceil(v.i1)+1));
 function bounds(){const w=view();if(!w.length)return{lo:0,hi:1};
  const lo=Math.min(...w.map(d=>d.l)),hi=Math.max(...w.map(d=>d.h)),pad=(hi-lo)*.12||1;return {lo:lo-pad,hi:hi+pad}}
 const xOf=i=>PAD.l+(i-v.i0)/((v.i1-v.i0)||1)*(W-PAD.l-PAD.r);
 const iOf=x=>v.i0+(x-PAD.l)/((W-PAD.l-PAD.r)||1)*(v.i1-v.i0);
 function draw(){
  const r=cv.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
  if(!r.width||!r.height)return;
  W=r.width;H=r.height;
  cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
  const grid=cssVar(cv,'--grid'),axis=cssVar(cv,'--axis'),ink=cssVar(cv,'--axis-ink');
  const up=cssVar(cv,'--up'),down=cssVar(cv,'--down'),dr=cssVar(cv,'--draw'),chip=cssVar(cv,'--draw-chip');
  const {lo,hi}=bounds(),PB=priceBottom(),yOf=p=>PAD.t+(hi-p)/((hi-lo)||1)*(PB-PAD.t);
  ctx.font='11px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';ctx.textBaseline='middle';
  const st=niceStep(hi-lo),dec=st<1?4:st<10?2:0;ctx.lineWidth=1;
  const showGrid=!ch.opts||ch.opts.grid!==false;
  for(let p=Math.ceil(lo/st)*st;p<hi;p+=st){
   const y=Math.round(yOf(p))+.5;
   if(y>PB)continue;
   if(showGrid){ctx.strokeStyle=grid;ctx.setLineDash([3,5]);
    ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(W-PAD.r,y);ctx.stroke();ctx.setLineDash([])}
   ctx.fillStyle=ink;ctx.textAlign='left';
   ctx.fillText(p.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec}),W-PAD.r+7,y)
  }
  const win=view(),i0f=Math.floor(v.i0);
  ctx.textAlign='center';ctx.fillStyle=ink;
  let lastRight=-1e9,prevT=null,lastLbl=null;
  for(let k=0;k<win.length;k++){
   const d=win[k],x=xOf(i0f+k);
   if(x<PAD.l+18||x>W-PAD.r-18)continue;
   const t=axisLbl(d.t,ch.tf,prevT),w=ctx.measureText(t).width;
   if(x-w/2<lastRight+18)continue;            // не даём подписям наезжать
   if(t===lastLbl)continue;                   // и не повторяем одну и ту же дату дважды
   ctx.fillText(t,x,H-PAD.b/2);
   lastRight=x+w/2;prevT=d.t;lastLbl=t
  }
  const bw=Math.max(1.5,Math.min(14,(W-PAD.l-PAD.r)/((v.i1-v.i0)||1)*.68)),half=bw/2;
  for(let i=Math.max(0,Math.floor(v.i0));i<=Math.min(data.length-1,Math.ceil(v.i1));i++){
   const d=data[i],x=Math.round(xOf(i))+.5,col=d.c>=d.o?up:down;
   ctx.strokeStyle=col;ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(x,Math.round(yOf(d.h)));ctx.lineTo(x,Math.round(yOf(d.l)));ctx.stroke();
   const yT=Math.round(yOf(Math.max(d.o,d.c))),bh=Math.max(1,Math.round(yOf(Math.min(d.o,d.c)))-yT);
   ctx.fillStyle=col;ctx.fillRect(x-half,yT,bw,bh)
  }
  if(ch.drawing==='levels'){
   const w2=view(),top=Math.max(...w2.map(d=>d.h)),bot=Math.min(...w2.map(d=>d.l));
   [[top,'Сопротивление'],[bot,'Поддержка']].forEach(([p,t])=>{
    const y=Math.round(yOf(p))+.5;
    ctx.strokeStyle=dr;ctx.lineWidth=1.6;ctx.setLineDash([7,4]);
    ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(W-PAD.r,y);ctx.stroke();ctx.setLineDash([]);
    const tw=ctx.measureText(t).width+14;
    ctx.fillStyle=chip;ctx.beginPath();ctx.roundRect(PAD.l+8,y-20,tw,17,4);ctx.fill();
    ctx.fillStyle=dr;ctx.textAlign='left';ctx.fillText(t,PAD.l+15,y-11)
   })
  }
  if(ch.drawing==='channel'){
   const w2=view(),n=w2.length,mid=(n-1)/2,mean=w2.reduce((s,d)=>s+d.c,0)/n;
   const den=w2.reduce((s,d,i)=>s+(i-mid)**2,0)||1;
   const slope=w2.reduce((s,d,i)=>s+(i-mid)*(d.c-mean),0)/den,inter=mean-slope*mid;
   const hiOff=Math.max(...w2.map((d,i)=>d.h-(inter+slope*i))),loOff=Math.min(...w2.map((d,i)=>d.l-(inter+slope*i)));
   const sh=(ch.shift||0)*(hi-lo)*.1,yA=p=>yOf(p+sh);
   const x0=xOf(Math.floor(v.i0)),x1=xOf(Math.floor(v.i0)+n-1);
   ctx.fillStyle=dr;ctx.globalAlpha=.07;
   ctx.beginPath();ctx.moveTo(x0,yA(inter+hiOff));ctx.lineTo(x1,yA(inter+slope*(n-1)+hiOff));
   ctx.lineTo(x1,yA(inter+slope*(n-1)+loOff));ctx.lineTo(x0,yA(inter+loOff));ctx.closePath();ctx.fill();
   ctx.globalAlpha=1;ctx.strokeStyle=dr;ctx.lineWidth=1.8;
   [hiOff,loOff].forEach(off=>{ctx.beginPath();ctx.moveTo(x0,yA(inter+off));ctx.lineTo(x1,yA(inter+slope*(n-1)+off));ctx.stroke()});
   const t='Канал · демо',tw=ctx.measureText(t).width+14;
   ctx.fillStyle=chip;ctx.beginPath();ctx.roundRect(PAD.l+8,PAD.t+4,tw,18,4);ctx.fill();
   ctx.fillStyle=dr;ctx.textAlign='left';ctx.fillText(t,PAD.l+15,PAD.t+13)
  }
  // EMA ложится поверх цены
  if(chState(ch).ind.includes('ema')){
   const e=emaArr(data.map(x=>x.c),50);
   ctx.strokeStyle=dr;ctx.lineWidth=1.8;ctx.beginPath();
   let started=false;
   for(let i=Math.max(0,Math.floor(v.i0));i<=Math.min(data.length-1,Math.ceil(v.i1));i++){
    const x=xOf(i),y=yOf(e[i]);if(!started){ctx.moveTo(x,y);started=true}else ctx.lineTo(x,y)
   }
   ctx.stroke();
   ctx.fillStyle=chip;const et='EMA 50',ew=ctx.measureText(et).width+14;
   ctx.beginPath();ctx.roundRect(W-PAD.r-ew-10,PAD.t+4,ew,17,4);ctx.fill();
   ctx.fillStyle=dr;ctx.textAlign='center';ctx.fillText(et,W-PAD.r-ew/2-10,PAD.t+13)
  }
  // панели индикаторов под ценой
  const pl=panes(),ph=paneH();
  pl.forEach((k,n)=>{
   const top=PB+8+n*(ph+8),bot=top+ph;
   ctx.strokeStyle=grid;ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(PAD.l,top-4);ctx.lineTo(W-PAD.r,top-4);ctx.stroke();
   const i0=Math.max(0,Math.floor(v.i0)),i1=Math.min(data.length-1,Math.ceil(v.i1));
   ctx.fillStyle=ink;ctx.textAlign='left';ctx.font='10.5px -apple-system,BlinkMacSystemFont,sans-serif';
   ctx.fillText(INDS[k],PAD.l+2,top+7);
   ctx.font='11px -apple-system,BlinkMacSystemFont,sans-serif';
   if(k==='rsi'){
    const r=rsiArr(data,14),y=v2=>bot-(v2/100)*(bot-top);
    [70,30].forEach(lv=>{ctx.strokeStyle=grid;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(PAD.l,y(lv));ctx.lineTo(W-PAD.r,y(lv));ctx.stroke();ctx.setLineDash([]);
     ctx.fillStyle=ink;ctx.textAlign='left';ctx.fillText(String(lv),W-PAD.r+7,y(lv))});
    ctx.strokeStyle=dr;ctx.lineWidth=1.6;ctx.beginPath();
    for(let i=i0;i<=i1;i++){const x=xOf(i),yy=y(r[i]);i===i0?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}
    ctx.stroke()
   } else if(k==='macd'){
    const m=macdArr(data),win=[];for(let i=i0;i<=i1;i++)win.push(Math.abs(m.hist[i]),Math.abs(m.line[i]));
    const mx=Math.max(...win)||1,y=v2=>top+(1-(v2/mx+1)/2)*(bot-top),bw2=Math.max(1,(W-PAD.l-PAD.r)/((v.i1-v.i0)||1)*.6);
    ctx.strokeStyle=grid;ctx.beginPath();ctx.moveTo(PAD.l,y(0));ctx.lineTo(W-PAD.r,y(0));ctx.stroke();
    for(let i=i0;i<=i1;i++){const x=xOf(i),h0=y(0),h1=y(m.hist[i]);ctx.fillStyle=m.hist[i]>=0?up:down;ctx.fillRect(x-bw2/2,Math.min(h0,h1),bw2,Math.max(1,Math.abs(h1-h0)))}
    ctx.strokeStyle=dr;ctx.lineWidth=1.5;ctx.beginPath();
    for(let i=i0;i<=i1;i++){const x=xOf(i),yy=y(m.line[i]);i===i0?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.stroke();
    ctx.strokeStyle=ink;ctx.lineWidth=1.2;ctx.beginPath();
    for(let i=i0;i<=i1;i++){const x=xOf(i),yy=y(m.sig[i]);i===i0?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.stroke()
   } else if(k==='volume'){
    const win=[];for(let i=i0;i<=i1;i++)win.push(Math.abs(data[i].h-data[i].l));
    const mx=Math.max(...win)||1,bw2=Math.max(1,(W-PAD.l-PAD.r)/((v.i1-v.i0)||1)*.6);
    for(let i=i0;i<=i1;i++){const val=Math.abs(data[i].h-data[i].l),hh=(val/mx)*(bot-top);
     ctx.fillStyle=data[i].c>=data[i].o?up:down;ctx.globalAlpha=.55;ctx.fillRect(xOf(i)-bw2/2,bot-hh,bw2,hh);ctx.globalAlpha=1}
   } else if(k==='atr'){
    const at=atrArr(data,14),win=[];for(let i=i0;i<=i1;i++)win.push(at[i]);
    const mn=Math.min(...win),mx=Math.max(...win),y=v2=>bot-((v2-mn)/((mx-mn)||1))*(bot-top);
    ctx.strokeStyle=dr;ctx.lineWidth=1.6;ctx.beginPath();
    for(let i=i0;i<=i1;i++){const x=xOf(i),yy=y(at[i]);i===i0?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.stroke()
   }
  });
  // уровни, поставленные ботом или человеком — у каждого своя роль
  if(ch.levels&&ch.levels.length){
   for(const L of ch.levels){
    const y=Math.round(yOf(L.price))+.5;if(y<PAD.t||y>H-PAD.b)continue;
    ctx.strokeStyle=dr;ctx.lineWidth=1.6;ctx.setLineDash([7,4]);
    ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(W-PAD.r,y);ctx.stroke();ctx.setLineDash([]);
    const below=L.role==='low'||L.role==='pdl';
    const tx=L.tx||(L.role==='pdh'?'Вчера, максимум':L.role==='pdl'?'Вчера, минимум':below?'Поддержка':'Сопротивление');
    const tw=ctx.measureText(tx).width+14;
    ctx.fillStyle=chip;ctx.beginPath();ctx.roundRect(PAD.l+8,below?y+4:y-20,tw,17,4);ctx.fill();
    ctx.fillStyle=dr;ctx.textAlign='left';ctx.fillText(tx,PAD.l+15,below?y+13:y-11)
   }
  }
  // отметка, на которую увёл тап по сущности из каталога виджетов
  if(ch.focusAt){
   const F=ch.focusAt,fy=Math.round(yOf(F.price))+.5;
   if(F.i>=0&&F.i>=v.i0&&F.i<=v.i1){
    const fx=Math.round(xOf(F.i))+.5;
    ctx.strokeStyle=dr;ctx.lineWidth=1.2;ctx.setLineDash([3,4]);
    ctx.beginPath();ctx.moveTo(fx,PAD.t);ctx.lineTo(fx,priceBottom());ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=dr;ctx.beginPath();ctx.arc(fx,fy,4.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=cssVar(cv,'--card');ctx.lineWidth=2;ctx.beginPath();ctx.arc(fx,fy,4.5,0,Math.PI*2);ctx.stroke()
   }
  }
  // трендовые линии: поставленные руками или выбранные из подсказок
  if(ch.lines&&ch.lines.length){
   for(const ln of ch.lines){
    const tool=ln.tool||'trend';
    const k=(ln.p2-ln.p1)/((ln.i2-ln.i1)||1),at=i=>ln.p1+k*(i-ln.i1);
    ctx.strokeStyle=dr;ctx.lineWidth=2;
    if(tool==='hline'){
     const y=Math.round(yOf(ln.p1))+.5;
     ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(W-PAD.r,y);ctx.stroke();ctx.setLineDash([]);
     const tx=fmt(ln.p1,ch.sym),tw=ctx.measureText(tx).width+14;
     ctx.fillStyle=chip;ctx.beginPath();ctx.roundRect(PAD.l+8,y-20,tw,17,4);ctx.fill();
     ctx.fillStyle=dr;ctx.textAlign='left';ctx.fillText(tx,PAD.l+15,y-11);
     continue
    }
    if(tool==='rect'){
     const x1=xOf(ln.i1),x2=xOf(ln.i2),y1=yOf(ln.p1),y2=yOf(ln.p2);
     ctx.fillStyle=dr;ctx.globalAlpha=.1;ctx.fillRect(Math.min(x1,x2),Math.min(y1,y2),Math.abs(x2-x1),Math.abs(y2-y1));ctx.globalAlpha=1;
     ctx.strokeRect(Math.min(x1,x2),Math.min(y1,y2),Math.abs(x2-x1),Math.abs(y2-y1));
     continue
    }
    if(tool==='fib'){
     const hi2=Math.max(ln.p1,ln.p2),lo2=Math.min(ln.p1,ln.p2),x1=xOf(ln.i1),x2=xOf(ln.i2);
     [0,.236,.382,.5,.618,.786,1].forEach(f=>{
      const p=hi2-(hi2-lo2)*f,y=Math.round(yOf(p))+.5;
      ctx.strokeStyle=dr;ctx.globalAlpha=f===0||f===1?.9:.5;ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(Math.min(x1,x2),y);ctx.lineTo(W-PAD.r,y);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
      ctx.fillStyle=ink;ctx.textAlign='left';ctx.fillText(f.toFixed(3),W-PAD.r+7,y)
     });
     continue
    }
    if(tool==='channel'){
     const w2=Math.abs(ln.p2-ln.p1)*.6||1;
     [0,-w2].forEach(off=>{
      const L2=v.i0-2,R2=v.i1+2;
      ctx.globalAlpha=off?.7:1;
      ctx.beginPath();ctx.moveTo(xOf(L2),yOf(at(L2)+off));ctx.lineTo(xOf(R2),yOf(at(R2)+off));ctx.stroke();ctx.globalAlpha=1
     });
     continue
    }
    if(tool==='measure'){
     const x1=xOf(ln.i1),x2=xOf(ln.i2),y1=yOf(ln.p1),y2=yOf(ln.p2),d2=(ln.p2-ln.p1)/ln.p1*100;
     ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);
     ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
     const tx=pct(d2,true)+' · '+Math.abs(ln.i2-ln.i1)+' св.',tw=ctx.measureText(tx).width+14;
     ctx.fillStyle=chip;ctx.beginPath();ctx.roundRect((x1+x2)/2-tw/2,(y1+y2)/2-9,tw,18,4);ctx.fill();
     ctx.fillStyle=dr;ctx.textAlign='center';ctx.fillText(tx,(x1+x2)/2,(y1+y2)/2);
     continue
    }
    // трендовая — отрезок между точками; луч — вперёд от первой; прямая — в обе стороны
    const L=tool==='trend'?ln.i1:tool==='ray'?ln.i1:v.i0-2;
    const R=tool==='trend'?ln.i2:v.i1+2;
    ctx.beginPath();ctx.moveTo(xOf(L),yOf(at(L)));ctx.lineTo(xOf(R),yOf(at(R)));ctx.stroke();
    // опорные точки видны, чтобы было понятно, по чему построено
    [[ln.i1,ln.p1],[ln.i2,ln.p2]].forEach(([i,p])=>{ctx.fillStyle=dr;ctx.beginPath();ctx.arc(xOf(i),yOf(p),3.5,0,7);ctx.fill()});
    if(ln.kind&&tool!=='trend'){
     const tx=ln.kind==='low'?'Поддержка · тренд':'Сопротивление · тренд',tw=ctx.measureText(tx).width+14;
     const ty=Math.max(PAD.t+14,Math.min(PB-8,yOf(at(R))));
     ctx.fillStyle=chip;ctx.beginPath();ctx.roundRect(W-PAD.r-tw-8,ty-8,tw,17,4);ctx.fill();
     ctx.fillStyle=dr;ctx.textAlign='center';ctx.fillText(tx,W-PAD.r-tw/2-8,ty)
    } else if(ln.kind&&tool==='trend'){
     const tx=ln.kind==='low'?'Поддержка':'Сопротивление',tw=ctx.measureText(tx).width+14;
     const ex=xOf(ln.i2),ey=yOf(ln.p2);
     ctx.fillStyle=chip;ctx.beginPath();ctx.roundRect(Math.min(ex+8,W-PAD.r-tw),ey-8,tw,17,4);ctx.fill();
     ctx.fillStyle=dr;ctx.textAlign='center';ctx.fillText(tx,Math.min(ex+8,W-PAD.r-tw)+tw/2,ey)
    }
   }
  }
  // copilot: первая точка поставлена — показываем варианты второй
  if(ch.pending){
   const x1=xOf(ch.pending.i),y1=yOf(ch.pending.p);
   ctx.fillStyle=dr;ctx.beginPath();ctx.arc(x1,y1,4.5,0,7);ctx.fill();
   (ch.suggest||[]).forEach((sg,n)=>{
    const x2=xOf(sg.i),y2=yOf(sg.p);
    ctx.strokeStyle=dr;ctx.globalAlpha=.45;ctx.lineWidth=1.6;ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
    ctx.fillStyle=chip;ctx.beginPath();ctx.arc(x2,y2,11,0,7);ctx.fill();
    ctx.strokeStyle=dr;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x2,y2,11,0,7);ctx.stroke();
    ctx.fillStyle=dr;ctx.textAlign='center';ctx.fillText(String(n+1),x2,y2)
   })
  }
  // входы и выходы проверенной стратегии
  if(ch.markers&&ch.markers.length&&(!ch.opts||ch.opts.marks!==false)){
   for(const m of ch.markers){
    if(m.i<v.i0-1||m.i>v.i1+1)continue;
    const d=data[m.i];if(!d)continue;
    const x=xOf(m.i);
    ctx.fillStyle=m.dir==='in'?up:down;
    ctx.beginPath();
    if(m.dir==='in'){const y=yOf(d.l)+9;ctx.moveTo(x,y-6);ctx.lineTo(x-5,y+3);ctx.lineTo(x+5,y+3)}
    else{const y=yOf(d.h)-9;ctx.moveTo(x,y+6);ctx.lineTo(x-5,y-3);ctx.lineTo(x+5,y-3)}
    ctx.closePath();ctx.fill()
   }
  }
  const lastD=data[data.length-1],ly=Math.round(yOf(lastD.c))+.5,lcol=lastD.c>=lastD.o?up:down;
  if(ly>PAD.t&&ly<PB){
   ctx.strokeStyle=lcol;ctx.setLineDash([3,4]);ctx.globalAlpha=.65;ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(PAD.l,ly);ctx.lineTo(W-PAD.r,ly);ctx.stroke();
   ctx.setLineDash([]);ctx.globalAlpha=1;
   const lbl=fmt(lastD.c,ch.sym),lw=Math.min(PAD.r-6,ctx.measureText(lbl).width+12);
   ctx.fillStyle=lcol;ctx.beginPath();ctx.roundRect(W-PAD.r+4,ly-9,lw,18,4);ctx.fill();
   ctx.fillStyle=cssVar(cv,'--on-fill');ctx.textAlign='center';ctx.fillText(lbl,W-PAD.r+4+lw/2,ly)
  }
  if(cross&&cross.x>PAD.l&&cross.x<W-PAD.r&&cross.y>PAD.t&&cross.y<PB){
   const i=Math.max(0,Math.min(data.length-1,Math.round(iOf(cross.x)))),sx=Math.round(xOf(i))+.5,sy=Math.round(cross.y)+.5;
   const price=hi-(cross.y-PAD.t)/((PB-PAD.t)||1)*(hi-lo);
   ctx.strokeStyle=axis;ctx.setLineDash([4,4]);ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(PAD.l,sy);ctx.lineTo(W-PAD.r,sy);ctx.stroke();
   ctx.beginPath();ctx.moveTo(sx,PAD.t);ctx.lineTo(sx,H-PAD.b);ctx.stroke();ctx.setLineDash([]);
   const pl=fmt(price,ch.sym),pw=Math.min(PAD.r-6,ctx.measureText(pl).width+12);
   ctx.fillStyle=cssVar(cv,'--text');ctx.beginPath();ctx.roundRect(W-PAD.r+4,sy-9,pw,18,4);ctx.fill();
   ctx.fillStyle=cssVar(cv,'--surface');ctx.textAlign='center';ctx.fillText(pl,W-PAD.r+4+pw/2,sy);
   const dl=tfFmt(data[i].t,ch.tf),dw=ctx.measureText(dl).width+14,dx=Math.min(Math.max(sx-dw/2,PAD.l),W-PAD.r-dw);
   ctx.fillStyle=cssVar(cv,'--text');ctx.beginPath();ctx.roundRect(dx,H-PAD.b-4,dw,17,4);ctx.fill();
   ctx.fillStyle=cssVar(cv,'--surface');ctx.fillText(dl,dx+dw/2,H-PAD.b+4);
   showLegend(data[i])
  } else if(legend)legend.classList.remove('on')
 }
 function showLegend(d){
  if(!legend)return;
  const c=d.c>=d.o?'up':'down';
  legend.className='cvlegend on';
  legend.innerHTML='<b>'+esc(ch.sym)+'</b><em>'+esc(ch.tf)+'</em>'
   +'<i>O</i><b class="'+c+'">'+fmt(d.o,ch.sym)+'</b><i>H</i><b class="'+c+'">'+fmt(d.h,ch.sym)+'</b>'
   +'<i>L</i><b class="'+c+'">'+fmt(d.l,ch.sym)+'</b><i>C</i><b class="'+c+'">'+fmt(d.c,ch.sym)+'</b>'
 }
 function clamp(){
  const span=Math.max(12,Math.min(BARS_TOTAL,v.i1-v.i0));
  v.i1=Math.min(BARS_TOTAL-1+span*.08,Math.max(span,v.i1));
  v.i0=v.i1-span
 }
 cv._draw=draw;
 // Copilot трендовой линии: человек ставит первую точку, бот предлагает логичные вторые.
 cv._pick=(px,py)=>{
  const i=Math.max(0,Math.min(data.length-1,Math.round(iOf(px))));
  const {lo,hi}=bounds();
  const p=hi-(py-PAD.t)/((priceBottom()-PAD.t)||1)*(hi-lo);
  return {i,p}
 };
 cv._suggest=from=>{
  const v2=chartView.get(ch.id)||v,i1=Math.min(data.length-1,Math.ceil(v2.i1));
  const gap=Math.max(6,Math.round((v2.i1-v2.i0)*0.08));
  const after=data.slice(from.i+gap,i1+1).map((d,k)=>({d,i:from.i+gap+k}));
  if(!after.length)return [];
  const up=from.p<data[from.i].c;
  const hiP=after.reduce((b,x)=>x.d.h>b.d.h?x:b,after[0]);
  const loP=after.reduce((b,x)=>x.d.l<b.d.l?x:b,after[0]);
  const last=after[after.length-1];
  const raw=[
   {i:hiP.i,p:hiP.d.h,why:'по максимуму'},
   {i:loP.i,p:loP.d.l,why:'по минимуму'},
   {i:last.i,p:last.d.c,why:'до последней свечи'}
  ];
  const minGap=Math.max(5,Math.round((v2.i1-v2.i0)*0.06)),out=[];
  for(const sg of raw){
   if(sg.i<v2.i0||sg.i>v2.i1)continue;                    // за окном кружок не виден
   if(out.some(x=>Math.abs(x.i-sg.i)<minGap))continue;    // слишком близко к уже взятому
   out.push(sg)
  }
  // если вариантов осталось мало — добавим середину участка, чтобы выбор был не из одного
  if(out.length<2&&after.length>4){
   const mid=after[Math.floor(after.length/2)];
   out.push({i:mid.i,p:mid.d.c,why:'до середины участка'})
  }
  return out
 };
 // На холсте график неинтерактивен: ни прицела, ни протяжки, ни масштаба — только картинка.
 if(!expanded){cv.style.pointerEvents='none';requestAnimationFrame(draw);return}
 // тащить — сдвиг окна, колесо — масштаб к точке под курсором, двойной щелчок — вернуть вид
 let tapAt=null;
 cv.onpointerdown=e=>{
  tapAt={x:e.clientX,y:e.clientY,t:Date.now()};
  if(lineModeOn()){
   const pt=cv._pick(e.offsetX,e.offsetY);
   if(toolOf(drawTool)&&toolOf(drawTool).pts===1){placeSingle(ch,pt);return}
   if(ch.pending){
    // тап рядом с подсказкой — принять её, иначе поставить свою вторую точку
    const near=(ch.suggest||[]).find(sg=>Math.abs(xOf(sg.i)-e.offsetX)<16&&Math.abs(((()=>{const {lo,hi}=bounds();return PAD.t+(hi-sg.p)/((hi-lo)||1)*(priceBottom()-PAD.t)})())-e.offsetY)<16);
    finishLine(ch,near||pt);
   } else {
    ch.pending=pt;ch.suggest=cv._suggest(pt);
    dock='small';
    say(current(),'Поставил первую точку. Вот три логичных вторых — выберите одним тапом или укажите свою.',
     {title:'Трендовая линия',tag:'Подсказка',lines:(ch.suggest||[]).map((sg,n)=>(n+1)+' — '+sg.why),note:'Тап по кружку на графике или по строке ниже.',actions:(ch.suggest||[]).map((sg,n)=>'Вариант '+(n+1)+' — '+sg.why)});
    render()
   }
   return
  }
  drag={x:e.clientX,i0:v.i0,i1:v.i1};cross={x:e.offsetX,y:e.offsetY};
  try{cv.setPointerCapture?.(e.pointerId)}catch{}
  draw()
 };
 cv.onpointermove=e=>{
  cross={x:e.offsetX,y:e.offsetY};
  if(drag){const k=(v.i1-v.i0)/((W-PAD.l-PAD.r)||1),d=(e.clientX-drag.x)*k;v.i0=drag.i0-d;v.i1=drag.i1-d;clamp();noteUserMove(ch,'сдвинули')}
  draw()
 };
 cv.onpointerup=e=>{
  drag=null;
  // короткий тап без протяжки и без выбранного инструмента — показать/скрыть панель разметки
  if(tapAt&&!lineModeOn()&&Date.now()-tapAt.t<350&&Math.hypot(e.clientX-tapAt.x,e.clientY-tapAt.y)<7){toggleTools()}
  tapAt=null
 };
 cv.onpointercancel=()=>{drag=null};
 cv.onpointerleave=()=>{drag=null;cross=null;draw()};
 cv.onwheel=e=>{
  e.preventDefault();
  const anchor=Math.max(0,Math.min(BARS_TOTAL-1,iOf(e.offsetX)));
  const k=Math.exp((e.deltaY||0)*.0016),span=(v.i1-v.i0)*k,ratio=(anchor-v.i0)/((v.i1-v.i0)||1);
  v.i0=anchor-span*ratio;v.i1=v.i0+span;clamp();noteUserMove(ch,'изменили масштаб');draw()
 };
 cv.ondblclick=()=>{v.i0=BARS_TOTAL-BARS_VIEW;v.i1=BARS_TOTAL-1;draw()};
 if(!window._cvResize){window._cvResize=true;window.addEventListener('resize',()=>bindCharts())}
 requestAnimationFrame(draw)
}

/* ---------- рабочее пространство бота ----------
   Один холст и один постоянный диалог. Для торгового бота главный элемент — график.
   Ниже лежат не все созданные объекты, а только те, что сейчас в работе:
   активная стратегия и её результат, живые задачи, свежий алгоритм.
   Устаревшее уходит в историю бота и достаётся оттуда или по запросу в диалоге. */
const stratsOf=a=>Array.isArray(a.strategies)?a.strategies:[];
function activeStrat(a){const l=stratsOf(a);return l.find(x=>x.id===a.stratId)||l[l.length-1]||null}
function newStrat(a,idea){
 const st={id:uid(),name:idea.sym+' · '+idea.tf,sym:idea.sym,tf:idea.tf,idea,runs:[],subbots:[],created:clock()};
 a.strategies=stratsOf(a);a.strategies.push(st);a.stratId=st.id;return st
}
function openStrat(id){const a=current();if(a){a.stratId=id;closeDialog();render();strategyModal()}}
function dropJob(id){const a=current();if(!a)return;a.jobs=(a.jobs||[]).filter(j=>j.id!==id);render()}

// Что держим на холсте: активная стратегия, её свежий алгоритм, живые задачи.
function liveObjects(a){
 const out=[],st=activeStrat(a);
 if(st)out.push({k:'strat',st});
 const f=filesOf(a).filter(x=>!st||x.sym===st.sym).slice(-1)[0]||filesOf(a).slice(-1)[0];
 if(f)out.push({k:'algo',f});
 (a.jobs||[]).slice(-2).forEach(j=>out.push({k:'job',j}));
 return out
}
function workspaceHTML(a){
 let s=(kindOf(a)==='trade'&&!a.account?accountBanner(a):'')+chartHTML(a);
 const objs=liveObjects(a);
 s+=objs.map(o=>o.k==='strat'?strategyStrip(a):o.k==='algo'?algoRow(o.f):jobRow(o.j)).join('');
 s+=marketWidget(a)+newsWidget(a)+eventsWidget(a);
 const old=stratsOf(a).length+filesOf(a).length+(a.log||[]).length;
 if(old>2)s+='<button class="ghostrow fullwidth" onclick="historyOfBot()">'+icon('pin')+'<span class="grow">История бота</span>'+icon('chevron')+'</button>';
 return s
}
// Маленький маркетинговый баннер: подключение счёта, пока его нет.
function accountBanner(a){
 if(a.bannerOff)return '';
 return '<div class="promo"><span class="promoico">'+icon('wallet')+'</span>'
  +'<div class="grow"><b>Подключите счёт</b><small>Бот посчитает объём и риск по вашему балансу</small></div>'
  +'<button class="promobtn" onclick="accountDialog()">Подключить</button>'
  +'<button class="iconbtn promoclose" aria-label="Скрыть" onclick="hideBanner()">'+icon('close')+'</button></div>'
}
function hideBanner(){const a=current();if(a){a.bannerOff=true;render()}}
/* ---------- виджеты рабочего стола ----------
   Не разделы и не админка: это то, что относится к инструменту, с которым бот работает.
   Данные демонстрационные и детерминированные — одна и та же пара даёт один и тот же набор. */
function seedOf(str){let s=[...str].reduce((n,c)=>n+c.charCodeAt(0),0);return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const NEWS_BANK={
 'BTC/USD':[['Приток в спотовые ETF третью неделю подряд','рынок','высокое'],['Хешрейт обновил максимум, комиссии выросли','сеть','среднее'],['Крупный держатель перевёл 2 100 BTC на биржу','потоки','среднее'],['Регулятор ЕС смягчил требования к кастодианам','регулирование','низкое']],
 'ETH/USD':[['Доля стейкинга превысила 30% предложения','сеть','высокое'],['Комиссии в L2 упали до минимума за год','сеть','среднее'],['Обновление клиента перенесено на месяц','разработка','среднее'],['Отток из фондов замедлился','потоки','низкое']],
 'XAU/USD':[['Центробанки нарастили закупки золота','спрос','высокое'],['Доходности десятилеток снизились','ставки','высокое'],['Промышленный спрос ниже прогноза','спрос','низкое'],['Доллар укрепился к корзине валют','валюты','среднее']],
 'EUR/USD':[['Инфляция в еврозоне замедлилась','макро','высокое'],['ЕЦБ намекнул на паузу','ставки','высокое'],['Деловая активность в Германии выросла','макро','среднее'],['Торговый баланс лучше ожиданий','макро','низкое']],
 'NAS100':[['Отчёты крупных技术 компаний выше прогноза','отчёты','высокое'],['Полупроводники тянут индекс вверх','сектор','среднее'],['Доходности давят на оценки','ставки','среднее'],['Объёмы ниже средних','рынок','низкое']]
};
function newsOf(sym){
 const rnd=seedOf('news'+sym),bank=NEWS_BANK[sym]||NEWS_BANK['BTC/USD'];
 return bank.map((n,i)=>({title:n[0],tag:n[1],impact:n[2],mins:8+Math.floor(rnd()*300)+i*17}))
  .sort((a,b)=>a.mins-b.mins)
}
const agoText=m=>m<60?m+' мин назад':Math.floor(m/60)+' ч назад';
function newsWidget(a){
 const c=focusCh(a);if(!c)return '';
 const list=newsOf(c.sym).slice(0,3);
 return '<div class="wcard"><div class="whead"><b>Новости · '+esc(c.sym)+'</b><button class="tagbtn" onclick="newsSheet()">Все</button></div>'
  +list.map(n=>'<button class="newsrow" onclick="newsSheet()"><span class="dotimp '+(n.impact==='высокое'?'hi':n.impact==='среднее'?'mid':'low')+'"></span><span class="grow"><b>'+esc(n.title)+'</b><small>'+esc(n.tag+' · '+agoText(n.mins))+'</small></span></button>').join('')
  +'</div>'
}
function newsSheet(){
 const a=current(),c=a&&focusCh(a);if(!c)return;
 openSheet('Новости · '+esc(c.sym),
  newsOf(c.sym).map(n=>'<div class="newsrow static"><span class="dotimp '+(n.impact==='высокое'?'hi':n.impact==='среднее'?'mid':'low')+'"></span><span class="grow"><b>'+esc(n.title)+'</b><small>'+esc(n.tag+' · '+agoText(n.mins)+' · влияние '+n.impact)+'</small></span></div>').join('')
  +'<div class="notice formgap">Демонстрационная лента: реального источника новостей в прототипе нет.</div>')
}
// Соседние рынки: тап переключает график бота на этот инструмент.
function marketWidget(a){
 const c=focusCh(a);if(!c)return '';
 const syms=Object.keys(instruments);
 return '<div class="wcard"><div class="whead"><b>Рынки</b></div><div class="mkrow">'
  +syms.map(sym=>{
   const rnd=seedOf('mk'+sym),ch=(rnd()-.45)*4.2,up=ch>=0;
   return '<button class="mkcell'+(sym===c.sym?' on':'')+'" onclick="switchSym(\''+sym+'\')"><b>'+esc(sym)+'</b><span class="'+(up?'up':'down')+'">'+(up?'+':'−')+Math.abs(ch).toFixed(2)+'%</span></button>'
  }).join('')+'</div></div>'
}
function switchSym(sym){
 const a=current(),c=a&&focusCh(a);if(!c||c.sym===sym)return;
 c.sym=sym;c.drawing=null;c.levels=[];c.lines=[];c.markers=null;chartView.delete(c.id);
 say(a,'Открыл '+sym+' · '+c.tf+'. Разметку с прошлого инструмента снял.');render()
}
// Ближайшие события по инструменту — то, что сдвинет цену.
const EVENTS={
 'BTC/USD':[['Экспирация опционов','пт, 10:00'],['Данные по ETF-потокам','вт, 22:00']],
 'ETH/USD':[['Обновление сети','чт, 14:00'],['Отчёт по стейкингу','пн, 09:00']],
 'XAU/USD':[['Решение ФРС по ставке','ср, 21:00'],['Инфляция в США','чт, 15:30']],
 'EUR/USD':[['Заседание ЕЦБ','чт, 14:45'],['Индексы PMI','пн, 11:00']],
 'NAS100':[['Отчёты бигтеха','вт, после закрытия'],['Данные по занятости','пт, 15:30']]
};
function eventsWidget(a){
 const c=focusCh(a);if(!c)return '';
 const list=EVENTS[c.sym]||EVENTS['BTC/USD'];
 return '<div class="wcard"><div class="whead"><b>Ближайшие события</b></div>'
  +list.map(e=>'<div class="evrow"><span class="grow">'+esc(e[0])+'</span><span class="tag">'+esc(e[1])+'</span></div>').join('')
  +'</div>'
}

function algoRow(f){
 return '<button class="thinrow fullwidth" onclick="openFile(\''+f.id+'\')">'+icon('code')+'<span class="grow">'+esc(f.name)+'</span><span class="tag">'+esc(f.bt.ret)+'</span>'+icon('chevron')+'</button>'
}
function jobRow(j){
 return '<div class="thinrow fullwidth">'+icon('bell')+'<span class="grow">'+esc(j.title)+'</span><span class="tag">'+esc(j.when)+'</span><button class="tagbtn" onclick="dropJob(\''+j.id+'\')">Убрать</button></div>'
}
// История бота — всё, что он сделал, одним списком. Открывается по надобности.
// Облачная среда бота: его машина, браузер и инструменты. Всё принадлежит боту.
function envState(a){
 a.env=a.env||{up:'4 ч 12 мин',region:'eu-central',cpu:12+Math.floor(Math.random()*9),ram:38,
  page:{title:'Рыночные данные · '+(activeStrat(a)?activeStrat(a).sym:'BTC/USD'),url:'data.chartix.local/candles'}};
 return a.env
}
function envSheet(){
 const a=current();if(!a)return;
 const e=envState(a),files=filesOf(a),busy=live(a.id)[0];
 modal('Облачная среда · '+esc(a.name),
  '<div class="envhead"><span class="livedot2"></span><div class="grow"><b>Машина запущена</b><small>'+esc(e.region+' · аптайм '+e.up)+'</small></div><button class="tagbtn" onclick="envRestart()">Перезапустить</button></div>'
  +'<div class="summarygrid tight"><div class="stat"><b>'+e.cpu+'%</b><small>Процессор</small></div><div class="stat"><b>'+e.ram+'%</b><small>Память</small></div></div>'
  +'<div class="sectionlabel">Браузер бота</div>'
  +'<div class="browser"><div class="browserbar"><span class="dots"><i></i><i></i><i></i></span><span class="addr">'+esc(e.page.url)+'</span></div>'
  +'<div class="browserview">'+(busy?'<span class="spin"></span><p>'+esc(step(busy))+'</p>':'<p>'+esc(e.page.title)+'</p><small>Страница открыта ботом</small>')+'</div></div>'
  +'<div class="sectionlabel">Инструменты</div>'
  +['Python 3.12','Браузер','Терминал','Рыночные данные'].map(t=>'<div class="settingsrow"><span>'+t+'</span><span class="val">готов</span></div>').join('')
  +(files.length?'<div class="sectionlabel">Файлы в среде</div>'+files.slice().reverse().map(f=>'<button class="settingsrow fullwidth" style="text-align:left" onclick="closeDialog();openFile(\''+f.id+'\')"><span>'+esc(f.name)+'</span><span class="val">'+esc(f.time)+' '+icon('chevron')+'</span></button>').join(''):'')
  +'<div class="notice formgap">Демонстрация: настоящей виртуальной машины и браузера в прототипе нет.</div>'
  +'<button class="ghostrow fullwidth" onclick="closeDialog();settingsDialog()">'+icon('settings')+'<span class="grow">Настройки бота</span>'+icon('chevron')+'</button>')
}
function envRestart(){
 const a=current();if(!a)return;
 a.env=null;a.log=a.log||[];a.log.push({text:'Облачная среда перезапущена',time:clock()});
 closeDialog();say(a,'Перезапустил облачную среду. Машина поднята заново, файлы на месте.');render()
}
function historyOfBot(){
 const a=current();if(!a)return;
 const strats=stratsOf(a),files=filesOf(a),jobs=a.jobs||[],log=a.log||[];
 const row=(t,sub,click)=>'<button class="settingsrow fullwidth" style="text-align:left"'+(click?' onclick="'+click+'"':'')+'><span>'+esc(t)+'</span><span class="val">'+esc(sub)+'</span></button>';
 modal('История бота · '+esc(a.name),
  (strats.length?'<div class="sectionlabel" style="margin-top:0">Стратегии</div>'+strats.slice().reverse().map(st=>{const c=st.runs[st.runs.length-1];return row(st.name,(c?c.bt.ret+' · проверок '+st.runs.length:'готовится'),'openStrat(\''+st.id+'\')')}).join(''):'')
  +(files.length?'<div class="sectionlabel">Алгоритмы</div>'+files.slice().reverse().map(f=>row(f.name,f.time,'closeDialog();openFile(\''+f.id+'\')')).join(''):'')
  +(jobs.length?'<div class="sectionlabel">Регулярные задачи</div>'+jobs.slice().reverse().map(j=>row(j.title,j.when)).join(''):'')
  +(log.length?'<div class="sectionlabel">Что делал</div>'+log.slice().reverse().map(x=>'<div class="logrow">'+esc(x.text)+'<small>'+esc(x.time)+'</small></div>').join(''):''))
}
function riskHTML(a){
 const peers=state.agents.filter(x=>x.id!==a.id&&kindOf(x)==='trade'),missing=peers.filter(x=>!x.risk),busy=live();
 return '<div class="intro row between"><div><h2>Команда</h2><p>Кто чем занят и где нет ограничений</p></div><span class="tag">Демо</span></div><div class="summarygrid"><div class="stat"><b>'+state.agents.filter(x=>x.id!==a.id).length+'</b><small>Ботов</small></div><div class="stat"><b>'+busy.length+'</b><small>Сейчас работают</small></div><div class="stat"><b>'+peers.filter(x=>x.account).length+'/'+peers.length+'</b><small>Со счётом</small></div><div class="stat"><b>'+missing.length+'</b><small>Без лимита риска</small></div></div><div class="sectionlabel">Торговые помощники</div>'
 +(peers.length?peers.map(x=>'<button class="riskitem fullwidth" style="text-align:left" onclick="openAgent(\''+x.id+'\')"><div class="row">'+avatar(x)+'<div class="grow"><h3>'+esc(x.name)+'</h3><small>'+esc(chLabel(chartsOf(x)[0])+(chartsOf(x).length>1?' · графиков '+chartsOf(x).length:''))+(x.account?' · '+esc(x.account.broker):'')+'</small></div><span class="tag">'+(x.risk?x.risk+'%':'Риск не задан')+'</span></div><p>'+(x.risk?'Лимит на сделку сохранён в поручениях.':'Нужно задать максимальный риск на сделку.')+'</p></button>').join(''):'<div class="notice">Пока нет торговых ботов. Создайте одного через «+».</div>')
}
function infoHTML(a){
 const done=a.tasks.length,r=live(a.id)[0];
 return '<div class="intro row between"><div><h2>'+esc(roles[a.role].name)+'</h2><p>'+esc(roles[a.role].sub)+'</p></div><span class="tag">Без графика</span></div><div class="summarygrid"><div class="stat"><b>'+done+'</b><small>Выполнено задач</small></div><div class="stat"><b>'+(r?'В работе':a.paused?'Пауза':'Свободен')+'</b><small>Статус</small></div></div>'
 +(a.notes&&a.notes.length?'<div class="sectionlabel">Заметки и напоминания</div>'+a.notes.slice(-6).reverse().map(n=>'<div class="logrow">'+esc(n.text)+'<small>'+esc(n.time)+'</small></div>').join(''):'')
}

/* ---------- док и сообщения ---------- */
function quickFor(a){const k=kindOf(a);
 if(a.role==='quant')return [activeStrat(a)?'Измени стоп до 2%':'Проверь идею: пробой диапазона по биткоину','Подбери параметры подботом','История проверок','Построй канал'];
 if(k==='trade')return activeStrat(a)?['Измени стоп до 1%','Подбери параметры подботом','История проверок','Построй канал']:['Проверь стратегию: пробой диапазона','Построй канал','Отметь уровни',a.account?'Покажи счёт':'Подключи счёт'];
 if(k==='ops')return ['Кто сейчас работает','Проверь риски команды','Установи всем риск 1%'];
 if(a.role==='helper')return ['Покажи заметки','Напомни про отчёт в 18:00'];
 if(a.role==='news')return ['Сводка новостей','Что важного сегодня'];
 return ['Собери отчёт','Сравни BTC и золото']}
function chatHTML(a){
 return '<div class="messages" id="messages"><div class="daypill"><span>Сегодня</span></div>'+a.messages.map((m,i,l)=>messageHTML(a,m,l[i+1]&&l[i+1].role===m.role,i)).join('')+'</div><div class="quickactions">'+quickFor(a).map(q=>'<button onclick="window.command(\''+q+'\')">'+q+'</button>').join('')+'</div>'
}
// Шапка шторки. Вместо крестика — обмен: экран и шторка меняются содержимым.
// Когда в шторке рабочий стол, шапка видна и в свёрнутом виде: это его корешок с ценой.
function dockTitleHTML(a,sw){
 // Шапка шторки: что в ней лежит и кнопка обмена слоями. Закрыть шторку — потянуть вниз за ручку или за саму шапку.
 const swap=expanded?'':'<button class="iconbtn swapbtn" aria-label="'+(sw?'Поменять слои: дашборд вниз, диалог в шторку':'Поменять слои: диалог вниз, дашборд в шторку')+'" title="Поменять слои" onclick="swapContent()">'+icon('swap')+'</button>';
 return '<div class="docktitle">'+avatar(a)+'<b class="grow">'+(sw?esc(a.name):'Диалог с ботом')+'</b>'+swap+'</div>'
}
function dockHTML(a,sw){
 const h=dock==='small'?'118px':dock==='large'?'85%':dock==='half'?'57%':dock;
 // Шторка — только содержимое. Строка ввода принадлежит ассистенту и стоит поверх обоих слоёв,
 // шторка раскрывается из-под неё: ручка сидит на самой строке.
 return '<section class="dock '+(dock==='small'?'collapsed':'')+(sw?' swapped':'')+'" id="dock" style="--dock:'+h+'"><button type="button" class="dockhandle sheethandle" aria-label="Потяните вниз, чтобы свернуть шторку"><span></span></button>'+dockTitleHTML(a,sw)+(sw?'<div class="dockdash">'+dashHTML(a)+'</div>':chatHTML(a))+'</section>'
 +'<div class="chatbar" id="chatbar">'+composerHTML()+'</div>'
}
function composerHTML(){
 return '<form class="composer" id="composer"><button type="button" class="dockhandle pillhandle" id="dockhandle" aria-label="Потяните вверх, чтобы открыть шторку"><span></span></button>'
 +'<div class="inputbox"><textarea rows="1" id="prompt" aria-label="Поручение боту" placeholder="Поручите задачу…"></textarea><button class="iconbtn send sendbtn" aria-label="Отправить поручение">'+icon('arrow')+'</button></div>'
 +'<button type="button" class="iconbtn circbtn" id="micbtn" aria-label="Удерживайте, чтобы надиктовать. Отпустите — поручение уйдёт">'+icon('mic')+'</button></form>'
}
function messageHTML(a,m,grouped,i){
 const r=m.run&&state.runs.find(x=>x.id===m.run);
 if(r&&!r.done)return '<div class="msg assistant'+(grouped?' grouped':'')+'"><div class="bubble"><div class="runcard"><div class="row"><span class="spin"></span><b>'+esc(r.title)+'</b></div><p>'+esc(step(r))+'</p><div class="bar"><i style="width:'+Math.min(98,Math.round((Date.now()-r.start)/r.dur*100))+'%"></i></div></div><time>'+clock(m.ts)+'</time></div></div>';
 return '<div class="msg '+m.role+(grouped?' grouped':'')+'"><div class="bubble">'+(m.text?'<div class="body">'+esc(m.text)+'</div>':'')+(m.card?cardHTML(m.card,m,i):'')+(m.result?'<div class="result">'+esc(m.result)+'</div>':'')+'<time>'+clock(m.ts)+(m.role==='user'?icon('check'):'')+'</time></div></div>'
}
function cardHTML(c,m,i){
 return '<div class="msgcard">'+(c.title?'<div class="row between"><b>'+esc(c.title)+'</b>'+(c.tag?'<span class="tag">'+esc(c.tag)+'</span>':'')+'</div>':'')
 +(c.rows?'<div class="cardrows">'+c.rows.map(([k,v])=>'<div class="cardrow"><span>'+esc(k)+'</span><b>'+esc(v)+'</b></div>').join('')+'</div>':'')
 +(c.lines?'<ul class="cardlines">'+c.lines.map(l=>'<li>'+esc(l)+'</li>').join('')+'</ul>':'')
 +(c.note?'<small class="cardnote">'+esc(c.note)+'</small>':'')
 +(c.actions?(m&&m.answered
   ?'<small class="cardnote">Ответ: '+esc(m.answer)+'</small>'
   :'<div class="cardactions">'+c.actions.map(l=>'<button class="chip" onclick="cardAnswer('+i+',\''+l.replace(/'/g,"")+'\')">'+esc(l)+'</button>').join('')+'</div>'):'')
 +'</div>'
}
// Ответ на карточку уточнения: тап по варианту = поручение, повторно нажать нельзя.
function cardAnswer(i,label){
 const a=current();if(!a)return;
 const m=a.messages[i];
 if(m&&!m.answered){m.answered=true;m.answer=label}
 window.command(label)
}
function scrollMessages(){const m=$('messages');if(m)m.scrollTop=m.scrollHeight}
/* Плавающая кнопка режима «только график»: тап возвращает панель и раскрывает
   диалог, удержание — голосовой ввод. Та же механика, что была у прежнего FAB. */

/* ---------- экранная клавиатура ----------
   Не системная, а нарисованная: прототип смотрят в браузере на десктопе,
   а вёрстку панели нужно видеть с поднятой клавиатурой. */
const KB_ROWS=[['й','ц','у','к','е','н','г','ш','щ','з','х','ъ'],['ф','ы','в','а','п','р','о','л','д','ж','э'],['я','ч','с','м','и','т','ь','б','ю']];
const KB_NUM=[['1','2','3','4','5','6','7','8','9','0'],['-','/',':',';','(',')','₽','&','@','"'],['.',',','?','!','\'','%']];
let kbNum=false,kbShift=false;
function keyboardHTML(){
 const rows=kbNum?KB_NUM:KB_ROWS;
 const key=(ch,cls)=>'<button class="key'+(cls?' '+cls:'')+'" data-k="'+esc(ch)+'">'+esc(kbShift&&!kbNum?ch.toUpperCase():ch)+'</button>';
 let s='<div class="kbd" id="kbd">';
 rows.forEach((r,i)=>{
  s+='<div class="kbrow">';
  if(i===2&&!kbNum)s+='<button class="key wide'+(kbShift?' on':'')+'" data-a="shift">⇧</button>';
  s+=r.map(ch=>key(ch)).join('');
  if(i===2)s+='<button class="key wide" data-a="back">⌫</button>';
  s+='</div>'
 });
 s+='<div class="kbrow">'
  +'<button class="key wide" data-a="num">'+(kbNum?'АБВ':'123')+'</button>'
  +'<button class="key" data-a="mic">'+icon('mic')+'</button>'
  +'<button class="key space" data-k=" ">пробел</button>'
  +'<button class="key send" data-a="send">'+icon('arrow')+'</button>'
  +'<button class="key" data-a="hide">⌄</button>'
 +'</div></div>';
 return s
}
/* Клавиатуру поднимаем и убираем без перерисовки экрана.
   Перерисовка на нажатии пересоздавала поле ввода раньше, чем браузер
   успевал отдать ему фокус, — оттого клавиатура открывалась через раз. */

/* Щель равна высоте своего содержимого: строка ввода растёт по мере набора,
   и панель растёт вместе с ней. Рабочее пространство при этом не закрывается. */
function syncPeek(){
 const m=document.querySelector('.main'),d=$('dock');
 if(!m||!d)return;
 // полоса ввода диалога: шторка стоит на ней, диалог кончается над обеими
 const bar=$('chatbar'),bh=bar?Math.round(bar.getBoundingClientRect().height):0;
 m.style.setProperty('--barh',bh+'px');
 if(dock!=='small')return;
 const h=Math.round(d.getBoundingClientRect().height);
 if(h)m.style.setProperty('--peek',(bar?Math.min(360,h+bh):Math.max(118,Math.min(260,h)))+'px')
}
function growPrompt(){
 const t=$('prompt');if(!t)return;
 t.style.height='auto';
 t.style.height=Math.min(110,Math.max(40,t.scrollHeight))+'px';
 syncPeek()
}

function openKeyboard(){return; // экранной клавиатуры прототипа больше нет: работает системная

 if(kb)return;const m=document.querySelector('.main');if(!m)return;
 kb=true;m.classList.add('kb');
 // Панель не трогаем: рабочее пространство остаётся на экране, раскрывает её сам пользователь.
 m.insertAdjacentHTML('beforeend',keyboardHTML());bindKeyboard();
 // диалог на экране поджимается клавиатурой — последние сообщения держим на виду
 if(swapped)requestAnimationFrame(scrollMessages)
}
function redrawKeyboard(){const el=$('kbd');if(!el)return;el.outerHTML=keyboardHTML();bindKeyboard();$('prompt')?.focus()}
/* Поле потеряло фокус — клавиатура уходит. Проверка отложена на такт:
   перерисовка сама снимает и возвращает фокус, и без неё клавиатура моргала бы. */
let lastDown=null;
const insideSheet=el=>!!(el&&el.closest&&(el.closest('#kbd')||el.closest('#dock')||el.closest('#chatbar')));
/* Поле потеряло фокус — клавиатура уходит, но только если палец ушёл за пределы
   панели: тап по переписке, ручке или быстрым действиям её не убирает. */
function promptBlur(){setTimeout(()=>{
 if(!kb)return;
 if(document.activeElement===$('prompt'))return;
 if(insideSheet(lastDown))return;
 closeKeyboard()
},0)}
function closeKeyboard(){
 if(!kb)return;kb=false;kbShift=false;kbNum=false;
 $('kbd')?.remove();document.querySelector('.main')?.classList.remove('kb');$('prompt')?.blur()
}
/* Микрофон в строке ввода работает как в голосовом вводе GPT:
   зажал — идёт запись, отпустил — распознанное сразу уходит боту. */
function bindComposerMic(){
 const b=$('micbtn');if(!b)return;
 if(!window._micRelease){window._micRelease=true;
  const release=()=>{if(holding||voiceActive){holding=false;$('micbtn')?.classList.remove('rec');stopVoiceHold()}};
  addEventListener('pointerup',release,true);addEventListener('pointercancel',release,true);
  addEventListener('blur',release)}
 const stop=()=>{if(!holding&&!voiceActive)return;holding=false;b.classList.remove('rec');
  const p=$('prompt');if(p)p.placeholder='Поручите задачу…';stopVoiceHold()};
 b.onpointerdown=e=>{e.preventDefault();closeKeyboard();holding=true;b.classList.add('rec');
  const p=$('prompt');if(p)p.placeholder='Говорите… отпустите, чтобы отправить';startVoiceHold()};
 b.onpointerup=stop;b.onpointercancel=stop;b.onpointerleave=stop
}
function bindKeyboard(){
 const el=$('kbd');if(!el)return;
 // Тап мимо клавиатуры и мимо поля убирает её всегда — даже когда поле
 // успело потерять фокус при перерисовке и события blur уже не будет.
 if(!window._kbOutside){window._kbOutside=true;
  document.addEventListener('pointerdown',e=>{
   lastDown=e.target;
   if(!kb)return;
   // Панель и клавиатура — одна зона: любое нажатие внутри них клавиатуру не убирает.
   // Иначе нажатие на «отправить» сдвигало бы кнопку из-под пальца и не срабатывало.
   if(insideSheet(e.target))return;
   closeKeyboard()
  },true)}
 if(document.activeElement!==$('prompt'))$('prompt')?.focus();
 el.onpointerdown=e=>{e.preventDefault()};            // поле ввода не теряет фокус
 el.onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  const p=$('prompt');if(!p)return;
  const a=b.dataset.a;
  if(a==='hide')return closeKeyboard();
  if(a==='send'){$('composer')?.requestSubmit();return}
  if(a==='mic'){closeKeyboard();voice();return}
  if(a==='num'){kbNum=!kbNum;redrawKeyboard();return}
  if(a==='shift'){kbShift=!kbShift;redrawKeyboard();return}
  if(a==='back'){p.value=p.value.slice(0,-1);growPrompt();p.focus();return}
  const ch=b.dataset.k;if(ch===undefined)return;
  p.value+=(kbShift&&!kbNum?ch.toUpperCase():ch);growPrompt();
  if(kbShift){kbShift=false;redrawKeyboard()}
  $('prompt')?.focus()
 }
}

function fabHTML(){
 return '<div class="fabmic"><button type="button" class="fab" id="voicehold" aria-label="Диалог с ботом. Удерживайте для голосового ввода"><span class="fabcore">'+icon('spark')+'</span>'+icon('mic')+'</button></div>'
}
function toggleImmersive(){immersive=!immersive;if(!immersive)dock='small';render()}
function setDock(size,focus=false){dock=size;if(size==='small')closeKeyboard();const el=$('dock');if(!el)return;const was=el.classList.contains('collapsed');el.style.setProperty('--dock',size==='small'?'118px':size==='half'?'57%':size==='large'?'85%':size);el.classList.toggle('collapsed',size==='small');
 // шторка сворачивается в строку ввода: таблетка «принимает» её лёгким толчком
 if(size==='small'&&!was){const c=$('composer');if(c){c.classList.remove('blink','catch');void c.offsetWidth;c.classList.add('catch')}}
 // графики в свёрнутой шторке не рисовались — у скрытого холста нет размера
 if(was&&size!=='small')requestAnimationFrame(bindCharts);
 if(size==='small')requestAnimationFrame(syncPeek);
 scrollMessages();if(focus)$('prompt').focus()}
let voiceRec=null,voiceText='',voiceTimer=0,voiceActive=false;
let holding=false;
/* Положение плавающей кнопки. Как в cTrader, её можно перетащить:
   держим отступы от правого и нижнего края рабочей области. */
let fabPos=null,fabDrag=null;
function applyFabPos(){const d=$('dock');if(!d)return;if(fabPos){d.style.setProperty('--fabr',fabPos.r+'px');d.style.setProperty('--fabb',fabPos.b+'px')}else{d.style.removeProperty('--fabr');d.style.removeProperty('--fabb')}}
function bindVoiceHold(){const b=$('voicehold');if(!b)return;if(!b.offsetParent)return;let moved=false;applyFabPos();
 b.onpointerdown=e=>{e.preventDefault();moved=false;holding=true;const d=$('dock'),m=document.querySelector('.main'),r=b.getBoundingClientRect(),mr=m.getBoundingClientRect();
  fabDrag={x:e.clientX,y:e.clientY,r:mr.right-r.right,b:mr.bottom-r.bottom,w:r.width,h:r.height,mr,on:false,d};
  clearTimeout(voiceTimer);voiceTimer=setTimeout(()=>{if(holding&&!(fabDrag&&fabDrag.on))startVoiceHold()},600);b.setPointerCapture?.(e.pointerId)};
 b.onpointermove=e=>{if(!fabDrag)return;const dx=e.clientX-fabDrag.x,dy=e.clientY-fabDrag.y;
  if(!fabDrag.on&&Math.hypot(dx,dy)>6){fabDrag.on=true;moved=true;holding=false;clearTimeout(voiceTimer);if(voiceActive)stopVoiceHold();fabDrag.d?.classList.add('dragfab')}
  if(!fabDrag.on)return;
  const maxR=fabDrag.mr.width-fabDrag.w-8,maxB=fabDrag.mr.height-fabDrag.h-8;
  fabPos={r:Math.max(8,Math.min(maxR,fabDrag.r-dx)),b:Math.max(8,Math.min(maxB,fabDrag.b-dy))};applyFabPos()};
 b.onpointerup=e=>{holding=false;clearTimeout(voiceTimer);const wasDrag=fabDrag&&fabDrag.on;fabDrag?.d?.classList.remove('dragfab');fabDrag=null;if(wasDrag)return;if(voiceActive)stopVoiceHold();else if(!moved){if(immersive){immersive=false;dock='half';render();setTimeout(()=>$('prompt')?.focus(),0)}else setDock('half',true)}};
 b.onpointercancel=()=>{holding=false;clearTimeout(voiceTimer);fabDrag?.d?.classList.remove('dragfab');fabDrag=null;if(voiceActive)stopVoiceHold()};b.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();startVoiceHold()}};b.onkeyup=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();stopVoiceHold()}}}

function startVoiceHold(){if(!holding)return;const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech){notify('Голосовой ввод недоступен в этом браузере');return}if(voiceActive)return;voiceActive=true;voiceText='';const b=$('voicehold');b?.classList.add('recording');b?.classList.add('listening');voiceRec=new Speech();voiceRec.lang='ru-RU';voiceRec.interimResults=false;voiceRec.continuous=false;voiceRec.onresult=e=>{voiceText=Array.from(e.results).map(x=>x[0].transcript).join(' ')};voiceRec.onerror=e=>{voiceActive=false;$('micbtn')?.classList.remove('rec');const p=$('prompt');if(p)p.placeholder='Поручите задачу…';
  notify(e&&(e.error==='not-allowed'||e.error==='service-not-allowed')?'Браузер не дал доступ к микрофону. Разрешите его для этой страницы.':'Не удалось распознать голос');resetVoiceButton()};voiceRec.onend=()=>{voiceActive=false;resetVoiceButton();$('micbtn')?.classList.remove('rec');const p=$('prompt');if(p)p.placeholder='Поручите задачу…';if(voiceText.trim())command(voiceText.trim(),true,true)};try{voiceRec.start()}catch{voiceActive=false;resetVoiceButton();notify('Микрофон недоступен')}}
function stopVoiceHold(){if(voiceRec){try{voiceRec.stop()}catch{}voiceRec=null}else{voiceActive=false;resetVoiceButton()}}
function resetVoiceButton(){const b=$('voicehold');b?.classList.remove('recording');b?.classList.remove('listening')}
function bindDock(){
 bindVoiceHold();
 // В режиме «только график» панели нет — привязывать нечего, кроме самой кнопки.
 if(!$('composer'))return;
 $('composer').onsubmit=e=>{e.preventDefault();const v=$('prompt').value.trim();if(v){$('prompt').value='';command(v);if(kb)$('prompt')?.focus()}};
 $('prompt').oninput=growPrompt;
 $('prompt').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('composer').requestSubmit()}};
 document.querySelectorAll('.dockhandle,.docktitle').forEach(h=>{let start=0,height=0,moved=false,on=false;const isHandle=h.classList.contains('dockhandle');
  // Ручка на таблетке видна, пока шторка свёрнута; развернулась — тянуть дальше нужно за ручку шторки.
  h.onpointerdown=e=>{if(!isHandle&&e.target.closest('button'))return;on=true;start=e.clientY;height=$('dock').getBoundingClientRect().height;moved=false;dragging=true;h.setPointerCapture(e.pointerId);$('dock').classList.add('dragging')};
  h.onpointermove=e=>{if(!on||!h.hasPointerCapture(e.pointerId))return;const diff=start-e.clientY;if(Math.abs(diff)>5)moved=true;
   if(moved){const max=document.querySelector('.main').clientHeight-75;setDock(Math.max(112,Math.min(max,height+diff))+'px')}};
  h.onpointerup=e=>{if(!on)return;on=false;try{h.releasePointerCapture(e.pointerId)}catch{}dragging=false;$('dock').classList.remove('dragging');
   if(!moved){if(isHandle)setDock(dock==='small'?'half':'small');return}
   // Как у системных шторок: отпустили — она доезжает до ближайшей «остановки»: закрыта, средняя, высокая.
   // Тянули вверх — уходим на ступень выше, вниз — на ступень ниже; далеко утащили — берём ближайшую.
   const H=document.querySelector('.main').clientHeight,ds=[0,H*.57,H*.85],names=['small','half','large'];
   const near=v=>ds.reduce((b,d,i)=>Math.abs(d-v)<Math.abs(ds[b]-v)?i:b,0);
   const cur=$('dock').getBoundingClientRect().height,diff=start-e.clientY,i0=near(height);
   let t=near(cur);
   if(diff>30)t=Math.max(t,Math.min(i0+1,2));else if(diff<-30)t=Math.min(t,Math.max(i0-1,0));
   setDock(names[t])};
  h.onclick=e=>{if(e.detail===0)setDock(dock==='small'?'half':'small')}
 })
}
/* Панель диалога переживает переходы: высоту, на которую её вытянул пользователь,
   не сбрасывает ни вход в полноэкранный график, ни возврат из него. */
function toggleChart(){expanded=!expanded;render()}
// Один шаг назад: из полноэкранного графика — на холст бота, с холста — к списку ботов.
function goBack(){if(expanded){expanded=false;render();return}home()}
function openFull(i){
 const a=current();
 if(a){
  const prev=focusCh(a);
  a.focus=Math.min(i,chartsOf(a).length-1);
  const c=focusCh(a);
  if(c&&prev!==c)a.openNote=chLabel(c);
 }
 // из шторки рабочего стола: на полноэкранном графике шторка — снова диалог, и он свёрнут
 if(swapped)dock='small';
 expanded=true;render()
}

/* ---------- фоновая работа ---------- */
const step=r=>r.steps[Math.min(r.steps.length-1,Math.floor((Date.now()-r.start)/r.dur*r.steps.length))];
function startRun(a,o){
 const r={id:uid(),a:a.id,title:o.title,steps:o.steps,start:Date.now(),dur:o.dur||2400,effect:o.effect||null,reply:o.reply,card:o.card||null,result:o.result||'',task:o.task||null,log:o.log||null,done:false};
 state.runs.push(r);a.messages.push({role:'assistant',ts:Date.now(),run:r.id,text:''});a.busyTitle=o.title;return r
}
function apply(a,e){
 if(!e)return;
 if(e.t==='draw'){const c=chartsOf(a)[e.ci||0];if(c){c.drawing=e.v;c.shift=0}}
 else if(e.t==='shift'){const c=chartsOf(a)[e.ci||0];if(c)c.shift=(c.shift||0)+e.v}
 else if(e.t==='risk'){(e.all?state.agents.filter(x=>kindOf(x)==='trade'):[a]).forEach(x=>x.risk=e.v)}
 else if(e.t==='account'){a.account={broker:e.broker,login:e.login,type:e.type,balance:e.balance,equity:e.equity,cur:'USD'}}
 else if(e.t==='note'){a.notes.push({text:e.v,time:clock()})}
 else if(e.t==='code'){a.files=(a.files||[]);a.files.push(e.v)}
 else if(e.t==='backtest'){
  const st=stratsOf(a).find(x=>x.id===e.sid);if(st){
   st.runs.push(e.v);st.sel=st.runs.length-1;a.stratId=st.id;
   const c=focusCh(a);if(c&&e.v.bt.marks)c.markers=e.v.bt.marks
  }
 }
 else if(e.t==='subbot'){for(const st of stratsOf(a)){const sb=st.subbots.find(x=>x.id===e.v);if(sb){sb.status='done';sb.result=e.r;break}}}
}
function finish(r){
 const a=byId(r.a);if(!a)return;
 apply(a,r.effect);
 const m=a.messages.find(x=>x.run===r.id);
 if(m){
  m.text=r.reply;m.card=r.card;m.result=r.result;m.ts=Date.now();
  if(r.effect&&r.effect.t==='backtest'){
   const st=stratsOf(a).find(x=>x.id===r.effect.sid)||activeStrat(a),cur=st.runs[st.runs.length-1],prev=st.runs[st.runs.length-2];
   m.card={title:'Проверка '+cur.label,tag:'История',rows:[['Инструмент',st.sym+' · '+st.tf],['Сделок',cur.bt.trades],['Итог к депозиту',cur.bt.ret],['Макс. просадка',cur.bt.dd],['Профит-фактор',cur.bt.pf]],note:'Демонстрационные данные, реального исполнения нет.'};
   if(prev){
    m.text='Изменил: '+cur.note+'. Перепроверил — вот что изменилось:';
    m.card.rows=diffRuns(prev,cur).map(([k,v])=>[k,v]);
    m.card.note='Детали и прежние прогоны — в истории проверок.'
   } else m.text='Формализовал стратегию и проверил на истории. Итог '+cur.bt.ret+' · '+cur.bt.trades+' сделок · просадка '+cur.bt.dd+'. Входы и выходы отметил на графике.'
  }
 }
 if(r.task)a.tasks.push(r.task);
 if(r.log){a.log=a.log||[];a.log.push({text:r.log,time:clock()})}
 a.busyTitle=null
}
function tick(){
 if(dragging)return;
 let changed=false;
 state.runs.forEach(r=>{if(!r.done&&Date.now()-r.start>=r.dur){r.done=true;finish(r);changed=true}});
 if(changed){if(state.runs.length>40)state.runs=state.runs.slice(-40);save()}
 if(changed||live().length)render()
}
setInterval(tick,600);

/* ---------- разбор поручений ---------- */
function inferRole(goal){const t=goal.toLowerCase();
 if(/алгоритм|стратег|иде[яюеи]|робот|советник|бэктест|бектест|backtest|код|скрипт|python|питон/.test(t))return 'quant';
 if(/риск|вся команд|всех трейдер|контролир/.test(t))return 'risk';
 if(/новост|событ|повестк|календар|news/.test(t))return 'news';
 if(/золот|gold|xau/.test(t))return 'gold';
 if(/дейтрейд|внутри дня|интрад|eur/.test(t))return 'day';
 if(/трейд|график|свеч|канал|уровн|торг|btc|биткоин|nas|инструмент/.test(t))return 'swing';
 if(/исследов|отчёт|отчет|сравн|обзор|ресёрч|подбор|анализ рынка/.test(t))return 'research';
 return 'helper'}
const tfs=['5M','15M','1H','4H','1D'];
function pickTf(t){
 const m=t.toUpperCase().match(/\b(15M|M15|5M|M5|1H|H1|4H|H4|1D|D1)\b/);
 if(m)return ({M15:'15M',M5:'5M',H1:'1H',H4:'4H',D1:'1D'})[m[1]]||m[1];
 if(/дневн/i.test(t))return '1D';if(/четырёхчас|четырехчас|4 часа|четырёхчасов/i.test(t))return '4H';if(/часовик|часовой|часов/i.test(t))return '1H';return null
}
function pickSym(t){const txt=t.toUpperCase().replaceAll(' ','');
 if(/BTC|БИТКОИН/.test(txt))return 'BTC/USD';if(/ETH|ЭФИР/.test(txt))return 'ETH/USD';if(/EUR|ЕВРО/.test(txt))return 'EUR/USD';if(/XAU|ЗОЛОТ|GOLD/.test(txt))return 'XAU/USD';if(/NAS|NASDAQ/.test(txt))return 'NAS100';return null}
function parseChart(c,t){
 const old=c.sym+' '+c.tf,sym=pickSym(t),tf=pickTf(t);
 if(sym)c.sym=sym;if(tf)c.tf=tf;
 if(old!==c.sym+' '+c.tf){c.drawing=null;c.shift=0;return true}return false
}
function addChart(a,sym,tf){const c={id:uid(),sym,tf,drawing:null,shift:0,ind:[],levels:[],lines:[]};a.charts.push(c);a.focus=a.charts.length-1;return c}
// Состояние графика — общее имущество человека и бота: оба его читают и оба меняют.
function chState(c){c.ind=c.ind||[];c.levels=c.levels||[];c.lines=c.lines||[];return c}
function chDesc(c){
 chState(c);const p=[];
 if(c.ind.length)p.push('индикаторы: '+c.ind.join(', '));
 if(c.levels.length)p.push('уровни: '+c.levels.map(l=>l.role==='low'?'нижний':'верхний').join(' и '));
 if(c.lines.length){
  const by={};c.lines.forEach(l=>{const n=toolOf(l.tool||'trend').name;by[n]=(by[n]||0)+1});
  p.push(Object.entries(by).map(([n,k])=>n.toLowerCase()+(k>1?' ×'+k:'')).join(', '))
 }
 if(c.drawing==='channel')p.push('канал');
 return p.length?p.join(' · '):'чистый график'
}
/* ---------- торговый алгоритм на общем компьютере ---------- */
const slug=s=>s.replace('/','_').toLowerCase();
const pct=(v,sign)=>(sign&&v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(1)+'%';
const MON=['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
// Сколько свечей укладывается в 12 месяцев на каждом таймфрейме — чтобы «период» не спорил с ним самим.
const BARS={'5M':105120,'15M':35040,'1H':8760,'4H':2190,'1D':365};
// Одна серия сделок — из неё считаются и кривая капитала, и просадка, и все метрики.
function backtestOf(sym,tf,salt){
 let seed=[...('bt'+sym+tf+(salt||''))].reduce((n,c)=>n+c.charCodeAt(0),0);
 const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 // сделки привязаны к барам ряда: вход и выход — их и рисует график
 const n=26+Math.floor(rnd()*18),marks=[],trades=[];
 let bi=4+Math.floor(rnd()*6);
 while(bi<BARS_TOTAL-10&&trades.length<n){
  const hold=2+Math.floor(rnd()*7);
  trades.push(rnd()<.47?.5+rnd()*2.6:-(.35+rnd()*1.45));
  marks.push({i:bi,dir:'in'},{i:bi+hold,dir:'out'});
  bi+=hold+2+Math.floor(rnd()*8)
 }
 const eq=[0];trades.forEach(t=>eq.push(eq[eq.length-1]+t));
 // Просадка считается к капиталу на пике (депозит = 100), а не в голых пунктах.
 let peak=eq[0],dd=0,maxStreak=0,streak=0;
 eq.forEach(v=>{peak=Math.max(peak,v);dd=Math.min(dd,(v-peak)/(100+peak)*100)});
 trades.forEach(t=>{if(t<=0){streak++;maxStreak=Math.max(maxStreak,streak)}else streak=0});
 const wins=trades.filter(t=>t>0),gain=wins.reduce((s,x)=>s+x,0),loss=-trades.filter(t=>t<=0).reduce((s,x)=>s+x,0);
 const now=new Date();
 // Сделки раскладываются по месяцам пропорционально, иначе последний месяц всегда обделён.
 const months=Array.from({length:12},(_,i)=>({label:MON[(now.getMonth()-11+i+24)%12],v:0}));
 trades.forEach((t,i)=>{months[Math.floor(i*12/n)].v+=t});
 const mean=months.reduce((s,m)=>s+m.v,0)/12;
 const sd=Math.sqrt(months.reduce((s,m)=>s+(m.v-mean)**2,0)/12)||1;
 const total=eq[eq.length-1];
 return {
  eq,months,marks,trades:String(trades.length),
  win:pct(wins.length/n*100),
  ret:pct(total,true),
  dd:pct(dd,true),
  pf:(gain/(loss||1)).toFixed(2),
  avg:pct(total/n,true),
  sharpe:(mean/sd*Math.sqrt(12)).toFixed(2),
  best:pct(Math.max(...months.map(m=>m.v)),true),
  worst:pct(Math.min(...months.map(m=>m.v)),true),
  streak:String(maxStreak)+' подряд',
  green:months.filter(m=>m.v>0).length+'/12',
  recovery:(total/Math.abs(dd||1)).toFixed(2),
  bars:BARS[tf].toLocaleString('ru-RU')+' свечей · 12 месяцев'
 }
}
function codeFor(sym,tf,risk){
 return '# strategy_'+slug(sym)+'_'+tf.toLowerCase()+'.py\n'
 +'# Сгенерировано ботом Chartix. Учебные данные, не торговый совет.\n'
 +'import pandas as pd\n\n'
 +'SYMBOL, TIMEFRAME = "'+sym+'", "'+tf+'"\n'
 +'FAST, SLOW, RISK = 12, 48, '+(risk||1)+'  # риск на сделку, %\n\n'
 +'def signals(df):\n'
 +'    df["fast"] = df.close.rolling(FAST).mean()\n'
 +'    df["slow"] = df.close.rolling(SLOW).mean()\n'
 +'    up = df.fast > df.slow\n'
 +'    df["enter"] = up & ~up.shift(1, fill_value=False)\n'
 +'    df["exit"] = ~up & up.shift(1, fill_value=False)\n'
 +'    return df\n\n'
 +'def backtest(df, equity=10_000.0):\n'
 +'    df, pos, entry, trades = signals(df), 0.0, 0.0, []\n'
 +'    for row in df.itertuples():\n'
 +'        if row.enter and not pos:\n'
 +'            pos, entry = equity * RISK / 100 / row.close, row.close\n'
 +'        elif row.exit and pos:\n'
 +'            equity += pos * (row.close - entry)\n'
 +'            trades.append(pos * (row.close - entry))\n'
 +'            pos = 0.0\n'
 +'    return equity, trades\n\n'
 +'if __name__ == "__main__":\n'
 +'    candles = load_market_data(SYMBOL, TIMEFRAME)  # общий компьютер\n'
 +'    equity, trades = backtest(candles)\n'
 +'    print(f"Сделок: {len(trades)}  Итог: {equity:,.2f}")\n'
}
/* ---------- дашборд статистики алгоритмов ---------- */
const filesOf=a=>Array.isArray(a.files)?a.files:[];
function algoOf(a){const l=filesOf(a);return l.find(f=>f.id===a.algo)||l[l.length-1]||null}
function pickAlgo(id){const a=current();if(a){a.algo=id;render()}}
function algoFullHTML(a){
 const st=activeStrat(a);
 if(!st)return '';
 const runs=st.runs,selIdx=Math.min(st.sel??runs.length-1,runs.length-1),cur=runs[selIdx];
 if(!cur)return '<div class="intro row between"><div><h2>Стратегия '+esc(st.sym)+'</h2><p>Идёт первая проверка…</p></div><span class="tag">Демо</span></div>';
 const b=cur.bt,up=!String(b.ret).startsWith('−'),old=selIdx<runs.length-1;
 return '<p class="muted" style="font-size:14px;margin-bottom:14px">'+esc(b.bars)+' · проверка '+cur.label+(runs.length>1?' из '+runs.length:'')+'</p>'
 +(old?'<div class="notice" style="margin-bottom:12px">Смотрите проверку '+cur.label+' из '+runs.length+'. <button class="tagbtn" onclick="pickRunFromHistory('+(runs.length-1)+')">Текущая — '+runs[runs.length-1].label+'</button></div>':'')
 +(runs.length>1?'<div class="chips" style="margin-bottom:14px">'
   +runs.slice(-6).map((r,k)=>'<button class="chip'+(r===cur?' on':'')+'" onclick="pickRunFromHistory('+(runs.length-6+k)+')">'+esc(r.label)+'</button>').join('')
   +'<button class="chip" onclick="historyModal(current())">история · '+runs.length+'</button></div>':'')
 +'<div class="hero"><small>Итог за период, к стартовому депозиту</small><b class="'+(up?'up':'down')+'">'+esc(b.ret)+'</b><small>'+esc(b.trades+' сделок · лучший месяц '+b.best+' · худший '+b.worst)+'</small></div>'
 +'<div class="summarygrid tight">'+[['Доля прибыльных сделок',b.win,''],['Профит-фактор',b.pf,''],['Макс. просадка капитала',b.dd,'down'],['Средний итог сделки',b.avg,String(b.avg).startsWith('−')?'down':'up'],['Коэф. восстановления',b.recovery,''],['Шарп (годовой)',b.sharpe,''],['Прибыльных месяцев',b.green,''],['Убытков подряд',b.streak,'']]
  .map(([k,v,c])=>'<div class="stat"><b'+(c?' class="'+c+'"':'')+'>'+esc(v)+'</b><small>'+k+'</small></div>').join('')+'</div>'
 +'<div class="sectionlabel">Правила стратегии</div><div class="msgcard">'+cur.params.map(p=>'<div class="cardrow"><span>'+esc(p.split(':')[0])+'</span><b>'+esc(p.split(': ').slice(1).join(': '))+'</b></div>').join('')+'<small class="cardnote">Напишите, что изменить — перепроверю и покажу разницу.</small></div>'
 +'<section class="chartcard algo"><div class="charthead"><b class="lbl">Кривая капитала</b><span class="grow"></span><span class="tag">накопленным итогом, % к депозиту</span></div><div class="algoplot tall">'+equitySVG(b)+'</div></section>'
 +'<section class="chartcard algo"><div class="charthead"><b class="lbl">Просадка от пика капитала</b><span class="grow"></span><span class="tag">макс. '+esc(b.dd)+'</span></div><div class="algoplot short">'+ddSVG(b)+'</div></section>'
 +'<section class="chartcard algo"><div class="charthead"><b class="lbl">Результат по месяцам, % к депозиту</b><span class="grow"></span><button class="tagbtn" onclick="algoTable()">Таблицей</button></div><div class="algoplot mid">'+monthsSVG(b)+'</div></section>'
 +(st.subbots.length?'<div class="sectionlabel">Подботы · '+st.subbots.length+'</div>'
   +st.subbots.slice(-4).map(sb=>'<button class="logrow fullwidth" style="text-align:left" onclick="subbotModal(\''+sb.id+'\')">'+esc(sb.name)+(sb.status==='run'?' · работает…':' · готов')+'<small>'+esc(sb.time)+'</small></button>').join('')
   +(st.subbots.length>4?'<button class="tagbtn fullwidth" style="margin-top:8px" onclick="subbotListModal()">Показать все · '+st.subbots.length+'</button>':'')
   +'<div class="notice formgap">Результаты подботов возвращаются в этот диалог.</div>':'')
 +'<div class="notice" style="margin-top:12px">Все числа посчитаны по одной серии сделок. Риск на сделку фиксированный, без реинвестирования; комиссии и проскальзывание не учтены. Учебные данные, реального исполнения нет.</div>'
}
// Основной экран остаётся чистым: график + текущий результат одной строкой.
// Детали, история и подботы открываются по тапу, а не разворачиваются под ногами.
function strategyStrip(a){
const st=activeStrat(a);
 if(!st)return '<button class="thinrow fullwidth" onclick="window.command(\'Хочу проверить стратегию\')">'+icon('chart')+'<span class="grow">Проверить торговую идею</span>'+icon('chevron')+'</button>';
 const runs=st.runs,cur=runs[runs.length-1];
 if(!cur)return '<div class="notice">Идёт первая проверка стратегии…</div>';
 const up=!String(cur.bt.ret).startsWith('−');
 return '<button class="thinrow fullwidth stratstrip" onclick="strategyModal()">'
  +'<div class="row between"><b>Стратегия '+esc(st.sym)+' · '+esc(st.tf)+'</b><span class="tag">'+esc(cur.label)+(runs.length>1?' из '+runs.length:'')+'</span></div>'
  +'<div class="row" style="gap:16px;margin-top:4px"><b class="'+(up?'up':'down')+'" style="font-size:22px;font-weight:600">'+esc(cur.bt.ret)+'</b>'
  +'<span class="muted" style="font-size:13px">'+esc(cur.bt.trades+' сделок · просадка '+cur.bt.dd+' · ПФ '+cur.bt.pf)+'</span><span class="grow"></span>'+icon('chevron')+'</div>'
  +'</button>'
}
// Детали стратегии — боттом-шит. Собственный оверлей, не <dialog>:
// у нативного диалога свой слой, фокус-ловушка и перехват событий —
// он и мешал закрытию. Здесь всё поведение написано явно.
let sheetRec=null;
function strategyModal(){
 const a=current();if(!a||!activeStrat(a))return;
 let ov=document.getElementById('sheetov');
 if(!ov){ov=document.createElement('div');ov.id='sheetov';document.body.appendChild(ov)}
 ov.innerHTML='<div class="sheetbackdrop" onclick="closeSheet()"></div>'
 +'<div class="sheetpanel" id="sheetpanel" role="dialog" aria-modal="true" aria-label="Стратегия">'
 +'<div class="sheetgrip" id="sheetgrip"></div>'
 +'<div class="dialoghead"><h2 class="grow">Стратегия '+esc(activeStrat(a).sym)+' · '+esc(activeStrat(a).tf)+'</h2><button class="iconbtn" aria-label="Закрыть" onclick="closeSheet()">'+icon('close')+'</button></div>'
 +'<div class="dialogbody">'+algoFullHTML(a)+'</div>'
 +'<form class="sheetcomposer" id="sheetform"><div class="inputbox"><input id="sheetprompt" autocomplete="off" aria-label="Правка стратегии" placeholder="Что изменить в стратегии…"><button class="iconbtn send sendbtn" aria-label="Отправить правку">'+icon('arrow')+'</button></div>'
 +'<button type="button" class="iconbtn circbtn'+(sheetRec?' recording':'')+'" aria-label="Надиктовать правку" onclick="sheetVoice()">'+icon('mic')+'</button></form>'
 +'</div>';
 requestAnimationFrame(()=>ov.classList.add('open'));
 $('sheetform').onsubmit=e=>{e.preventDefault();const v=$('sheetprompt').value.trim();if(v){closeSheet();window.command(v)}};
 bindSheetGestures();
 document.onkeydown=e=>{if(e.key==='Escape')closeSheet()}
}
// Общий боттом-шит для меню графика: свайп вниз, тап по фону, Escape и крестик.
function openSheet(title,body){
 let ov=document.getElementById('sheetov');
 if(!ov){ov=document.createElement('div');ov.id='sheetov';document.body.appendChild(ov)}
 ov.innerHTML='<div class="sheetbackdrop" onclick="closeSheet()"></div>'
 +'<div class="sheetpanel" id="sheetpanel" role="dialog" aria-modal="true" aria-label="'+title+'">'
 +'<div class="sheetgrip"></div>'
 +'<div class="dialoghead"><h2 class="grow">'+title+'</h2><button class="iconbtn" aria-label="Закрыть" onclick="closeSheet()">'+icon('close')+'</button></div>'
 +'<div class="dialogbody">'+body+'</div></div>';
 requestAnimationFrame(()=>ov.classList.add('open'));
 bindSheetGestures();
 document.onkeydown=e=>{if(e.key==='Escape')closeSheet()}
}
// Жесты шита вынесены отдельно: ими пользуются и стратегия, и меню графика.
function bindSheetGestures(){
 const p=$('sheetpanel');if(!p)return;
 const zones=[p.querySelector('.sheetgrip'),p.querySelector('.dialoghead')].filter(Boolean);
 let y0=null,pid=null;
 const down=e=>{if(e.target.closest('button'))return;y0=e.clientY;pid=e.pointerId};
 const move=e=>{
  if(y0===null||e.pointerId!==pid)return;
  const dy=Math.max(0,e.clientY-y0);
  if(dy>4&&pid!==null){try{p.setPointerCapture(pid)}catch{}pid=null}
  p.style.transition='none';p.style.transform='translateY('+dy+'px)'
 };
 const up=e=>{
  if(y0===null)return;
  const dy=e.clientY-y0;y0=null;pid=null;
  p.style.transition='transform .26s cubic-bezier(.32,.72,0,1)';
  if(dy>70){closeSheet();return}
  p.style.transform='';setTimeout(()=>{p.style.transition=''},280)
 };
 zones.forEach(el=>{el.style.touchAction='none';el.onpointerdown=down;el.onpointermove=move;el.onpointerup=up;el.onpointercancel=up})
}
function closeSheet(){
 const ov=document.getElementById('sheetov');if(!ov)return;
 document.onkeydown=null;
 const p=ov.querySelector('.sheetpanel');
 if(p){p.style.transition='transform .26s cubic-bezier(.32,.72,0,1)';p.style.transform='translateY(110%)'}
 ov.classList.remove('open');
 setTimeout(()=>ov.remove(),260)
}
function sheetVoice(){
 if(sheetRec){try{sheetRec.stop()}catch{}return}
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Speech)return;
 const rec=new Speech();rec.lang='ru-RU';rec.interimResults=true;rec.continuous=false;sheetRec=rec;
 let said='';
 rec.onresult=e=>{said=Array.from(e.results).map(x=>x[0].transcript).join(' ');const el=$('sheetprompt');if(el)el.value=said};
 rec.onerror=()=>{sheetRec=null};
 rec.onend=()=>{sheetRec=null;const v=said.trim();if(v){closeSheet();window.command(v)}};
 try{rec.start();document.querySelector('.sheetcomposer .circbtn')?.classList.add('recording')}catch{sheetRec=null;rec.onerror()}
}
function pickRun(i){const a=current(),st=a&&activeStrat(a);if(st)st.sel=i}
function pickRunFromHistory(i){pickRun(i);closeSheet();closeDialog();render();strategyModal()}
function plotBase(w,h,lo,hi,pad){
 const y=v=>pad.t+(hi-v)/((hi-lo)||1)*(h-pad.t-pad.b);
 return {y,x:(i,n)=>pad.l+i/((n-1)||1)*(w-pad.l-pad.r)}
}
function equitySVG(b){
 const w=700,h=230,pad={t:14,b:26,l:10,r:86},eq=b.eq;
 const lo=Math.min(0,...eq),hi=Math.max(...eq),{x,y}=plotBase(w,h,lo,hi,pad);
 const pts=eq.map((v,i)=>x(i,eq.length)+' '+y(v));
 let s='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Кривая капитала, итог '+b.ret+'" preserveAspectRatio="none">';
 for(let g=0;g<=3;g++){const v=lo+(hi-lo)*g/3;s+='<path d="M'+pad.l+' '+y(v)+'H'+(w-pad.r)+'" stroke="var(--grid)" stroke-dasharray="3 5"/><text x="'+(w-pad.r+10)+'" y="'+(y(v)+4)+'" fill="var(--axis-ink)" font-size="12">'+pct(v,true)+'</text>'}
 s+='<path d="M'+pad.l+' '+y(0)+'H'+(w-pad.r)+'" stroke="var(--axis)"/>';
 s+='<path d="M'+pts.join('L')+'L'+x(eq.length-1,eq.length)+' '+y(lo)+'L'+pad.l+' '+y(lo)+'Z" fill="var(--draw)" opacity=".07"/>';
 s+='<path d="M'+pts.join('L')+'" stroke="var(--draw)" stroke-width="2" fill="none" stroke-linejoin="round"/>';
 eq.forEach((v,i)=>{if(i%12===0)s+='<rect x="'+(x(i,eq.length)-6)+'" y="'+pad.t+'" width="12" height="'+(h-pad.t-pad.b)+'" fill="transparent"><title>Сделка '+i+' · накоплено '+pct(v,true)+'</title></rect>'});
 return s+'<text x="'+pad.l+'" y="'+(h-6)+'" fill="var(--axis-ink)" font-size="12">старт</text><text x="'+(w-pad.r)+'" y="'+(h-6)+'" fill="var(--axis-ink)" font-size="12" text-anchor="end">'+b.trades+' сделок</text></svg>'
}
function ddSVG(b){
 const w=700,h=120,pad={t:12,b:20,l:10,r:86};
 let peak=b.eq[0];const dd=b.eq.map(v=>{peak=Math.max(peak,v);return v-peak});
 const lo=Math.min(...dd),{x,y}=plotBase(w,h,lo,0,pad);
 const pts=dd.map((v,i)=>x(i,dd.length)+' '+y(v));
 let s='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Просадка от пика, максимум '+b.dd+'" preserveAspectRatio="none">';
 s+='<path d="M'+pad.l+' '+y(0)+'H'+(w-pad.r)+'" stroke="var(--axis)"/><text x="'+(w-pad.r+10)+'" y="'+(y(0)+4)+'" fill="var(--axis-ink)" font-size="12">0%</text>';
 s+='<text x="'+(w-pad.r+10)+'" y="'+(y(lo)+4)+'" fill="var(--axis-ink)" font-size="12">'+pct(lo,true)+'</text>';
 s+='<path d="M'+pts.join('L')+'L'+x(dd.length-1,dd.length)+' '+y(0)+'L'+pad.l+' '+y(0)+'Z" fill="var(--down)" opacity=".16"/>';
 s+='<path d="M'+pts.join('L')+'" stroke="var(--down)" stroke-width="2" fill="none"/>';
 return s+'</svg>'
}
function monthsSVG(b){
 const w=700,h=170,pad={t:14,b:30,l:10,r:86},m=b.months;
 const mx=Math.max(...m.map(x=>Math.abs(x.v)))||1,{y}=plotBase(w,h,-mx,mx,pad);
 const step=(w-pad.l-pad.r)/m.length,bw=Math.min(34,step-8);
 let s='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Результат по месяцам">';
 s+='<path d="M'+pad.l+' '+y(0)+'H'+(w-pad.r)+'" stroke="var(--axis)"/><text x="'+(w-pad.r+10)+'" y="'+(y(mx)+4)+'" fill="var(--axis-ink)" font-size="12">'+pct(mx,true)+'</text><text x="'+(w-pad.r+10)+'" y="'+(y(-mx)+4)+'" fill="var(--axis-ink)" font-size="12">'+pct(-mx,true)+'</text>';
 m.forEach((it,i)=>{
  const cx=pad.l+step*i+step/2,top=it.v>=0?y(it.v):y(0)+1,bh=Math.max(2,Math.abs(y(it.v)-y(0))-1);
  s+='<rect x="'+(cx-bw/2)+'" y="'+top+'" width="'+bw+'" height="'+bh+'" rx="4" fill="'+(it.v>=0?'var(--up)':'var(--down)')+'"><title>'+it.label+' · '+pct(it.v,true)+'</title></rect>';
  s+='<text x="'+cx+'" y="'+(h-10)+'" fill="var(--axis-ink)" font-size="12" text-anchor="middle">'+it.label+'</text>'
 });
 return s+'</svg>'
}
function algoTable(){
 const a=current(),st=a&&activeStrat(a);if(!st)return;
 const i=Math.min(st.sel??st.runs.length-1,st.runs.length-1),f=st.runs[i];if(!f)return;
 modal('Результат по месяцам · проверка '+esc(f.label),'<div class="settingsrow"><span>Итого</span>'+esc(f.bt.ret)+'</div>'
 +f.bt.months.map(m=>'<div class="settingsrow"><span>'+m.label+'</span><b class="'+(m.v>=0?'up':'down')+'">'+pct(m.v,true)+'</b></div>').join('')
 +'<div class="notice formgap">Те же числа, что и на диаграмме. Учебные данные.</div>')
}

/* ---------- торговая идея → стратегия → проверка на истории ----------
   Всё это принадлежит текущему боту: стратегия, её правки, прогоны и подботы.
   На основном экране — только текущий результат и компактная история. */

// Разбор идеи из свободного текста: что нашлось — зафиксировано, чего нет — бот уточнит.
function inferIdea(text){
 const t=text.toLowerCase();
 const entry=/пробой|пробит|выход из диапазона|пробив/.test(t)?'breakout'
  :/пересеч|скользящ|средн|\bma\b/.test(t)?'ma'
  :/канал|отбой/.test(t)?'channel':null;
 const stopM=t.match(/стоп\w*[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*%/);
 const riskM=t.match(/риск\w*[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*%/);
 return {sym:pickSym(text)||'BTC/USD',tf:pickTf(text)||'1H',entry,
  stop:stopM?Number(stopM[1].replace(',','.')):null,
  risk:riskM?Number(riskM[1].replace(',','.')):null,
  dir:/шорт|продаж|вниз|на понижен/.test(t)?'short':'long'}
}
const ENTRY_TEXT={breakout:'пробой верхней границы диапазона с закрытием выше',ma:'пересечение быстрой и медленной средних (12/48)',channel:'отбой от нижней границы канала'};
function rulesOf(i){return ['Вход: '+ENTRY_TEXT[i.entry],'Выход: противоположный сигнал или стоп '+(i.stop||1.5)+'%','Риск: '+(i.risk||1)+'% депозита на сделку','Инструмент: '+i.sym+' · '+i.tf]}
// Правки стратегии из нового поручения. Возвращает {idea2,changed:[строки изменений]}
function applyDelta(old,text){
 const t=text.toLowerCase(),idea2=Object.assign({},old.idea),changed=[];
 const ns=pickSym(text);if(ns&&ns!==old.idea.sym){changed.push('инструмент: '+old.idea.sym+' → '+ns);idea2.sym=ns}
 const nt=pickTf(text);if(nt&&nt!==old.idea.tf){changed.push('таймфрейм: '+old.idea.tf+' → '+nt);idea2.tf=nt}
 const sm=t.match(/стоп\w*[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*%/);
 if(sm&&Number(sm[1].replace(',','.'))!==(old.idea.stop||1.5)){changed.push('стоп: '+(old.idea.stop||1.5)+'% → '+sm[1]+'%');idea2.stop=Number(sm[1].replace(',','.'))}
 const rm=t.match(/риск\w*[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*%/);
 if(rm&&Number(rm[1].replace(',','.'))!==(old.idea.risk||1)){changed.push('риск: '+(old.idea.risk||1)+'% → '+rm[1]+'%');idea2.risk=Number(rm[1].replace(',','.'))}
 if(/пересеч|скользящ/.test(t)&&old.idea.entry!=='ma'){changed.push('вход → пересечение средних');idea2.entry='ma'}
 else if(/пробой|пробит/.test(t)&&old.idea.entry!=='breakout'){changed.push('вход → пробой диапазона');idea2.entry='breakout'}
 else if(/отбой|канал/.test(t)&&old.idea.entry!=='channel'){changed.push('вход → отбой от канала');idea2.entry='channel'}
 return {idea2,changed}
}
function formalizeAndRun(a,idea,changed,forceNew){
 const st=(forceNew||!activeStrat(a))?newStrat(a,idea):activeStrat(a);
 st.idea=idea;st.sym=idea.sym;st.tf=idea.tf;st.name=idea.sym+' · '+idea.tf;
 const n=st.runs.length+1,bt=backtestOf(idea.sym,idea.tf,'r'+n);
 const runRec={n,label:'#'+n,time:clock(),params:rulesOf(idea),note:changed&&changed.length?changed.join('; '):(n===1?'первая проверка':'правка'),bt};
 return startRun(a,{
  title:'Проверка стратегии · '+idea.sym+' '+idea.tf,
  steps:['Проверяю идею…'],
  dur:4600,
  effect:{t:'backtest',v:runRec,sid:st.id},
  reply:null, // текст соберём в finish — там известно сравнение с прошлым прогоном
  card:null,
  result:'Входы ▲ и выходы ▼ отмечены на графике '+idea.sym+' · '+idea.tf+'.',
  task:{title:'Проверка стратегии',detail:'#'+n+' · '+idea.sym+' '+idea.tf},
  log:'Проверка стратегии #'+n+' ('+idea.sym+' '+idea.tf+')'
 })
}
// Сравнение двух прогонов: коротко, что изменилось
function diffRuns(prev,cur){
 const num=s=>parseFloat(String(s).replace('−','-').replace('%',''));
 const f=(a,b,unit)=>{const d=b-a;return (d>0?'+':d<0?'−':'±')+Math.abs(d).toFixed(1)+(unit||'')};
 return [
  ['Итог к депозиту',prev.bt.ret+' → '+cur.bt.ret,f(num(prev.bt.ret),num(cur.bt.ret)),' п.п.'],
  ['Профит-фактор',prev.bt.pf+' → '+cur.bt.pf,f(num(prev.bt.pf),num(cur.bt.pf))],
  ['Макс. просадка',prev.bt.dd+' → '+cur.bt.dd,f(num(prev.bt.dd),num(cur.bt.dd)),' п.п.'],
  ['Сделок',prev.bt.trades+' → '+cur.bt.trades,'']
 ]
}
function subbotSpecs(t){
 if(/оптимиз|подбери|перебери|параметр/.test(t))return {name:'Оптимизатор параметров',task:'перебирает пороги входа и стоп',result:'Лучшая связка: стоп 1.2%, вход по закрытию. Итог прогона лучше текущего на +4.1 п.п.'};
 if(/друг(ом|их)|все инструмент|на всем|на всём/.test(t))return {name:'Проверка на инструментах',task:'гоняет стратегию по остальным рынкам',result:'Устойчива на XAU/USD и BTC/USD, на EUR/USD итог слабый (−2.1%).'};
 return {name:'Проверка устойчивости',task:'гоняет стратегию по соседним периодам',result:'На соседних окнах итог держится: +31% / +27% / +38%.'};
}
// «каждое утро…», «раз в неделю…» — регулярная задача бота
function jobFrom(text,t){
 const when=/кажд(ое|ый) утр|утром/.test(t)?'каждое утро'
  :/кажд(ый|ую) недел|раз в недел|еженедельн/.test(t)?'раз в неделю'
  :/кажд(ый) день|ежедневн|раз в день/.test(t)?'каждый день'
  :/кажд(ый) час|ежечасн/.test(t)?'каждый час':null;
 if(!when)return null;
 const title=/сводк|отчёт|отчет/.test(t)?'Сводка по рынку'
  :/провер\w* стратег|перепровер/.test(t)?'Перепроверка стратегии'
  :/новост/.test(t)?'Дайджест новостей'
  :/уровн|канал|размет/.test(t)?'Обновление разметки':'Регулярная задача';
 return {id:uid(),title,when,created:clock(),last:null}
}
function strategyCommand(a,text,t){
 // бот ждёт уточнения — это и есть оно
 if(a.pendingIdea){
  const d=inferIdea(text),idea=Object.assign({},a.pendingIdea);
  if(d.entry)idea.entry=d.entry;
  if(pickSym(text))idea.sym=d.sym;
  if(pickTf(text))idea.tf=d.tf;
  if(d.stop!==null)idea.stop=d.stop;
  if(d.risk!==null)idea.risk=d.risk;
  if(!idea.entry)return say(a,'Всё ещё нужно условие входа: пробой диапазона, пересечение средних или отбой от канала?');
  const forceNew=!!a.pendingNew;a.pendingIdea=null;a.pendingNew=false;
  return formalizeAndRun(a,idea,null,forceNew)
 }
 // первая формализация
 if(!activeStrat(a)){
  const idea=inferIdea(text);
  if(!idea.entry){
   a.pendingIdea=idea;
   return say(a,'Понял направление: '+idea.sym+' · '+idea.tf+'. Уточните условие входа — тапните по варианту:',
    {title:'Уточнение',tag:'Нужен ответ',actions:['Пробой диапазона','Пересечение средних 12/48','Отбой от канала']})
  }
  return formalizeAndRun(a,idea)
 }
 // подботы
 if(/подбот|оптимиз|подбери|перебери|устойчивост|друг(ом|их) инструмент/.test(t)){
  const sp=subbotSpecs(t),sb={id:uid(),name:sp.name,task:sp.task,status:'run',time:clock(),result:''};
  activeStrat(a).subbots.push(sb);
  return startRun(a,{
   title:'Подбот · '+sp.name,
   steps:['Поручаю подботу…','Подбот работает: '+sp.task+'…','Забираю результат…'],
   dur:5200,
   effect:{t:'subbot',v:sb.id,r:sp.result},
   reply:'Подбот «'+sp.name+'» вернул результат: '+sp.result,
   card:{title:sp.name,tag:'Подбот',lines:['Задача: '+sp.task,sp.result],note:'Подботы живут внутри этого бота и результаты возвращаются сюда же.'},
   task:{title:'Подбот: '+sp.name,detail:'готов'},
   log:'Подбот «'+sp.name+'» завершён'
  })
 }
 // история проверок
 if(/истори|все прогон|все проверки|прошлые/.test(t)&&activeStrat(a).runs.length)return historyModal(a);
 // «ещё одна / новая стратегия» — заводим вторую в пространстве того же бота
 if(/ещё одну|еще одну|нов(ую|ая) стратег|втору. стратег|отдельн.. стратег/.test(t)){
  const idea=inferIdea(text);
  if(!idea.entry){a.pendingIdea=idea;a.pendingNew=true;
   return say(a,'Заведу вторую стратегию в этом боте: '+idea.sym+' · '+idea.tf+'. Условие входа?',
    {title:'Уточнение',tag:'Нужен ответ',actions:['Пробой диапазона','Пересечение средних 12/48','Отбой от канала']})}
  return formalizeAndRun(a,idea,null,true)
 }
 // правка и перепроверка
 const {idea2,changed}=applyDelta(activeStrat(a),text);
 if(!changed.length)return say(a,'Стратегия сейчас: '+rulesOf(activeStrat(a).idea).join(' · ')+'. Скажите, что изменить — например, «стоп 2%» или «поставь риск 0.5%», и я перепроверю.');
 return formalizeAndRun(a,idea2,changed)
}
function historyModal(a){
 const runs=activeStrat(a).runs;
 modal('История проверок · '+esc(activeStrat(a).name),
  '<p class="muted" style="font-size:14px;margin-bottom:12px">Всего '+runs.length+'. На основном экране — только текущий результат, здесь — все прогоны.</p>'
  +runs.slice().reverse().map(r=>'<button class="settingsrow fullwidth" style="text-align:left" onclick="pickRunFromHistory('+(r.n-1)+')"><span>#'+r.n+' · '+esc(r.note)+'</span><span class="val">'+esc(r.bt.ret+' · '+r.time)+'</span></button>').join(''))
}

// Все подботы одним списком — открывается только по требованию.
function subbotListModal(){
 const a=current(),st=a&&activeStrat(a);if(!st||!st.subbots.length)return;
 modal('Подботы · '+st.subbots.length,
  '<p class="muted" style="font-size:14px;margin-bottom:12px">Живут внутри этого бота, результаты возвращаются сюда же.</p>'
  +st.subbots.slice().reverse().map(sb=>'<button class="settingsrow fullwidth" style="text-align:left" onclick="subbotModal(\''+sb.id+'\')"><span>'+esc(sb.name)+(sb.status==='run'?' · работает…':' · готов')+'</span><span class="val">'+esc(sb.time)+'</span></button>').join(''))
}
function subbotModal(id){
 const a=current();let sb=null;if(a)for(const st of stratsOf(a)){sb=st.subbots.find(x=>x.id===id);if(sb)break}if(!sb)return;
 modal('Подбот · '+esc(sb.name),
  '<div class="settingsrow"><span>Задача</span>'+esc(sb.task)+'</div><div class="settingsrow"><span>Статус</span>'+(sb.status==='run'?'в работе':'готов')+'</div>'
  +(sb.result?'<div class="sectionlabel">Результат</div><p style="font-size:14px;margin:0">'+esc(sb.result)+'</p>':'<div class="notice formgap">Результат вернётся сюда же, в диалог этого бота.</div>'))
}

function algoRun(a,text){
 const c=focusCh(a),sym=pickSym(text)||(c&&c.sym)||'BTC/USD',tf=pickTf(text)||(c&&c.tf)||'1H';
 const bt=backtestOf(sym,tf),risk=a.risk||1;
 const file={id:uid(),name:'strategy_'+slug(sym)+'_'+tf.toLowerCase()+'.py',sym,tf,by:a.name,time:clock(),code:codeFor(sym,tf,risk),bt};
 return startRun(a,{
  title:'Торговый алгоритм · '+sym+' '+tf,
  steps:['Подключаюсь к общему компьютеру…','Открываю Python в вашей среде…','Пишу стратегию '+sym+' '+tf+'…','Загружаю рыночные данные…','Прогоняю бэктест на истории…','Сохраняю файл в среде…'],
  dur:5400,
  effect:{t:'code',v:file},
  reply:'Готово. Написал стратегию на '+sym+' '+tf+', прогнал её на рыночных данных и оставил файл в вашей среде — «'+file.name+'» на общем компьютере.',
  card:{title:'Бэктест '+sym+' · '+tf,tag:'Результат',rows:[['Сделок',bt.trades],['Доля прибыльных',bt.win],['Итог к депозиту',bt.ret],['Макс. просадка',bt.dd],['Профит-фактор',bt.pf],['Период',bt.bars]],note:'Учебные данные. Реального исполнения и брокерского подключения нет.'},
  result:'Файл '+file.name+' остался в вашей среде: Общий компьютер → Файлы в среде.',
  task:{title:'Торговый алгоритм',detail:file.name},
  log:'Создан и прогнан алгоритм '+file.name
 })
}
function say(a,text,card,result){a.messages.push({role:'assistant',ts:Date.now(),text,card:card||null,result:result||''})}

/* ---------- когда панель раскрывать ----------
   Просьба объяснить требует чтения — панель раскрывается.
   Просьба изменить график или дашборд читать нечего: результат виден
   на самом графике, панель остаётся щелью, а ответ бота уходит в подсказку. */
// Короткая подсказка поверх экрана: нужна там, где панель не раскрываем.
function notify(text){
 document.querySelector('.toast')?.remove();
 const el=document.createElement('div');el.className='toast';el.textContent=text;
 document.body.appendChild(el);
 setTimeout(()=>el.classList.add('out'),2600);setTimeout(()=>el.remove(),3000)
}


/* ---------- «объясни движение цены» ----------
   Единственный случай, когда сказанное в микрофон раскрывает панель:
   ответ нужно читать, а не смотреть на график. */
const EXPLAIN_RE=/объясни.*(движен|цен|график)|разбери.*движен|почему.*(цена|упал|падал|падает|вырос|растет|растёт|отскоч)|что (сейчас )?(с ценой|происходит с ценой)/;
function explainMove(a){
 const c=focusCh(a);if(!c)return false;
 const d=series(c),last=d[d.length-1],n=d.length;
 const win=d.slice(-24),open=win[0].o,ch=(last.c-open)/open*100;
 const lo=Math.min(...win.map(x=>x.l)),hi=Math.max(...win.map(x=>x.h));
 const pd=prevDayLevels(c);
 const down=ch<0,dir=down?'вниз':'вверх';
 const body=d.slice(-6).filter(x=>(x.c>=x.o)===down).length;   // свечи против движения: при падении — зелёные, при росте — красные
 const price=p=>fmt(p,c.sym);
 say(a,'Разбираю движение '+chLabel(c)+'. За последние сутки цена ушла '+dir+' на '+Math.abs(ch).toFixed(1)+'%: с '+price(open)+' до '+price(last.c)+'. '
  +(body>2?'Движение рваное: из шести последних свечей '+body+' идут против него. ':'Движение идёт одним заходом — против него за шесть последних свечей '+(body?body+' свеч'+(body===1?'а':'и'):'ни одной свечи')+'. ')
  +(down
    ? 'Продавцы снимают ликвидность под вчерашним минимумом '+price(pd.low)+'. Пока цена держится ниже вчерашнего максимума '+price(pd.high)+', это продолжение, а не разворот.'
    : 'Покупатели забирают стопы над вчерашним максимумом '+price(pd.high)+'. Пока цена держится выше вчерашнего минимума '+price(pd.low)+', движение живое.'),
  {title:'Почему цена идёт '+dir,tag:chLabel(c),
   rows:[['За сутки',(ch>0?'+':'−')+Math.abs(ch).toFixed(1)+'%'],
         ['Диапазон суток',price(lo)+' — '+price(hi)],
         ['Вчера, максимум',price(pd.high)],
         ['Вчера, минимум',price(pd.low)],
         ['Свечей против движения',String(body)+' из 6']],
   lines:[down?'Каждый отскок продают ниже предыдущего — нижние тени короткие.':'Каждый откат выкупают выше предыдущего — верхние тени короткие.',
          'Объём растёт на свечах по направлению и падает на откатах.',
          down?'Ближайшая цель — вчерашний минимум, за ним пусто до круглого уровня.':'Ближайшая цель — вчерашний максимум, за ним пусто до круглого уровня.'],
   note:'Учебные данные. Это разбор графика, а не рекомендация.'});
 return true
}

function command(text,keepCollapsed=false,byVoice=false){
 const a=current();if(!a)return;const t=text.toLowerCase(),k=kindOf(a);
 a.messages.push({role:'user',ts:Date.now(),text});
 if(a.paused&&!/продолж|возобнов/.test(t))say(a,'Работа приостановлена. Напишите «Продолжить», чтобы снова давать поручения.');
 else if(k==='trade'&&EXPLAIN_RE.test(t)&&explainMove(a)){}
 else if(/приостанов|пауза|останов/.test(t)){a.paused=true;say(a,'Приостановил выполнение поручений. История и настройки сохранены.')}
 else if(/продолж|возобнов/.test(t)){a.paused=false;say(a,'Готов продолжать. Какое следующее поручение?')}
 else if(/кто (сейчас )?работ|чем заняты|занят/.test(t)){
  const busy=live();
  say(a,busy.length?'Сейчас в работе '+busy.length+':':'Сейчас все боты свободны.',{title:'Общий компьютер',tag:'Сейчас',lines:busy.length?busy.map(r=>(byId(r.a)?.name||'—')+' — '+r.title):['Нет активных задач'],note:'Полный список — в диалоге «Общий компьютер».'})
 }
 else if(jobFrom(text,t)){
  const j=jobFrom(text,t);a.jobs=(a.jobs||[]);a.jobs.push(j);
  say(a,'Завёл регулярную задачу: «'+j.title+'» — '+j.when+'. Она живёт в этом боте, в разделе «Задачи».',
   {title:j.title,tag:'Регулярно',rows:[['Расписание',j.when],['Куда приходит','в этот диалог']],note:'В прототипе задача не запускается по часам — это демонстрация.'});
  a.log=a.log||[];a.log.push({text:'Заведена задача «'+j.title+'» ('+j.when+')',time:clock()})
 }
 else if(a.pendingIdea||/бэктест|бектест|backtest|стратег|торгов\w*\s+иде|проверь\w* идею|подбот|оптимиз|устойчивост|истори\w* проверок/.test(t)||(activeStrat(a)&&/измени|поменяй|замени|усили|ослаб|перепровер/.test(t)))strategyCommand(a,text,t);
 else if(/алгоритм|робот|советник|напиши код|напиши скрипт|торгов\w*\s+код/.test(t))algoRun(a,text);
 else if(/мои файлы|покажи файлы|что в среде|мой код|покажи код/.test(t)){
  const fl=filesOf(a);
  say(a,fl.length?'В пространстве этого бота '+fl.length+' алгоритм(ов). Открыл раздел «Алгоритмы».':'Алгоритмов пока нет. Попросите написать торговый алгоритм.',
   fl.length?{title:'Алгоритмы бота',lines:fl.map(f=>f.name+' · '+f.time),note:'Лежат в пространстве этого бота.'}:null)
 }
 else if(k==='trade'&&chartReply(a,text,t)){}
 else if(k==='trade')tradeCommand(a,text,t);
 else if(k==='ops')opsCommand(a,text,t);
 else infoCommand(a,text,t);
 a.ts=Date.now();save();const c=focusCh(a);const picking=lineModeOn()||(c&&c.pending);
 // Голос панель не раскрывает никогда: надиктовал — бот сделал, ответ ушёл подсказкой.
 // Панель раскрывает только важный ответ — сейчас это разбор движения цены.
 // Всё остальное её не трогает: раскрывает и сворачивает пользователь сам.
 const explaining=EXPLAIN_RE.test(t);
 if(byVoice&&explaining)closeKeyboard();
 if(!picking){
  // В обмене диалог и есть экран: шторку с рабочим столом убираем, чтобы ответ был виден.
  if(swapped&&!expanded)dock='small';
  else if(explaining){if(dock!=='large')dock='large'}
  // Ответ на действие не показываем поверх экрана: результат виден на самом
  // графике, а текст лежит в переписке — поднимите панель, если нужен.
 }
 render()
}

// Режим трендовой линии и обратная связь «человек → бот».
/* ---------- инструменты разметки ----------
   Один контрол на все построения: выбрал инструмент — ставишь точки.
   Для двухточечных бот подсказывает вторую точку (copilot). */
const DRAW_TOOLS=[
 {k:'trend',name:'Трендовая',pts:2,ico:'chart'},
 {k:'ray',name:'Луч',pts:2,ico:'arrow'},
 {k:'xline',name:'Прямая',pts:2,ico:'link'},
 {k:'hline',name:'Горизонталь',pts:1,ico:'pin'},
 {k:'channel',name:'Канал',pts:2,ico:'doc'},
 {k:'rect',name:'Прямоугольник',pts:2,ico:'computer'},
 {k:'fib',name:'Фибоначчи',pts:2,ico:'settings'},
 {k:'measure',name:'Замер',pts:2,ico:'expand'}
];
const toolOf=k=>DRAW_TOOLS.find(x=>x.k===k);
let drawTool=null;
const lineModeOn=()=>!!drawTool;
function pickTool(k){
 toolsOpen=true;
 const a=current(),c=a&&focusCh(a);
 drawTool=(drawTool===k)?null:k;
 if(c){c.pending=null;c.suggest=null}
 if(drawTool&&a){dock='small';say(a,'Инструмент: '+toolOf(drawTool).name+'. '+(toolOf(drawTool).pts===1?'Тапните по графику — поставлю на этом уровне.':'Поставьте первую точку тапом по графику.'))}
 render()
}
function closeTools(){drawTool=null;toolsOpen=false;const a=current(),c=a&&focusCh(a);if(c){c.pending=null;c.suggest=null}render()}
// Выбор построения — отдельным списком, а не рядом кнопок на графике.
function drawingsMenu(){
 openSheet('Разметка','<div class="picklist">'+DRAW_TOOLS.map(t=>'<button class="pickrow'+(drawTool===t.k?' on':'')+'" onclick="chooseTool(\''+t.k+'\')">'+icon(t.ico)+esc(t.name)+(drawTool===t.k?icon('check'):'')+'</button>').join('')+'</div>'
  +(currentLines()?'<button class="ghostrow fullwidth" onclick="clearDrawings()">'+icon('close')+'<span class="grow">Убрать всю разметку · '+currentLines()+'</span></button>':''))
}
const currentLines=()=>{const a=current(),c=a&&focusCh(a);return c&&c.lines?c.lines.length:0};
function chooseTool(k){closeSheet();pickTool(k)}
function clearDrawings(){
 const a=current(),c=a&&focusCh(a);if(!c)return;
 c.lines=[];c.levels=[];c.pending=null;c.suggest=null;drawTool=null;closeSheet();
 say(a,'Убрал всю разметку. Сейчас на графике — '+chDesc(c)+'.');render()
}
// Индикаторы — списком с отметками, включаются и выключаются тапом.
function indicatorsMenu(){
 const a=current(),c=a&&focusCh(a);if(!c)return;chState(c);
 openSheet('Индикаторы','<div class="picklist">'+Object.entries(INDS).map(([k,n])=>'<button class="pickrow'+(c.ind.includes(k)?' on':'')+'" onclick="toggleInd(\''+k+'\')">'+esc(n)+(c.ind.includes(k)?icon('check'):'')+'</button>').join('')+'</div>')
}
function toggleInd(k){
 const a=current(),c=a&&focusCh(a);if(!c)return;chState(c);
 const on=c.ind.includes(k);
 c.ind=on?c.ind.filter(x=>x!==k):c.ind.concat(k);
 closeSheet();say(a,(on?'Убрал ':'Добавил ')+INDS[k]+'. Сейчас на графике — '+chDesc(c)+'.');render()
}
// Настройки графика: вид свечей, сетка, автомасштаб — то, что относится к самому графику.
function chartSettingsMenu(){
 const a=current(),c=a&&focusCh(a);if(!c)return;
 c.opts=c.opts||{grid:true,marks:true};
 openSheet('Настройки графика',
  '<div class="settingsrow"><span>Инструмент</span><span class="val">'+esc(c.sym)+'</span></div>'
  +'<div class="settingsrow"><span>Таймфрейм</span><span class="val">'+esc(c.tf)+'</span></div>'
  +'<button class="settingsrow fullwidth" onclick="toggleOpt(\'grid\')"><span>Сетка</span><span class="val">'+(c.opts.grid?'включена':'выключена')+'</span></button>'
  +'<button class="settingsrow fullwidth" onclick="toggleOpt(\'marks\')"><span>Метки сделок</span><span class="val">'+(c.opts.marks?'показывать':'скрыть')+'</span></button>'
  +'<button class="settingsrow fullwidth" onclick="closeSheet();resetView()"><span>Вернуть масштаб</span><span class="val">'+icon('chevron')+'</span></button>')
}
function toggleOpt(k){
 const a=current(),c=a&&focusCh(a);if(!c)return;
 c.opts=c.opts||{grid:true,marks:true};c.opts[k]=!c.opts[k];
 render();chartSettingsMenu()
}
function resetView(){
 const a=current(),c=a&&focusCh(a);if(!c)return;
 chartView.set(c.id,{sym:c.sym,tf:c.tf,i0:BARS_TOTAL-BARS_VIEW,i1:BARS_TOTAL-1});render()
}
function toolsPanelHTML(){
 return '<div class="toolbar">'+DRAW_TOOLS.map(t=>'<button class="toolbtn'+(drawTool===t.k?' on':'')+'" onclick="pickTool(\''+t.k+'\')" aria-label="'+t.name+'">'+icon(t.ico)+'<span>'+t.name+'</span></button>').join('')
  +'</div>'
}
function dropInd(k){const a=current(),c=a&&focusCh(a);if(!c)return;c.ind=(c.ind||[]).filter(x=>x!==k);say(a,'Убрал '+INDS[k]+'. Сейчас на графике — '+chDesc(c)+'.');render()}
function cancelLine(){const a=current(),c=a&&focusCh(a);if(c){c.pending=null;c.suggest=null}drawTool=null;render()}
let toolsOpen=false;
function toggleTools(){toolsOpen=!toolsOpen;if(!toolsOpen){drawTool=null;const a=current(),c=a&&focusCh(a);if(c){c.pending=null;c.suggest=null}}render()}
// Бот сам находит трендовую: по касаниям минимумов или максимумов видимого окна.
function drawTrendQuiet(c,t){
 const d=series(c),v=chartView.get(c.id);
 const i0=v?Math.max(0,Math.floor(v.i0)):BARS_TOTAL-BARS_VIEW,i1=v?Math.min(d.length-1,Math.ceil(v.i1)):BARS_TOTAL-1;
 const win=[];for(let i=i0;i<=i1;i++)win.push({i,d:d[i]});
 if(win.length<6)return;
 const rise=win[win.length-1].d.c>=win[0].d.c;
 const byLow=/поддерж|минимум|снизу|восход/.test(t)?true:/сопротив|максимум|сверху|нисход/.test(t)?false:rise;
 const half=Math.floor(win.length/2),A=win.slice(0,half),B=win.slice(half);
 const p1=byLow?A.reduce((b,x)=>x.d.l<b.d.l?x:b,A[0]):A.reduce((b,x)=>x.d.h>b.d.h?x:b,A[0]);
 const p2=byLow?B.reduce((b,x)=>x.d.l<b.d.l?x:b,B[0]):B.reduce((b,x)=>x.d.h>b.d.h?x:b,B[0]);
 chState(c).lines.push({tool:'trend',i1:p1.i,p1:byLow?p1.d.l:p1.d.h,i2:p2.i,p2:byLow?p2.d.l:p2.d.h,kind:byLow?'low':'high'})
}
function drawTrend(a,c,t){
 chState(c);
 const d=series(c),v=chartView.get(c.id);
 const i0=v?Math.max(0,Math.floor(v.i0)):BARS_TOTAL-BARS_VIEW,i1=v?Math.min(d.length-1,Math.ceil(v.i1)):BARS_TOTAL-1;
 const win=[];for(let i=i0;i<=i1;i++)win.push({i,d:d[i]});
 if(win.length<6)return say(a,'Слишком мало свечей в окне, чтобы провести линию.');
 // по умолчанию — по направлению участка: растёт, значит по минимумам
 const rise=win[win.length-1].d.c>=win[0].d.c;
 const byLow=/поддерж|минимум|снизу|восход/.test(t)?true:/сопротив|максимум|сверху|нисход/.test(t)?false:rise;
 const half=Math.floor(win.length/2),A=win.slice(0,half),B=win.slice(half);
 const p1=byLow?A.reduce((b,x)=>x.d.l<b.d.l?x:b,A[0]):A.reduce((b,x)=>x.d.h>b.d.h?x:b,A[0]);
 const p2=byLow?B.reduce((b,x)=>x.d.l<b.d.l?x:b,B[0]):B.reduce((b,x)=>x.d.h>b.d.h?x:b,B[0]);
 const y1=byLow?p1.d.l:p1.d.h,y2=byLow?p2.d.l:p2.d.h;
 // сколько свечей линия задевает — так видно, что она не с потолка
 const k=(y2-y1)/((p2.i-p1.i)||1),tol=(Math.max(...win.map(x=>x.d.h))-Math.min(...win.map(x=>x.d.l)))*0.006;
 const touches=win.filter(x=>Math.abs((byLow?x.d.l:x.d.h)-(y1+k*(x.i-p1.i)))<tol).length;
 c.lines.push({tool:'trend',i1:p1.i,p1:y1,i2:p2.i,p2:y2,kind:byLow?'low':'high'});
 drawTool=null;c.pending=null;c.suggest=null;
 say(a,'Провёл трендовую '+(byLow?'по минимумам':'по максимумам')+': '+fmt(y1,c.sym)+' → '+fmt(y2,c.sym)+', касаний '+touches+'. Сейчас на графике — '+chDesc(c)+'.',
  {title:'Трендовая линия',tag:byLow?'Поддержка':'Сопротивление',rows:[['Построена','по '+(byLow?'минимумам':'максимумам')+' видимого окна'],['Касаний свечей',String(touches)],['Наклон',(k>0?'вверх':'вниз')]],
   note:'Не та? Скажите «перестрой по максимумам» или «убери линию».'});
 dock='small';render()
}
function finishLine(c,pt){
 const tool=drawTool||'trend',T=toolOf(tool);
 chState(c).lines.push({tool,i1:c.pending.i,p1:c.pending.p,i2:pt.i,p2:pt.p});
 c.pending=null;c.suggest=null;drawTool=null;
 const a=current();
 if(a){
  const extra=tool==='measure'?' Разница '+pct((pt.p-c.pending0)/c.pending0*100,true):'';
  say(a,T.name+' построена. Сейчас на графике — '+chDesc(c)+'.')
 }
 render()
}
// однотапные построения — горизонталь ставится сразу
function placeSingle(c,pt){
 chState(c).lines.push({tool:'hline',i1:pt.i,p1:pt.p,i2:pt.i,p2:pt.p});
 drawTool=null;const a=current();
 if(a)say(a,'Поставил горизонталь на '+fmt(pt.p,c.sym)+'. Сейчас на графике — '+chDesc(c)+'.');
 render()
}
// Человек подвинул или отмасштабировал график — бот замечает и учитывает в разговоре.
let moveTimer=null;
function noteUserMove(c,what){
 c.userMoved=what;
 clearTimeout(moveTimer);
 moveTimer=setTimeout(()=>{const a=current();if(a&&focusCh(a)===c){c.seenByBot=what;renderDockOnly()}},700)
}
function renderDockOnly(){const a=current();if(a&&$('dock'))render()}
// Что бот знает об открытом графике прямо сейчас
function chartContext(a){
 const c=focusCh(a);if(!c)return '';
 const v=chartView.get(c.id);
 const d=series(c),i0=v?Math.max(0,Math.floor(v.i0)):0,i1=v?Math.min(d.length-1,Math.ceil(v.i1)):d.length-1;
 return c.sym+' · '+c.tf+' · '+chDesc(c)+(v?' · окно '+tfFmt(d[i0].t,c.tf)+' — '+tfFmt(d[i1].t,c.tf):'')
}
/* ---------- разговор о графике ----------
   Бот держит в голове состояние открытого графика, поэтому понимает
   «этот», «нижний», «оставь» — без повторного называния предмета. */
const INDS={rsi:'RSI',macd:'MACD',ema:'EMA 50',volume:'Объём',atr:'ATR'};
function indFrom(t){
 const out=[];
 if(/rsi|рси/.test(t))out.push('rsi');
 if(/macd|макд/.test(t))out.push('macd');
 if(/ema|скользящ|средн/.test(t))out.push('ema');
 if(/объ[её]м|volume/.test(t))out.push('volume');
 if(/atr|атр|волатильн/.test(t))out.push('atr');
 return out
}
// Какой уровень имеется в виду: нижний, верхний или оба
function levelSide(t){
 if(/нижн|поддерж|снизу/.test(t))return 'low';
 if(/верхн|сопротив|сверху/.test(t))return 'high';
 return null
}
function levelPrice(c,role){
 const d=series(c),v=chartView.get(c.id),i0=v?Math.max(0,Math.floor(v.i0)):BARS_TOTAL-BARS_VIEW,i1=v?Math.min(d.length-1,Math.ceil(v.i1)):BARS_TOTAL-1;
 const win=d.slice(i0,i1+1);
 return role==='low'?Math.min(...win.map(x=>x.l)):Math.max(...win.map(x=>x.h))
}
// Перестроить уровень по последним экстремумам видимого окна
function rebuildLevel(c,role,recent){
 const d=series(c),v=chartView.get(c.id),i1=v?Math.min(d.length-1,Math.ceil(v.i1)):BARS_TOTAL-1;
 const from=recent?Math.max(0,i1-30):(v?Math.max(0,Math.floor(v.i0)):BARS_TOTAL-BARS_VIEW);
 const win=d.slice(from,i1+1);
 return role==='low'?Math.min(...win.map(x=>x.l)):Math.max(...win.map(x=>x.h))
}
// Поручение про открытый график. Возвращает текст ответа или null, если это не про график.
// Фраза «RSI убери, нижний оставь, верхний перестрой» — три поручения в одном.
// Разбираем по частям, иначе слова из соседней части перебивают друг друга.
function chartTalk(a,text,t){
 const c=focusCh(a);if(!c)return null;
 chState(c);
 // «вчерашние максимум и минимум» — одно поручение, по «и» его не режем
 const parts=PD_RE.test(t)?[text]:text.split(/\s*[,;]\s*|\s+и\s+(?=[а-яa-z])/i).filter(x=>x.trim());
 if(parts.length>1){
  const all=[];
  for(const p of parts){const r=chartClause(a,c,p,p.toLowerCase());if(r)all.push(r)}
  if(!all.length)return null;
  return 'Готово: '+all.join(', ')+'. Сейчас на графике — '+chDesc(c)+'.'
 }
 const one=chartClause(a,c,text,t);
 return one?'Готово: '+one+'. Сейчас на графике — '+chDesc(c)+'.':null
}
// Одно поручение про график. Возвращает краткое описание сделанного или null.

const PD_RE=/вчерашн|вчера|prev(ious)? ?day|pdh|pdl/;
/* Вчерашние максимум и минимум: берём свечи прошлых календарных суток
   того же ряда, по которому рисуется график. */
function prevDayLevels(c){
 const data=series(c),last=new Date(data[data.length-1].t);
 const day=new Date(last.getFullYear(),last.getMonth(),last.getDate()).getTime();
 const prev=day-86400000;
 const win=data.filter(d=>d.t>=prev&&d.t<day);
 const use=win.length?win:data.slice(-Math.min(data.length,Math.round(1440/(TF_MIN[c.tf]||60))||24));
 return {high:Math.max(...use.map(d=>d.h)),low:Math.min(...use.map(d=>d.l))}
}

function chartClause(a,c,text,t){
 const done=[],sym=pickSym(text),tf=pickTf(text);
 let touched=false;

 if(sym&&sym!==c.sym){c.sym=sym;c.drawing=null;c.levels=[];c.lines=[];chartView.delete(c.id);done.push('открыл '+sym);touched=true}
 if(tf&&tf!==c.tf){c.tf=tf;chartView.delete(c.id);done.push('перевёл на '+tf);touched=true}

 // индикаторы
 const inds=indFrom(t),drop=/убер|удали|сними|выключ|скрой|без /.test(t);
 // вчерашние максимум и минимум
 if(PD_RE.test(t)){
  const {high,low}=prevDayLevels(c);
  const wantH=/high|максим|хай|верхн/.test(t),wantL=/low|миним|лой|нижн/.test(t);
  const pair=(wantH===wantL);
  if(drop){
   c.levels=c.levels.filter(l=>!(l.role==='pdh'&&(pair||wantH))&&!(l.role==='pdl'&&(pair||wantL)));
   done.push('убрал вчерашние уровни')
  } else {
   const add=(role,price)=>{const ex=c.levels.find(l=>l.role===role);if(ex)ex.price=price;else c.levels.push({role,price})};
   if(pair||wantH)add('pdh',high);
   if(pair||wantL)add('pdl',low);
   done.push('отметил вчерашн'+(pair?'ие максимум и минимум':wantH?'ий максимум':'ий минимум'))
  }
  return done.join(', ')
 }

 if(inds.length){
  inds.forEach(k=>{
   const has=c.ind.includes(k);
   if(drop&&has){c.ind=c.ind.filter(x=>x!==k);done.push('убрал '+INDS[k])}
   else if(!drop&&!has){c.ind.push(k);done.push('добавил '+INDS[k])}
  });
  touched=true
 }
 // «убери индикаторы» без названия — снимаем все
 else if(drop&&/индикатор/.test(t)&&c.ind.length){done.push('убрал индикаторы: '+c.ind.map(k=>INDS[k]).join(', '));c.ind=[];touched=true}

 // уровни
 const side=levelSide(t);
 const levelVerb=/перестро|пересчит|обнов|покажи|отметь|постав|убер|удали|сними/.test(t);
 if(/уровн|поддерж|сопротив/.test(t)||(side&&levelVerb)){
  if(/перестро|пересчит|обнов/.test(t)){
   const role=side||'high',recent=/последн|свеж|новы/.test(t);
   const p=rebuildLevel(c,role,recent);
   const ex=c.levels.find(l=>l.role===role);
   if(ex)ex.price=p; else c.levels.push({role,price:p});
   done.push('перестроил '+(role==='low'?'нижний':'верхний')+' уровень'+(recent?' по последним экстремумам':''));touched=true
  } else if(drop){
   if(side){c.levels=c.levels.filter(l=>l.role!==side);done.push('убрал '+(side==='low'?'нижний':'верхний')+' уровень')}
   else {c.levels=[];done.push('убрал уровни')}
   touched=true
  } else {
   const want=side?[side]:['high','low'];
   want.forEach(role=>{if(!c.levels.find(l=>l.role===role))c.levels.push({role,price:levelPrice(c,role)})});
   done.push(side?'показал '+(side==='low'?'нижний':'верхний')+' уровень':'показал уровни');touched=true
  }
 }
 // «оставь» — явное подтверждение, что объект не трогаем
 const keep=/оставь|не трогай|сохрани/.test(t)?(levelSide(t)==='low'?'нижний уровень оставил':levelSide(t)==='high'?'верхний уровень оставил':'остальное оставил'):null;

 if(c.lines.length&&(/лини|трендов/.test(t)||(/перестро|пересчит|обнов/.test(t)&&/максимум|минимум/.test(t)))){
  if(drop){c.lines=[];done.push('убрал трендовые линии');touched=true}
  else if(/перестро|пересчит|обнов|по максимум|по минимум/.test(t)){
   c.lines.pop();drawTrendQuiet(c,t);done.push('перестроил трендовую '+(/максимум|сопротив/.test(t)?'по максимумам':'по минимумам'));touched=true
  }
 }

 if(!touched&&!keep)return null;
 if(keep)done.push(keep);
 return done.join(', ')
}

// Обёртка: если поручение про открытый график — выполняем и отвечаем.
function pickSuggest(n){
 const a=current(),c=a&&focusCh(a);if(!c||!c.pending||!c.suggest)return;
 finishLine(c,c.suggest[n])
}
function chartReply(a,text,t){
 const c0=focusCh(a);
 // человек сам двигал график — бот это заметил и упоминает в ответе
 if(c0&&c0.userMoved){c0.sawMove=c0.userMoved;c0.userMoved=null}
 // выбор варианта трендовой линии словами
 if(c0&&c0.pending&&/вариант\s*([123])|перв|втор|трет/.test(t)){
  const m=t.match(/вариант\s*([123])/);
  const n=m?+m[1]-1:/перв/.test(t)?0:/втор/.test(t)?1:2;
  if(c0.suggest&&c0.suggest[n]){finishLine(c0,c0.suggest[n]);return true}
 }
 if(c0&&/сам нарисую|я нарисую|дай нарисую|нарисую сам|ручн/.test(t)&&!c0.pending){
  drawTool='trend';dock='small';
  say(a,'Рисуйте сами: панель инструментов под графиком, сейчас выбрана трендовая. Поставьте первую точку.');
  render();return true
 }
 if(c0&&/трендов|проведи лини|нарисуй лини/.test(t)&&!c0.pending){
  drawTrend(a,c0,t);
  return true
 }
 const r=chartTalk(a,text,t);
 if(!r)return false;
 const c=focusCh(a);
 const saw=c.sawMove?' Вижу, вы '+c.sawMove+' график — считаю по видимому окну.':'';c.sawMove=null;
 say(a,r+saw,{title:'График '+c.sym+' · '+c.tf,tag:'Изменён',lines:[chDesc(c)],note:'Можно продолжать: «убери RSI», «нижний оставь», «верхний перестрой по последним максимумам».'});
 return true
}
function tradeCommand(a,text,t){
 if(/подключ|привяж|счёт|счет|баланс|брокер|аккаунт/.test(t)&&!/риск/.test(t)){
  if(!a.account){say(a,'Открываю подключение счёта. Выберите брокера и тип счёта — пароли в прототипе не запрашиваются.');setTimeout(accountDialog,120);return}
  const c=a.account,pl=c.equity-c.balance;
  return say(a,'Счёт подключён, вот текущее состояние.',{title:c.broker+' · '+c.type,tag:'Счёт '+mask(c.login),rows:[['Баланс',money(c.balance,c.cur)],['Средства',money(c.equity,c.cur)],['Результат',(pl>=0?'+':'')+money(pl,c.cur)],['Лимит риска',a.risk?a.risk+'% на сделку':'не задан']],note:'Демонстрационные данные. Реального брокерского подключения нет.'})
 }
 if(/риск/.test(t)){
  const m=t.match(/(\d+(?:[.,]\d+)?)\s*%/),risk=m?Number(m[1].replace(',','.')):null;
  if(risk!==null&&(risk<=0||risk>100))return say(a,'Укажите лимит риска больше 0% и не более 100%.');
  if(risk!==null){a.risk=risk;return say(a,'Сохранил лимит '+risk+'% на сделку для этого бота.',{title:'Ограничение риска',rows:[['Бот',a.name],['Лимит на сделку',risk+'%'],['Счёт',a.account?a.account.broker+' · '+a.account.type:'не подключён']],note:'Правило помощника. Реального исполнения нет.'},'')}
  return say(a,a.risk?'Мой лимит: '+a.risk+'% на сделку.':'Лимит риска не задан. Напишите, например, «риск 1%».')
 }
 if(/ctrader|metatrader|метатрейдер|ситрейдер|браузер|python|скрипт|код|терминал|компьютер/.test(t)){
  const app=/ctrader|ситрейдер/.test(t)?'cTrader Web':/metatrader|метатрейдер/.test(t)?'MetaTrader Web':/python|скрипт|код|терминал/.test(t)?'Python':'Браузер';
  return startRun(a,{title:'Общий компьютер',steps:['Проверяю рабочее место…','Запускаю '+app+'…','Готовлю окно…'],dur:2200,effect:{t:'app',v:app},reply:app==='Python'?'Подготовил пример скрипта для чтения свечей. Он доступен в Python на общем компьютере.':'Открыл '+app+' на общем компьютере — значок компьютера вверху или закреплённый чат слева.',card:{title:app,rows:[['Где','Общий компьютер'],['Доступ','Вся команда']],note:'Демонстрация интерфейса. Виртуальная машина и брокер не подключены.'},task:{title:'Общий компьютер',detail:'Подготовлено: '+app},log:app==='Python'?'Подготовлен демонстрационный скрипт анализа':'Открыто приложение '+app})
 }
 const c=focusCh(a),ci=focusIdx(a),lbl=chLabel(c);
 if(!c)return say(a,'У меня пока нет ни одного графика. Попросите «добавь график BTC/USD 1H».');
 if(/(убери|удали|скрой|закрой)[^.]{0,25}(график|чарт)/.test(t)){
  if(chartsOf(a).length<2)return say(a,'Это единственный график, оставлю его. Можно сменить инструмент или таймфрейм.');
  a.charts.splice(ci,1);a.focus=0;
  return say(a,'Убрал график '+lbl+'. Осталось: '+chartsOf(a).map(chLabel).join(', ')+'.')
 }
 if(/добав.*(график|чарт)|ещё один график|еще один график|второй график|новый график|сравн.*(таймфрейм|тф)/.test(t)){
  if(chartsOf(a).length>=6)return say(a,'В этом диалоге уже шесть графиков — больше в прототипе не показываю.');
  const sym=pickSym(text)||c.sym,i=tfs.indexOf(c.tf),tf=pickTf(text)||tfs[i+1]||tfs[i-1];
  const nc=addChart(a,sym,tf);
  return say(a,'Добавил график '+chLabel(nc)+'.',{title:'Графики бота',lines:chartsOf(a).map((x,n)=>(n===a.focus?'▸ ':'   ')+chLabel(x)),note:'Поручения из диалога применяются к выбранному графику.'})
 }
 const changed=parseChart(c,text);
 if(/убери|удали|очисти/.test(t)&&/лини|размет|канал|уров/.test(t)){c.drawing=null;return say(a,'Убрал разметку с '+chLabel(c)+'.')}
 if(/выше|ниже/.test(t)&&c.drawing==='channel'){const d=t.includes('ниже')?-.2:.2;c.shift=(c.shift||0)+d;return say(a,'Сдвинул обе границы канала '+(d<0?'ниже.':'выше.'))}
 if(/канал|тренд/.test(t))return startRun(a,{title:'Построение канала',steps:['Читаю свечи '+chLabel(c)+'…','Считаю наклон…','Рисую границы…'],effect:{t:'draw',v:'channel',ci},reply:'Построил канал на '+chLabel(c)+'. Можно попросить сдвинуть его выше или ниже.',card:{title:'Канал построен',tag:chLabel(c),rows:[['Метод','Регрессия по закрытиям'],['Свечей в расчёте','48']],note:'Разметка добавлена на выбранный график.'},task:{title:'Построен канал',detail:chLabel(c)},log:'Построен канал '+chLabel(c)});
 if(/уров|сопротив|поддерж/.test(t))return startRun(a,{title:'Разметка уровней',steps:['Ищу экстремумы…','Проверяю касания…','Ставлю линии…'],effect:{t:'draw',v:'levels',ci},reply:'Отметил максимум и минимум показанного участка на '+chLabel(c)+'.',card:{title:'Уровни отмечены',tag:chLabel(c),lines:['Сопротивление — верхняя граница участка','Поддержка — нижняя граница участка'],note:'Две горизонтальные линии добавлены на график.'},task:{title:'Отмечены уровни',detail:chLabel(c)},log:'Отмечены уровни '+chLabel(c)});
 if(changed)return say(a,'Переключил график на '+chLabel(c)+'. История диалога сохранилась.');
 if(/анализ|сценари|что вид|разбер|прогноз/.test(t))return startRun(a,{title:'Разбор графика',steps:['Смотрю структуру…','Отмечаю границы диапазона…','Формулирую сценарии…'],dur:2600,effect:{t:'draw',v:'levels',ci},reply:'Разметил границы диапазона на '+chLabel(c)+'. Наблюдаем два события: выход за верхнюю границу или возврат к нижней.',card:{title:'Сценарии',tag:chLabel(c),lines:['Выход вверх — работаем от пробоя','Возврат вниз — ждём реакцию от поддержки','Внутри диапазона — сделок нет'],note:'Демонстрация анализа на учебных данных, не текущий рынок.'},task:{title:'Разбор диапазона',detail:chLabel(c)}});
 say(a,'Могу: сменить инструмент или таймфрейм, добавить индикаторы, отметить уровни, провести трендовую, построить канал, проверить торговую идею на истории и завести регулярную задачу. Например: «добавь RSI», «проведи трендовую», «проверь идею: пробой диапазона».')
}
function opsCommand(a,text,t){
 const peers=state.agents.filter(x=>kindOf(x)==='trade');
 if(/риск/.test(t)){
  const m=t.match(/(\d+(?:[.,]\d+)?)\s*%/),risk=m?Number(m[1].replace(',','.')):null;
  if(risk!==null&&(risk<=0||risk>100))return say(a,'Укажите лимит риска больше 0% и не более 100%.');
  if(risk!==null)return peers.length?startRun(a,{title:'Ограничения риска',steps:['Собираю торговых ботов…','Записываю лимит…','Проверяю результат…'],dur:2000,effect:{t:'risk',v:risk,all:true},reply:'Сохранил лимит '+risk+'% на сделку для '+peers.length+' помощников.',card:{title:'Лимит обновлён',rows:peers.map(x=>[x.name,risk+'%']),note:'Правила помощников. Брокерского исполнения нет.'},task:{title:'Ограничения риска',detail:'Всем торговым: '+risk+'%'},log:'Установлен лимит риска '+risk+'% для '+peers.length+' ботов'}):say(a,'В команде пока нет торговых ботов.');
  return say(a,peers.length?'Проверил ограничения команды.':'Пока некого проверять.',{title:'Риск по команде',rows:peers.map(x=>[x.name,x.risk?x.risk+'% на сделку':'не задан']),note:'Проверены настройки помощников. Открытые позиции не подключены.'})
 }
 if(/счёт|счет|брокер|подключ/.test(t))return say(a,'Состояние подключений команды.',{title:'Счета',rows:peers.map(x=>[x.name,x.account?x.account.broker+' · '+x.account.type:'не подключён']),note:'Подключение счёта делается в диалоге самого помощника.'});
 if(/сводк|состоян|обзор|команд/.test(t))return startRun(a,{title:'Сводка по команде',steps:['Опрашиваю ботов…','Считаю задачи…','Собираю сводку…'],dur:2200,reply:'Собрал общую картину по команде.',card:{title:'Команда',rows:[['Всего помощников',String(state.agents.length-1)],['Торговых',String(peers.length)],['Со счётом',peers.filter(x=>x.account).length+'/'+peers.length],['Без лимита риска',String(peers.filter(x=>!x.risk).length)],['Сейчас работают',String(live().length)]],note:'Демоданные этого устройства.'},task:{title:'Сводка по команде',detail:state.agents.length-1+' ботов'}});
 say(a,'Я слежу за командой. Попросите: «Проверь риски команды», «Установи всем риск 1%», «Кто сейчас работает» или «Покажи счета».')
}
function infoCommand(a,text,t){
 if(/напомн|заметк|запиши|запомни/.test(t)){
  if(/покажи|список|какие/.test(t))return say(a,a.notes.length?'Ваши заметки:':'Заметок пока нет — напишите «Запиши: …».',a.notes.length?{title:'Заметки',lines:a.notes.slice(-6).map(n=>n.text+' · '+n.time)}:null);
  const body=text.replace(/^(напомни|запиши|заметка|запомни)[:\s]*/i,'').trim()||text;
  apply(a,{t:'note',v:body});
  return say(a,'Записал.',{title:'Напоминание',lines:[body],note:'Хранится на этом устройстве. Системных уведомлений в прототипе нет.'})
 }
 if(/новост|событ|повестк|важн|сводк|дайджест/.test(t))return startRun(a,{title:'Сводка',steps:['Просматриваю источники…','Отбираю важное…','Пишу дайджест…'],dur:2600,reply:'Готова короткая сводка.',card:{title:'Что важно сегодня',tag:'Учебный пример',lines:['Ставки: рынок ждёт мягкого тона регулятора','Сырьё: золото держится у верхней границы диапазона','Крипто: объёмы ниже средних, движение вялое'],note:'Демонстрационный текст, не настоящие новости.'},task:{title:'Сводка новостей',detail:'3 пункта'},log:'Собрана сводка новостей'});
 if(/отчёт|отчет|сравн|исследу|найди|подбер|посчитай|анализ/.test(t))return startRun(a,{title:'Отчёт',steps:['Разбираю запрос…','Собираю данные…','Оформляю вывод…'],dur:2800,reply:'Отчёт готов, вывод в первой строке.',card:{title:'Вывод',lines:['Коротко: данных за период хватает для сравнения','Метод: сопоставление по одинаковым интервалам','Ограничение: в прототипе используются учебные данные'],note:'Полный текст отчёта появится здесь в рабочей версии.'},task:{title:'Отчёт',detail:text.slice(0,60)},log:'Подготовлен отчёт'});
 if(/компьютер|браузер|python|скрипт/.test(t))return startRun(a,{title:'Общий компьютер',steps:['Проверяю рабочее место…','Запускаю приложение…'],dur:1800,effect:{t:'app',v:/python|скрипт/.test(t)?'Python':'Браузер'},reply:'Открыл приложение на общем компьютере.',card:{title:/python|скрипт/.test(t)?'Python':'Браузер',rows:[['Где','Общий компьютер'],['Доступ','Вся команда']]},task:{title:'Общий компьютер',detail:/python|скрипт/.test(t)?'Python':'Браузер'},log:'Открыто приложение на общем компьютере'});
 say(a,'Я работаю без графика. Попросите сводку, отчёт, сравнение или скажите «Запиши: …», чтобы сохранить заметку.')
}

/* ---------- диалоги ---------- */
function modal(title,body){const d=$('dialog');d.classList.remove('sheet');d.innerHTML='<div class="dialoghead"><h2 class="grow">'+title+'</h2><button class="iconbtn" aria-label="Закрыть" onclick="closeDialog()">'+icon('close')+'</button></div><div class="dialogbody">'+body+'</div>';$('dialog').showModal()}
function closeDialog(){$('dialog').close()}
function createDialog(){
 modal('Новый бот','<form id="createform"><p class="muted" style="margin-bottom:18px">Опишите, чем бот должен заниматься. Роль и нужные инструменты подберутся сами — торговый получит график, остальные обойдутся без него.</p><label class="label" for="agentname">Имя</label><input id="agentname" required maxlength="45" placeholder="Например, BTC analyst"><div class="formgap"><label class="label" for="goal">Чем он занимается</label><textarea id="goal" rows="5" required maxlength="1200" placeholder="Например: следи за BTC/USD на 4H и отмечай уровни. Или: присылай сводку новостей каждое утро."></textarea></div><div class="chips formgap">'
 +['Проверь стратегию пробоя диапазона по биткоину','Следи за BTC/USD на 4H и отмечай уровни','Присылай сводку новостей утром','Веди мои заметки и напоминания','Собирай отчёты и сравнения'].map((s,i)=>'<button type="button" class="chip" onclick="fillGoal('+i+')">'+s+'</button>').join('')
 +'</div><button class="primary fullwidth formgap">Создать бота</button></form>');
 $('createform').onsubmit=e=>{e.preventDefault();const name=$('agentname').value.trim(),goal=$('goal').value.trim();if(!name||!goal)return;
  const role=inferRole(goal),r=roles[role],a={id:uid(),role,name,goal,charts:r.kind==='trade'?[{id:uid(),sym:r.sym,tf:r.tf,drawing:null,shift:0}]:[],focus:0,risk:null,paused:false,notes:[],tasks:[],account:null,messages:[{role:'user',ts:Date.now(),text:goal}]};
  if(r.kind==='trade'){parseChart(a.charts[0],goal);const rm=goal.match(/риск[^0-9]{0,30}(\d+(?:[.,]\d+)?)\s*%/i);if(rm)a.risk=Number(rm[1].replace(',','.'))}
  say(a,role==='quant'?'Принял. Подготовил '+chLabel(a.charts[0])+'. Опишите торговую идею — уточню условия, формализую стратегию и проверю на истории. Входы и выходы отмечу на графике.':r.kind==='trade'?'Принял поручение. Подготовил '+chLabel(a.charts[0])+'. Первый шаг: отметить уровни или построить канал?':r.kind==='ops'?'Буду собирать состояние команды. Начнём с проверки рисков?':'Принял. Напишите, что нужно сделать первым — соберу и пришлю результат сюда.',
   {title:'Бот создан',rows:[['Роль',r.name],['Инструменты',r.kind==='trade'?'График и общий компьютер':'Общий компьютер'],['Счёт',r.kind==='trade'?'можно подключить в настройках':'не требуется']]},'Настройки сохранены на этом устройстве.');
  state.agents.push(a);active=a.id;view='agent';dock=swapped?'small':'half';expanded=false;save();closeDialog();render()}
}
const samples=['Проверь стратегию: пробой диапазона по BTC/USD на 1H, риск 1% на сделку.','Следи за BTC/USD на 4H, отмечай уровни и объясняй сценарии.','Присылай короткую сводку новостей каждое утро.','Веди мои заметки и напоминания, держи список коротким.','Собирай отчёты и сравнения по моим запросам.'];
function fillGoal(i){$('goal').value=samples[i];if(!$('agentname').value)$('agentname').value=roles[inferRole(samples[i])].name}
function picker(title,items,cur,fn,note){
 modal(title,'<div class="picklist">'+items.map(v=>'<button class="pickrow'+(v===cur?' on" autofocus':'"')+' onclick="'+fn+'(\''+v+'\')">'+esc(v)+(v===cur?icon('check'):'')+'</button>').join('')+'</div>'+(note?'<div class="notice formgap">'+note+'</div>':''))
}
function symbolDialog(i){
 const a=current();if(!a)return;pickIdx=i===undefined?focusIdx(a):i;
 const c=chartsOf(a)[pickIdx];if(c)picker('Инструмент',Object.keys(instruments),c.sym,'setSymbol')
}
function setSymbol(sym){
 const a=current();closeDialog();const c=a&&chartsOf(a)[pickIdx];if(!c||c.sym===sym)return;
 c.sym=sym;c.drawing=null;c.shift=0;
 say(a,'Открыл '+chLabel(c)+'. Разметку снял, история диалога сохранилась.');save();render()
}
function tfDialog(i){
 const a=current();if(!a)return;pickIdx=i===undefined?focusIdx(a):i;
 const c=chartsOf(a)[pickIdx];if(c)picker('Таймфрейм',tfs,c.tf,'setTf')
}
function setTf(tf){
 const a=current();closeDialog();const c=a&&chartsOf(a)[pickIdx];if(!c||c.tf===tf)return;
 c.tf=tf;c.drawing=null;c.shift=0;
 say(a,'Переключил график на '+chLabel(c)+'.');save();render()
}
function chartsDialog(){
 const a=current();if(!a)return;const list=chartsOf(a),f=focusIdx(a);
 modal('Графики бота','<div class="picklist">'+list.map((c,i)=>'<button class="pickrow'+(i===f?' on" autofocus':'"')+' onclick="pickChart('+i+')">'+esc(chLabel(c))+(i===f?icon('check'):'')+'</button>').join('')+'</div>'
 +(list.length<6?'<button class="thinrow fullwidth" onclick="addChartDialog()">'+icon('plus')+'<span class="grow">Добавить график</span></button>':'')
 +(list.length>1?'<button class="thinrow fullwidth" onclick="removeChart('+f+')">'+icon('close')+'<span class="grow">Убрать «'+esc(chLabel(list[f]))+'»</span></button>':'')
 +'<div class="notice formgap">Поручения из диалога применяются к выбранному графику.</div>')
}
function pickChart(i){
 const a=current();closeDialog();if(!a)return;
 a.focus=i;drawTool=null;
 const c=focusCh(a);
 say(a,'Переключился на '+chLabel(c)+'. Здесь — '+chDesc(c)+'. Всё, что было на прошлом графике, сохранено.');
 save();render()
}
function addChartDialog(){const a=current();if(a)picker('Инструмент нового графика',Object.keys(instruments),null,'addChartSym')}
function addChartSym(sym){const a=current();closeDialog();if(!a)return;pendingSym=sym;picker('Таймфрейм нового графика',tfs,null,'addChartTf')}
function addChartTf(tf){
 const a=current();closeDialog();if(!a)return;
 const c=addChart(a,pendingSym,tf);
 say(a,'Добавил график '+chLabel(c)+'. Всего графиков: '+chartsOf(a).length+'.');save();render()
}
function removeChart(i){
 const a=current();closeDialog();if(!a||chartsOf(a).length<2)return;
 const c=a.charts.splice(i,1)[0];a.focus=0;
 say(a,'Убрал график '+chLabel(c)+'.');save();render()
}
// Тема: системная по умолчанию, дальше — выбор пользователя. Токены живут в CSS, здесь только переключение.
let theme=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
function applyTheme(){
 document.documentElement.setAttribute('data-theme',theme);
 const meta=document.querySelector('meta[name="theme-color"]');
 if(meta)meta.setAttribute('content',theme==='light'?'#f2f2f4':'#121315')
}
function setTheme(v){theme=v;applyTheme();closeDialog();render()}
function toggleTheme(){theme=theme==='light'?'dark':'light';applyTheme();render()}
applyTheme();
window.matchMedia?.('(prefers-color-scheme: light)').addEventListener?.('change',e=>{theme=e.matches?'light':'dark';applyTheme();render()});
function settingsDialog(){
 const a=current(),k=kindOf(a);
 modal('Настройки бота','<form id="settingsform"><label class="label" for="editname">Имя</label><input id="editname" value="'+esc(a.name)+'" maxlength="45" required><label class="label formgap" for="editgoal">Поручение</label><textarea id="editgoal" rows="4" required>'+esc(a.goal)+'</textarea><div class="settingsrow"><span>Роль</span>'+esc(roles[a.role].name)+'</div>'
 +(k==='trade'?'<button type="button" class="settingsrow fullwidth linkrow" onclick="accountDialog()"><span>Счёт</span><span class="val">'+(a.account?esc(a.account.broker+' · '+a.account.type):'не подключён')+' '+icon('chevron')+'</span></button><div class="settingsrow"><span>Лимит риска</span>'+(a.risk?a.risk+'% на сделку':'не задан')+'</div>':'')
 +'<div class="settingsrow"><span>Компьютер</span>Общий для команды</div><div class="settingsrow"><span>Данные</span>Только это устройство</div>'
 +'<div class="settingsrow"><span>Тема</span>'+(theme==='light'?'Светлая':'Тёмная')+' · переключается кликом по логотипу</div>'
 +'<button class="primary fullwidth formgap">Сохранить</button></form>');
 $('settingsform').onsubmit=e=>{e.preventDefault();if(!$('editname').value.trim()||!$('editgoal').value.trim())return;a.name=$('editname').value.trim();a.goal=$('editgoal').value.trim();save();closeDialog();render()}
}
function accountDialog(){
 const a=current();if(!a||kindOf(a)!=='trade')return;
 modal(a.account?'Счёт бота':'Подключить счёт','<form id="accform"><label class="label" for="broker">Брокерский терминал</label><select id="broker">'+Object.keys(brokers).map(b=>'<option '+(a.account&&a.account.broker===b?'selected':'')+'>'+b+'</option>').join('')+'</select><label class="label formgap" for="acctype">Тип счёта</label><select id="acctype">'+['Демо','Реальный'].map(x=>'<option '+(a.account&&a.account.type===x?'selected':'')+'>'+x+'</option>').join('')+'</select><div class="formgap notice">'+icon('wallet')+'<span>В прототипе логин и пароль не запрашиваются: счёт подключается условно, торговых поручений не отправляется.</span></div><button class="primary fullwidth formgap">'+(a.account?'Переподключить':'Подключить')+'</button>'+(a.account?'<button type="button" class="secondary fullwidth formgap" onclick="disconnect()">Отключить счёт</button>':'')+'</form>');
 $('accform').onsubmit=e=>{e.preventDefault();const broker=$('broker').value,type=$('acctype').value,login=brokers[broker].pre+String(3000000+Math.floor(Math.random()*999999));closeDialog();
  startRun(a,{title:'Подключение счёта',steps:['Открываю '+broker+'…','Проверяю тип счёта…','Читаю баланс…'],dur:2600,effect:{t:'account',broker,type,login,balance:10000,equity:10000+Math.round((Math.random()*400-120))},reply:'Счёт подключён. Дальше могу показывать баланс прямо здесь, в диалоге.',card:{title:broker+' · '+type,rows:[['Счёт',mask(login)],['Валюта','USD'],['Торговля','только по вашему подтверждению']],note:'Демоподключение. Реальных ордеров не отправляется.'},task:{title:'Подключён счёт',detail:broker+' · '+type},log:'Подключён счёт '+broker+' ('+type+')'});
  view='agent';dock=swapped?'small':'half';save();render()}
}
function disconnect(){const a=current();if(!a)return;a.account=null;a.log=a.log||[];a.log.push({text:'Счёт отключён',time:clock()});say(a,'Отключил счёт. Работаю только с графиком.');save();closeDialog();render()}
function voice(){
 // Голос и клавиатура не уживаются: любое обращение к микрофону её убирает
 // и поле ввода фокус не получает, иначе на телефоне выскочит системная.
 closeKeyboard();$('prompt')?.blur();
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Speech){modal('Голосовой ввод','<p>Этот браузер не поддерживает распознавание речи. Введите поручение текстом в поле диалога.</p><button class="primary fullwidth formgap" onclick="closeDialog();setDock(\'half\',true)">Написать поручение</button>');return}
 // Панель не раскрываем: раскрывать её или нет, решает ответ бота, а не сам факт диктовки.
 const rec=new Speech();rec.lang='ru-RU';rec.interimResults=false;
 const p0=$('prompt');if(p0)p0.placeholder='Говорите…';
 rec.onresult=e=>{if($('prompt'))$('prompt').value=e.results[0][0].transcript};
 rec.onerror=()=>{modal('Микрофон недоступен','<p>Не удалось распознать речь. Проверьте доступ к микрофону или введите поручение текстом.</p>')};
 rec.onend=()=>{if($('prompt'))$('prompt').placeholder='Поручите задачу…'};
 try{rec.start()}catch{rec.onerror()}
}
$('dialog').addEventListener('click',e=>{if(e.target===$('dialog')){const r=$('dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()}});
render();
