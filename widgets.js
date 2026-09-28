'use strict';
/* ============================================================
   КАТАЛОГ ВИДЖЕТОВ WORKSPACE
   Один бот, в рабочем пространстве которого показаны все типы
   содержимого, какие вообще могут там жить, — каждый в своей
   визуальной форме и со своей визуальной массой.
   Это справочник форм, а не рабочее пространство настоящего бота:
   набор виджетов под конкретного бота собирается отдельно.
   ============================================================ */

roles.catalog={name:'Каталог виджетов',sub:'Все типы содержимого Workspace',sym:'BTC/USD',tf:'1H',kind:'catalog',ico:'chart',
 goal:'Показать все возможные виджеты рабочего пространства: график, аналитику, стратегию, торговлю и работу бота.'};

/* ---------- данные каталога (детерминированные) ---------- */
const WG_SYMS=['BTC/USD','ETH/USD','EUR/USD','XAU/USD'];
const wgPrice=(sym)=>instruments[sym].base;
const wgFmt=(v,sym)=>fmt(v,sym);
const wgPct=v=>(v>=0?'+':'−')+Math.abs(v).toFixed(2)+'%';
const wgMoney=v=>(v>=0?'+':'−')+'$'+Math.round(Math.abs(v)).toLocaleString('ru-RU');
function wgRnd(key){return seedOf('wg'+key)}

// Ряд свечей текущего графика — из него берём цены для связанных сущностей.
function wgSeries(a){const c=focusCh(a);return c?{c,d:series(c)}:null}

/* Связь с графиком: тап по сущности переключает график на её инструмент,
   уводит окно к её времени, ставит уровень и подсвечивает саму точку.
   Правило каталога — если сущность можно показать на графике, связь обязана существовать. */
function wgFocus(sym,price,label,t){
 const a=current(),c=a&&focusCh(a);if(!c)return;
 if(sym&&instruments[sym]&&sym!==c.sym){c.sym=sym;c.levels=[];c.lines=[];c.markers=null;c.focusAt=null;chartView.delete(c.id)}
 c.levels=(c.levels||[]).filter(l=>l.role!=='focus');
 c.levels.push({role:'focus',price:+price,tx:label});
 let i=-1;
 if(t){const d=series(c);let best=Infinity;d.forEach((x,n)=>{const dd=Math.abs(x.t-t);if(dd<best){best=dd;i=n}})}
 c.focusAt={i,price:+price,tx:label};
 if(i>=0){const span=64;chartView.set(c.id,{sym:c.sym,tf:c.tf,i0:Math.max(0,i-span*0.6),i1:Math.min(BARS_TOTAL-1,Math.max(span,i+span*0.4))})}
 render();
 const el=document.getElementById('chartplot');
 if(el){el.scrollIntoView({block:'center',behavior:'smooth'});el.classList.add('wgflash');setTimeout(()=>el.classList.remove('wgflash'),900)}
}
const wgTap=(sym,price,label,t)=>'onclick="wgFocus(\''+sym+'\','+(+price).toFixed(4)+',\''+String(label).replace(/'/g,'')+'\','+(t||0)+')"';

/* ---------- каркас ---------- */
function wgSection(title,note,body){
 return '<h3 class="wgsec">'+esc(title)+(note?'<small>'+esc(note)+'</small>':'')+'</h3>'+body
}
function wgCard(title,tag,body,cls){
 return '<section class="wg '+(cls||'')+'">'
 +(title?'<div class="wghead"><b>'+esc(title)+'</b>'+(tag?'<span class="tag">'+esc(tag)+'</span>':'')+'</div>':'')
 +body+'</section>'
}

/* ============================================================
   MARKET / ANALYSIS
   ============================================================ */

// 1. Chart — главная рабочая поверхность, самый крупный элемент.
// Отдельной карточки не получает: это и есть холст.

// 2. Market Snapshot — не карточка, а тикерная строка рядом с графиком.
function wgSnapshot(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1],day=d.slice(-24);
 const open=day[0].o,ch=(last.c-open)/open*100;
 const hi=Math.max(...day.map(x=>x.h)),lo=Math.min(...day.map(x=>x.l));
 const r=wgRnd('snap'+c.sym),vol=(0.8+r()*1.9).toFixed(2),spread=(1+r()*4).toFixed(1);
 return '<div class="ticker"><div class="t1"><b class="sym">'+esc(c.sym)+'</b>'
 +'<b class="px">'+wgFmt(last.c,c.sym)+'</b>'
 +'<span class="'+(ch>=0?'up':'down')+'">'+wgPct(ch)+'</span></div>'
 +'<div class="t2"><span>H '+wgFmt(hi,c.sym)+'</span><span>L '+wgFmt(lo,c.sym)+'</span>'
 +'<span>Spread '+spread+'</span><span class="opt">Vol '+vol+'M</span></div></div>'
}

// 3. Watchlist — компактная таблица с мини-графиком.
function wgSpark(sym){
 const d=series({sym,tf:'1H'}).slice(-40),lo=Math.min(...d.map(x=>x.l)),hi=Math.max(...d.map(x=>x.h));
 const pts=d.map((x,i)=>(i/(d.length-1)*60).toFixed(1)+' '+(18-(x.c-lo)/((hi-lo)||1)*16).toFixed(1));
 const up=d[d.length-1].c>=d[0].c;
 return '<svg class="spark" viewBox="0 0 60 20" aria-hidden="true"><path d="M'+pts.join('L')+'" fill="none" stroke="var(--'+(up?'up':'down')+')" stroke-width="1.4"/></svg>'
}
function wgWatchlist(a){
 return wgCard('Watchlist','инструменты',
  '<div class="wgrows">'+WG_SYMS.map(sym=>{
   // изменение считаем по тому же ряду, что и мини-график, иначе знак разойдётся с линией
   const d=series({sym,tf:'1H'}).slice(-40),p=d[d.length-1].c,ch=(p-d[0].c)/d[0].c*100;
   return '<button class="wgrow" onclick="wgOpenSym(\''+sym+'\')">'
   +'<span class="c1">'+esc(sym)+'</span>'+wgSpark(sym)
   +'<span class="c2">'+esc(wgFmt(p,sym))+'</span>'
   +'<span class="c3 '+(ch>=0?'up':'down')+'">'+wgPct(ch)+'</span></button>'
  }).join('')+'</div>')
}
function wgOpenSym(sym){
 const a=current(),c=a&&focusCh(a);if(!c)return;
 if(c.sym!==sym){c.sym=sym;c.levels=[];c.lines=[];chartView.delete(c.id)}
 render();document.getElementById('chartplot')?.scrollIntoView({block:'center',behavior:'smooth'})
}

// 4. Scanner — ранжированный список находок бота.
const WG_SCAN=[['BTC/USD','Breakout','Volume +38%'],['ETH/USD','Range squeeze','ATR −22%'],['XAU/USD','Trend pullback','EMA 50 retest'],['EUR/USD','Failed breakdown','Wick 62%']];
function wgScanner(){
 return wgCard('Scanner','4 из 128 инструментов',
  '<div class="wgrows">'+WG_SCAN.map(([sym,why,metric],i)=>
   '<button class="wgrow rank" onclick="wgOpenSym(\''+sym+'\')"><span class="num">'+(i+1)+'</span>'
   +'<span class="grow"><b>'+esc(sym)+'</b><small>'+esc(why)+'</small></span>'
   +'<span class="metric">'+esc(metric)+'</span></button>').join('')+'</div>')
}

// 5. Signals / Setups — что, где, когда и на каком уровне.
function wgSignals(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1].c;
 const eth=series({sym:'ETH/USD',tf:c.tf});
 const rows=[{sym:c.sym,dir:'LONG',what:'Пробой',lvl:last*1.012,st:'Ждёт подтверждения',ago:'4 мин назад',t:d[d.length-1].t},
             {sym:c.sym,dir:'SHORT',what:'Продолжение тренда',lvl:last*0.984,st:'Активен',ago:'22 мин назад',t:d[d.length-3].t},
             {sym:'ETH/USD',dir:'LONG',what:'Низ диапазона',lvl:eth[eth.length-8].l,st:'Отменён',ago:'1 ч назад',t:eth[eth.length-8].t}];
 return wgCard('Signals','3 ситуации',
  '<div class="wgrows">'+rows.map(r=>
   '<button class="sigrow" '+wgTap(r.sym,r.lvl,r.what,r.t)+'>'
   +'<span class="dir '+(r.dir==='LONG'?'long':'short')+'">'+r.dir+'</span>'
   +'<span class="grow"><b>'+esc(r.sym)+'</b>'
   +'<span class="line">'+esc(r.what)+' на '+esc(wgFmt(r.lvl,r.sym))+'</span>'
   +'<small><span class="'+(r.st==='Активен'?'on':r.st==='Отменён'?'off':'')+'">'+esc(r.st)+'</span> · '+esc(r.ago)+'</small></span>'
   +icon('chevron')+'</button>').join('')+'</div>')
}

// 6. AI Analysis — два-четыре тезиса, уровни внутри текста кликабельны.
function wgAI(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1].c,pd=prevDayLevels(c);
 const lvl=(p,txt)=>'<button class="inl" '+wgTap(c.sym,p,txt)+'>'+esc(wgFmt(p,c.sym))+'</button>';
 return wgCard('AI analysis','вывод бота',
  '<ul class="wgtez">'
  +'<li>Тренд вниз шестую сессию, откаты короче предыдущих.</li>'
  +'<li>Продавцы держат цену под вчерашним максимумом '+lvl(pd.high,'Вчера, максимум')+'.</li>'
  +'<li>Ближайшая цель — вчерашний минимум '+lvl(pd.low,'Вчера, минимум')+', за ним пусто.</li>'
  +'<li>Разворот подтвердит только закрытие выше '+lvl(last*1.02,'Уровень разворота')+'.</li>'
  +'</ul>','wgai')
}

// 7. News — источник и время как основное вторичное поле.
const WG_SRC=['Reuters','Bloomberg','CoinDesk','WSJ'];
function wgNews(a){
 const c=focusCh(a);if(!c)return '';
 return wgCard('News · '+c.sym,'лента',
  '<div class="wgrows">'+newsOf(c.sym).slice(0,4).map((n,i)=>
   '<div class="newsrow2"><span class="grow"><b>'+esc(n.title)+'</b>'
   +'<small>'+esc(WG_SRC[i%WG_SRC.length])+' · '+esc(agoText(n.mins))+'</small></span>'
   +(n.impact==='высокое'?'<span class="imp">влияние высокое</span>':'')+'</div>').join('')+'</div>')
}

// 8. Economic Calendar — вертикальные строки, а не пять равных колонок.
const WG_CAL=[['15:30','Инфляция в США','hi','3.1','3.0','3.2'],
 ['21:00','Решение ФРС по ставке','hi','5.25','5.25',''],
 ['11:00','PMI еврозоны','mid','48.6','49.0',''],
 ['15:30','Заявки на пособия','low','221k','218k','']];
function wgCalendar(){
 return wgCard('Economic calendar','ближайшие события',
  '<div class="wgrows">'+WG_CAL.map(([t,ev,imp,prev,fc,act])=>
   '<div class="calrow"><span class="time">'+esc(t)+'</span>'
   +'<span class="grow"><b>'+esc(ev)+'</b>'
   +'<small>Пред. '+esc(prev)+' · Прогноз '+esc(fc)+(act?' · <b class="fact">Факт '+esc(act)+'</b>':'')+'</small></span>'
   +'<span class="impflag '+imp+'">'+(imp==='hi'?'HIGH':imp==='mid'?'MED':'LOW')+'</span></div>').join('')+'</div>')
}

// 9. Alerts / Conditions — правила слежения и их статус.
function wgAlerts(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1].c;
 const rows=[[c.sym+' > '+wgFmt(last*1.03,c.sym),'Ждёт',true,last*1.03],
             ['RSI < 30','Сработал',true,0],
             ['Объём > 2× среднего','Выключен',false,0]];
 return wgCard('Alerts','условия слежения',
  '<div class="wgrows">'+rows.map(([cond,st,on,price])=>
   '<div class="wgrow alert"'+(price?' '+wgTap(c.sym,price,'Условие'):'')+'>'
   +'<span class="grow">'+esc(cond)+'</span>'
   +'<span class="st '+(st==='Сработал'?'on':st==='Выключен'?'off':'')+'">'+esc(st)+'</span>'
   +'<span class="sw'+(on?' on':'')+'"></span></div>').join('')+'</div>')
}

/* ============================================================
   STRATEGY / BACKTESTING
   ============================================================ */

// 10. Strategy / Rules — имя, версия и статус в шапке, правила раскрываются.
let wgStratOpen=false;
function wgToggleStrat(){wgStratOpen=!wgStratOpen;render()}
function wgStrategy(a){
 const c=focusCh(a);if(!c)return '';
 const main=[['Entry','Пробой вчерашнего максимума с подтверждением по объёму'],
             ['Exit','Закрытие ниже EMA 20 или цель 2R'],
             ['Stop','1.5%'],['Risk','1%']];
 const more=[['Timeframe',c.tf],['Instrument',c.sym],['Сессия','Только 08:00–20:00'],['Макс. сделок в день','3']];
 const rows=r=>r.map(([k,v])=>'<div class="def"><span>'+esc(k)+'</span><b>'+esc(v)+'</b></div>').join('');
 return '<section class="wg wgstrat"><div class="wghead">'
 +'<b>Breakout Strategy</b><span class="ver">v4</span><span class="badge tested">TESTED</span></div>'
 +'<div class="wgdefs">'+rows(main)+(wgStratOpen?rows(more):'')+'</div>'
 +'<button class="wgmore" onclick="wgToggleStrat()">'+(wgStratOpen?'Свернуть правила':'Все правила')+icon('chevron')+'</button></section>'
}

// 11. Algorithm / Code — карточка файла, код открывается отдельно.
function wgAlgo(){
 return wgCard('Algorithm','файл бота',
  '<button class="wgfile" onclick="wgCodeSheet()">'+icon('code')
  +'<span class="grow"><b>breakout_v3.cs</b><small>C# · версия 3 · изменён 2 часа назад</small></span>'
  +'<span class="st on">Готов</span>'+icon('chevron')+'</button>')
}
function wgCodeSheet(){
 openSheet('breakout_v3.cs',
  '<pre class="wgcode">protected override void OnBar()\n{\n    if (Bars.ClosePrices.Last(1) > PrevDayHigh\n        &amp;&amp; Volume.Last(1) > VolumeAvg * 1.2)\n    {\n        OpenPosition(TradeType.Buy, Symbol.Name, Lots);\n    }\n}</pre>'
  +'<div class="notice formgap">Код показан целиком только здесь: в рабочем пространстве живёт карточка файла.</div>')
}

// 12. Backtest Summary — Return и просадка заметнее остальных.
function wgBacktest(a){
 const c=focusCh(a);if(!c)return '';
 const b=backtestOf(c.sym,c.tf,'catalog');
 const up=!b.ret.startsWith('−');
 return wgCard('Backtest summary',c.sym+' · '+c.tf,
  '<div class="kpimain">'
  +'<div><small>Return</small><b class="'+(up?'up':'down')+'">'+esc(b.ret)+'</b></div>'
  +'<div><small>Max drawdown</small><b class="down">'+esc(b.dd)+'</b></div>'
  +'</div>'
  +'<div class="kpisub">'
  +[['PF',b.pf],['Win rate',b.win],['Trades',b.trades],['Sharpe',b.sharpe]]
   .map(([k,v])=>'<span><small>'+esc(k)+'</small><b>'+esc(v)+'</b></span>').join('')
  +'</div>','wgkpicard')
}

// 13. Equity Curve — широкий линейный график.
function wgEquity(a){
 const c=focusCh(a);if(!c)return '';
 const b=backtestOf(c.sym,c.tf,'catalog');
 return wgCard('Equity curve','% к депозиту','<div class="wgplot">'+equitySVG(b)+'</div>','wgwide')
}

// 14. Backtest Trades — дата и время, цены входа и выхода, плотные строки.
function wgBtTrades(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s;
 const r=wgRnd('bt'+c.sym),rows=Array.from({length:5},(_,i)=>{
  const i0=d.length-60+i*9,i1=i0+4,side=r()<.5?'LONG':'SHORT';
  const e=d[i0].c,x=d[i1].c,pl=(side==='LONG'?x-e:e-x)/e*100;
  return {t0:d[i0].t,t1:d[i1].t,side,e,x,pl}
 });
 const when=t=>dayLbl(t)+' '+timeLbl(t);
 return wgCard('Backtest trades','5 из 31',
  '<div class="wgrows">'+rows.map(t=>'<button class="traderow" '+wgTap(c.sym,t.e,'Вход '+t.side,t.t0)+'>'
   +'<span class="dir '+(t.side==='LONG'?'long':'short')+'">'+t.side+'</span>'
   +'<span class="grow"><b>'+esc(wgFmt(t.e,c.sym))+' → '+esc(wgFmt(t.x,c.sym))+'</b>'
   +'<small>'+esc(when(t.t0))+' → '+esc(when(t.t1))+'</small></span>'
   +'<span class="plv '+(t.pl>=0?'up':'down')+'">'+wgPct(t.pl)+'</span></button>').join('')+'</div>')
}

// 15. Backtest Comparison — только то, что изменилось.
function wgDiff(){
 return wgCard('Backtest comparison','прогон 3 → 4',
  '<div class="wgdiff">'
  +[['Stop','1.5%','2%',false],['Return','+12%','+18%',true],['Max drawdown','−9%','−11%',false],['Trades','31','27',null]]
   .map(([k,a0,b0,good])=>'<div class="dif"><span class="k">'+esc(k)+'</span>'
    +'<span class="was">'+esc(a0)+'</span>'+icon('arrow')
    +'<span class="now '+(good===true?'up':good===false?'down':'')+'">'+esc(b0)+'</span></div>').join('')
  +'</div>','wgdiffcard')
}

// 16. Optimization — лучшие конфигурации, а не вся матрица.
function wgOptim(){
 const r=wgRnd('opt');
 const rows=Array.from({length:5},(_,i)=>({p:'stop '+(1+i*.25).toFixed(2)+'% · target '+(2+i*.5).toFixed(1)+'R',
  ret:'+'+(22-i*3.1).toFixed(1)+'%',dd:'−'+(8+i*1.4).toFixed(1)+'%',pf:(1.9-i*.12).toFixed(2)}));
 return wgCard('Optimization','топ-5 из 240 комбинаций',
  '<div class="wgtable"><div class="th"><span class="grow">Параметры</span><span>Return</span><span>DD</span><span>PF</span></div>'
  +rows.map((x,i)=>'<div class="tr"><span class="grow"><span class="num">'+(i+1)+'</span>'+esc(x.p)+'</span>'
   +'<span class="up">'+esc(x.ret)+'</span><span class="down">'+esc(x.dd)+'</span><span>'+esc(x.pf)+'</span></div>').join('')
  +'</div>')
}

/* ============================================================
   AI TRADING / LIVE TRADING
   ============================================================ */

// 17. Trading / Strategy Status — заметная карточка состояния.
function wgStatus(a){
 const c=focusCh(a);if(!c)return '';
 return '<section class="wg wgstatus"><div class="row"><span class="live">PAPER</span>'
 +'<div class="grow"><b>breakout_v3</b><small>'+esc(c.sym+' · '+c.tf)+' · счёт Demo 4821</small></div>'
 +'<button class="tagbtn">Остановить</button></div>'
 +'<div class="wgstatgrid">'
 +[['Версия','v3 · активна'],['Последнее решение','12:15 — вход LONG'],['Работает','4 ч 12 мин']]
  .map(([k,v])=>'<div><small>'+esc(k)+'</small><b>'+esc(v)+'</b></div>').join('')
 +'</div></section>'
}

// 18. Trade Plan — маленькая лестница цен: видно взаимное положение уровней.
function wgPlan(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1].c;
 const entry=last*1.004,stop=last*0.988,target=last*1.028;
 const rr=((target-entry)/(entry-stop)).toFixed(1);
 const step=(cls,label,price,right)=>'<button class="ladstep '+cls+'" '+wgTap(c.sym,price,label)+'>'
  +'<span class="lab">'+label+'</span><b>'+wgFmt(price,c.sym)+'</b><span class="rt">'+right+'</span></button>';
 return wgCard('Trade plan','до исполнения',
  '<div class="ladder">'
  +step('target','TARGET',target,'<span class="up">+2.8%</span>')
  +'<span class="rung"></span>'
  +step('entry','ENTRY',entry,'LONG')
  +'<span class="rung"></span>'
  +step('stop','STOP',stop,'<span class="down">−1.2%</span>')
  +'</div>'
  +'<div class="planfoot"><span>Риск 1% · $120</span><span>Объём 0.18 лота</span><span>R:R 1:'+rr+'</span></div>')
}

// 19. Open Positions — каждая позиция самодостаточна: свои SL и TP в своей строке.
function wgPositions(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1].c;
 const eth=instruments['ETH/USD'].base;
 const ethD=series({sym:'ETH/USD',tf:c.tf});
 const rows=[{sym:c.sym,side:'LONG',size:'0.18',e:last*0.982,sl:last*0.965,tp:last*1.03,cur:last,t:d[d.length-14].t},
             {sym:'ETH/USD',side:'SHORT',size:'1.40',e:eth*1.012,sl:eth*1.03,tp:eth*0.96,cur:eth,t:ethD[ethD.length-22].t}];
 return wgCard('Open positions','2 позиции',
  '<div class="wgrows">'+rows.map(p=>{
   const pl=(p.side==='LONG'?p.cur-p.e:p.e-p.cur)/p.e*100,money=pl/100*1200;
   return '<button class="posrow" '+wgTap(p.sym,p.e,p.side+' вход',p.t)+'>'
   +'<span class="grow"><span class="l1"><b>'+esc(p.sym)+'</b>'
   +'<span class="dir '+(p.side==='LONG'?'long':'short')+'">'+p.side+'</span>'
   +'<span class="sz">'+esc(p.size)+'</span></span>'
   +'<small>Вход '+esc(wgFmt(p.e,p.sym))+'</small>'
   +'<small class="lvls">SL '+esc(wgFmt(p.sl,p.sym))+' · TP '+esc(wgFmt(p.tp,p.sym))+'</small></span>'
   +'<span class="plbox '+(pl>=0?'up':'down')+'"><b>'+wgMoney(money)+'</b><small>'+wgPct(pl)+'</small></span></button>'
  }).join('')+'</div>')
}

// 20. Pending Orders — плотные строки, как у позиций, но пунктиром: это ещё не позиция.
function wgOrders(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1].c,xau=instruments['XAU/USD'].base;
 const rows=[{sym:c.sym,type:'BUY LIMIT',side:'BUY',price:last*0.97,size:'0.20',st:'Ждёт'},
             {sym:c.sym,type:'SELL STOP',side:'SELL',price:last*0.955,size:'0.20',st:'Ждёт'},
             {sym:'XAU/USD',type:'BUY LIMIT',side:'BUY',price:xau*0.99,size:'0.50',st:'Исполнена частично'}];
 return wgCard('Pending orders','3 заявки',
  '<div class="wgrows">'+rows.map(o=>'<button class="ordrow" '+wgTap(o.sym,o.price,o.type)+'>'
   +'<span class="grow"><span class="l1"><b>'+esc(o.sym)+'</b>'
   +'<span class="otype '+(o.side==='BUY'?'long':'short')+'">'+esc(o.type)+'</span></span>'
   +'<small>'+esc(wgFmt(o.price,o.sym))+' · '+esc(o.size)+'</small>'
   +'<small class="ost">'+esc(o.st)+'</small></span>'+icon('chevron')+'</button>').join('')+'</div>')
}

// 21. Account — маленькая сводка, но всегда понятно, чей это счёт.
function wgAccount(){
 return '<section class="wg wgaccount"><div class="acchead">'+icon('wallet')+'<b>cTrader · Demo 4821</b></div>'
 +'<div class="wgacc">'
 +[['Balance','$12 480'],['Equity','$12 612'],['Free margin','$11 940'],['Day P/L','+$132']]
  .map(([k,v],i)=>'<div class="accell"><b class="'+(i===3?'up':'')+'">'+esc(v)+'</b><small>'+esc(k)+'</small></div>').join('')
 +'</div></section>'
}

// 22. Risk / Exposure — текущее значение против лимита.
function wgRisk(){
 const lim=(label,val,limit,pct)=>'<div class="riskrow"><div class="row between"><small>'+esc(label)+'</small>'
  +'<b>'+esc(val)+' <span class="lim">/ '+esc(limit)+'</span></b></div>'
  +'<div class="bar"><i style="width:'+pct+'%"></i></div></div>';
 return wgCard('Risk / exposure','сейчас',
  lim('Open risk','1.8%','3.0% лимит',60)
  +lim('Daily loss','2.4%','5.0% лимит',48)
  +lim('Margin used','34%','100%',34)
  +'<div class="wgexp"><div class="exp long" style="flex:68"><span>Long 68%</span></div><div class="exp short" style="flex:32"><span>Short 32%</span></div></div>')
}

// 23. Decision Log — решения и их причины, а не технический журнал.
function wgDecisions(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1].c;
 const rows=[['13:20','Вышел из позиции','Сработало правило выхода: закрытие ниже EMA 20',last*0.994,d[d.length-2].t],
             ['12:15','Вошёл LONG','Пробой уровня с подтверждением по объёму',last*0.982,d[d.length-6].t],
             ['11:42','Пропустил вход','Свеча не закрылась выше сопротивления',last*1.006,d[d.length-9].t]];
 return wgCard('Decision log','решения бота',
  '<div class="wgtl">'+rows.map(([t,dec,why,price,tt])=>
   '<button class="tlrow" '+wgTap(c.sym,price,dec,tt)+'><span class="dot"></span>'
   +'<span class="time">'+esc(t)+'</span>'
   +'<span class="grow"><b>'+esc(dec)+'</b><small>'+esc(why)+'</small></span>'+icon('chevron')+'</button>').join('')+'</div>')
}

// 24. Recent Trades — плотная строка, результат справа.
function wgRecent(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,r=wgRnd('rt'+c.sym);
 const rows=Array.from({length:5},(_,i)=>{
  const idx=d.length-1-i*7,side=(r()*10+i)%2<1?'LONG':'SHORT',pl=(r()-.42)*2.8;
  return {sym:c.sym,side,pl,t:d[idx].t,price:d[idx].c}
 });
 return wgCard('Recent trades','последние 5',
  '<div class="wgrows">'+rows.map(t=>'<button class="rtrow" '+wgTap(t.sym,t.price,'Сделка '+t.side,t.t)+'>'
   +'<span class="grow"><span class="l1"><b>'+esc(t.sym)+'</b>'
   +'<span class="dir '+(t.side==='LONG'?'long':'short')+'">'+t.side+'</span></span>'
   +'<small>'+esc(dayLbl(t.t)+' · '+timeLbl(t.t))+'</small></span>'
   +'<span class="plv '+(t.pl>=0?'up':'down')+'">'+wgPct(t.pl)+'</span></button>').join('')+'</div>')
}

// 25. Trading Performance — период сверху, P/L и просадка главные.
let wgPeriod='30D';
function wgSetPeriod(p){wgPeriod=p;render()}
function wgPerf(a){
 const c=focusCh(a);if(!c)return '';
 const b=backtestOf(c.sym,c.tf,'live'+wgPeriod);
 const pl=['7D','30D','3M','ALL'].indexOf(wgPeriod);
 const money=['+$214','+$842','+$2 460','+$5 190'][pl];
 return '<section class="wg wgwide"><div class="wghead"><b>Trading performance</b>'
 +'<span class="seg">'+['7D','30D','3M','ALL'].map(p=>'<button class="'+(p===wgPeriod?'on':'')+'" onclick="wgSetPeriod(\''+p+'\')">'+p+'</button>').join('')+'</span></div>'
 +'<div class="kpimain"><div><small>P/L</small><b class="up">'+money+'</b></div>'
 +'<div><small>Drawdown</small><b class="down">'+esc(b.dd)+'</b></div></div>'
 +'<div class="kpisub">'
 +[['Trades',b.trades],['Win rate',b.win],['Profit factor',b.pf]]
  .map(([k,v])=>'<span><small>'+esc(k)+'</small><b>'+esc(v)+'</b></span>').join('')
 +'</div><div class="wgplot">'+equitySVG(b)+'</div>'
 +'<button class="wgmore">Подробная статистика'+icon('chevron')+'</button></section>'
}

/* ============================================================
   BOT / AUTOMATION
   ============================================================ */

// 26. Active Tasks — процент только там, где он существует.
function wgTasks(){
 const det=[['Оптимизация параметров','Перебрано 96 из 240 комбинаций',40]];
 const ind=[['Проверка идеи на истории','Считаю сделки…'],['Сбор новостей по BTC','Читаю источники…']];
 return wgCard('Active tasks','в работе',
  ind.map(([t,step])=>'<div class="taskrow ind"><span class="spin"></span>'
   +'<span class="grow"><b>'+esc(t)+'</b><small>'+esc(step)+'</small></span></div>').join('')
  +det.map(([t,step,p])=>'<div class="taskrow"><span class="grow"><b>'+esc(t)+'</b><small>'+esc(step)+'</small></span>'
   +'<b class="working">'+p+'%</b><div class="bar"><i style="width:'+p+'%"></i></div></div>').join(''))
}

// 27. Scheduled Tasks — регулярные поручения.
function wgSchedule(){
 const rows=[['Проверить уровни BTC','Каждый день · 09:00',true],['Сводка по портфелю','Пн–Пт · 18:30',true],['Переобучить модель','Каждое воскресенье',false]];
 return wgCard('Scheduled tasks','расписание',
  '<div class="wgrows">'+rows.map(([t,when,on])=>
   '<div class="wgrow"><span class="grow"><b>'+esc(t)+'</b><small>'+esc(when)+'</small></span>'
   +'<span class="sw'+(on?' on':'')+'"></span></div>').join('')+'</div>')
}

// 28. Recent Results — лента готовых результатов.
function wgResults(){
 const rows=[['chart','Уровни BTC/USD','Отмечены максимум и минимум суток','14:02'],
             ['doc','Отчёт проверки','Return +18%, DD −11%','12:40'],
             ['code','breakout_v3.cs','Версия 3 собрана','11:05']];
 return wgCard('Recent results','готово',
  '<div class="wgrows">'+rows.map(([ic,name,sum,t])=>
   '<button class="wgrow res"><span class="ricon">'+icon(ic)+'</span>'
   +'<span class="grow"><b>'+esc(name)+'</b><small>'+esc(sum)+'</small></span>'
   +'<span class="time">'+esc(t)+'</span></button>').join('')+'</div>')
}

// 29. Errors / Attention — только то, где нужен человек.
function wgAttention(){
 return '<section class="wg wgalert"><div class="row"><span class="alerticon">'+icon('bell')+'</span>'
 +'<div class="grow"><b>Бот не может исполнять сделки</b>'
 +'<small>Причина: срок действия ключа брокера истёк 24 сентября.</small>'
 +'<small>Нужно: обновить ключ в настройках счёта.</small></div></div>'
 +'<button class="promobtn">Обновить ключ</button></section>'
}

// 30. Connection / Data Status — не виджет, а тонкая полоска. Ломается — становится видной.
function wgConnection(){
 // Базовый вид — всё в норме. Поломку показывает соседний виджет Attention,
 // дублировать одну и ту же проблему двумя компонентами незачем.
 return '<div class="wgconn"><span class="ok">Market data</span><span class="ok">Broker</span><span class="ok">Execution</span></div>'
}

/* ============================================================
   SCALPING (рассматривается отдельно)
   ============================================================ */

// 31. DOM / Order Book — спред, глубина и ликвидность живут в его шапке.
function wgDom(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1].c,st=instruments[c.sym].step*0.08;
 const r=wgRnd('dom'+c.sym);
 const row=(p,v,side)=>'<div class="domrow '+side+'"><span class="vol"><i style="width:'+Math.round(v)+'%"></i></span>'
  +'<span class="p">'+esc(wgFmt(p,c.sym))+'</span><span class="sz">'+(v/4).toFixed(2)+'</span></div>';
 let s2='';
 for(let i=5;i>0;i--)s2+=row(last+st*i,20+r()*80,'ask');
 s2+='<div class="domspread">спред '+(st*2).toFixed(instruments[c.sym].digits)+'</div>';
 for(let i=1;i<=5;i++)s2+=row(last-st*i,20+r()*80,'bid');
 return '<section class="wg wgdom"><div class="wghead"><b>DOM / order book</b><span class="tag">глубина рынка</span></div>'
 +'<div class="domhead"><span>Spread <b>'+(1+r()*3).toFixed(1)+' пт</b></span>'
 +'<span>Depth <b>$1.8M</b></span><span>Ликвидность <b class="down">−12% за час</b></span></div>'
 +'<div class="dom">'+s2+'</div></section>'
}

// 32. Time & Sales — лента сделок.
function wgTape(a){
 const s=wgSeries(a);if(!s)return '';
 const {c,d}=s,last=d[d.length-1].c,r=wgRnd('tape'+c.sym),st=instruments[c.sym].step*0.05;
 const rows=Array.from({length:7},(_,i)=>{
  const buy=r()<.5;return {t:new Date(Date.now()-i*4000),p:last+(r()-.5)*st*4,sz:(r()*2.4+.05).toFixed(2),buy}
 });
 return wgCard('Time & sales','лента сделок',
  '<div class="wgtable tape">'+rows.map(x=>'<div class="tr">'
   +'<span class="time">'+x.t.toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit',second:'2-digit'})+'</span>'
   +'<span class="'+(x.buy?'up':'down')+'">'+esc(wgFmt(x.p,c.sym))+'</span>'
   +'<span>'+x.sz+'</span>'
   +'<span class="dir '+(x.buy?'long':'short')+'">'+(x.buy?'BUY':'SELL')+'</span></div>').join('')+'</div>')
}

/* ============================================================
   Сборка рабочего пространства каталога
   ============================================================ */
function catalogHTML(a){
 return '<div class="wgintro"><b>Каталог виджетов Workspace</b>'
 +'<small>Все типы содержимого, какие могут жить в рабочем пространстве. Разная информация — разная визуальная масса. Всё, что можно показать на графике, по тапу ведёт на график.</small></div>'
 + wgConnection()
 + wgAttention()
 + chartHTML(a)
 + wgSection('Market / analysis','снимок рынка, списки и аналитика',
    wgSnapshot(a)+wgWatchlist(a)+wgScanner()+wgSignals(a)+wgAI(a)+wgNews(a)+wgCalendar()+wgAlerts(a))
 + wgSection('Strategy / backtesting','правила, алгоритм и результаты прогонов',
    wgStrategy(a)+wgAlgo()+wgBacktest(a)+wgEquity(a)+wgBtTrades(a)+wgDiff()+wgOptim())
 + wgSection('Live trading','состояние, план, позиции, риск и решения',
    wgStatus(a)+wgPlan(a)+wgPositions(a)+wgOrders(a)
    +'<div class="wgpair">'+wgAccount()+wgRisk()+'</div>'
    +wgDecisions(a)+wgRecent(a)+wgPerf(a))
 + wgSection('Bot / automation','что бот делает и что уже сделал',
    wgTasks()+wgSchedule()+wgResults())
 + wgSection('Scalping','рассматривается отдельно: нужны потоковые данные',
    wgDom(a)+wgTape(a))
}

/* ---------- сам бот ---------- */
state.agents.push({
 id:'catalog',role:'catalog',name:'Каталог виджетов',goal:roles.catalog.goal,
 charts:[{id:'cw1',sym:'BTC/USD',tf:'1H',drawing:null,shift:0,ind:[],levels:[],lines:[]}],
 focus:0,risk:1,paused:false,notes:[],tasks:[],account:null,bannerOff:true,
 messages:[{role:'assistant',ts:ago(30),text:'Здесь собраны все виджеты, какие могут жить в рабочем пространстве. Тапните по сигналу, сделке или решению — покажу это место на графике.'}]
});
render();
