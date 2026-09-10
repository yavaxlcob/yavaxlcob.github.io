'use strict';
(() => {
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const root = document.documentElement;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let reduced = media.matches;
  let scrollDirty = true;
  let animationId = 0;
  let lastFrame = 0;
  const motionButton = $('.motion-toggle');

  // Keep menus operable with touch and the keyboard; never hide content without JS.
  const menu = $('.menu-toggle');
  const nav = $('.main-nav');
  function closeMenu(returnFocus=false) {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Открыть меню');
    if(returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open=menu.getAttribute('aria-expanded')!=='true';
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    nav.classList.toggle('is-open',open);
  });
  $$('a',nav).forEach(a=>a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')) closeMenu(true);});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});

  // On phones, lead with Telegram itself. The normal HTTPS href remains the
  // reliable fallback for devices without the app and for every desktop click.
  const telegramLinks=$$('a[href="https://t.me/yavaxlcob"]');
  const isPhone=()=>/Android|iPhone|iPod/i.test(navigator.userAgent);
  telegramLinks.forEach(link=>link.addEventListener('click',()=>{
    if(typeof window.ym==='function')window.ym(112471789,'reachGoal','telegram_click');
    if(typeof window.gtag==='function')window.gtag('event','telegram_click',{
      link_url:'https://t.me/yavaxlcob',
      link_domain:'t.me',
      outbound:true
    });
  }));
  telegramLinks.forEach(link=>link.addEventListener('click',event=>{
    if(!isPhone()||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    const fallback=link.href;
    const cancelFallback=()=>clearTimeout(fallbackTimer);
    let fallbackTimer;
    addEventListener('pagehide',cancelFallback,{once:true});
    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState==='hidden')cancelFallback();
    },{once:true});
    if(/Android/i.test(navigator.userAgent)){
      location.href='intent://resolve?domain=yavaxlcob#Intent;scheme=tg;package=org.telegram.messenger;S.browser_fallback_url='+encodeURIComponent(fallback)+';end';
      return;
    }
    location.href='tg://resolve?domain=yavaxlcob';
    fallbackTimer=setTimeout(()=>{
      if(document.visibilityState==='visible')location.href=fallback;
    },900);
  }));

  // Native disclosures remain usable without JavaScript; with it, keep long FAQ reading focused.
  const faqDetails=$$('.faq-list details');
  faqDetails.forEach(detail=>{
    const summary=$('summary',detail);
    summary.setAttribute('aria-expanded',String(detail.open));
    detail.addEventListener('toggle',()=>{
      summary.setAttribute('aria-expanded',String(detail.open));
      if(detail.open)faqDetails.forEach(other=>{if(other!==detail)other.open=false;});
    });
  });

  const boatTilt=$('[data-boat-tilt]');
  if(boatTilt){
    let dragStart=null, boatYaw=0, boatPitch=0;
    const updateBoat=()=>{
      boatTilt.style.setProperty('--boat-yaw',boatYaw.toFixed(2)+'deg');
      boatTilt.style.setProperty('--boat-pitch',boatPitch.toFixed(2)+'deg');
      boatTilt.style.setProperty('--boat-x',(boatYaw*.7).toFixed(1)+'px');
      boatTilt.style.setProperty('--boat-y',(boatPitch*.32).toFixed(1)+'px');
    };
    const settleBoat=()=>{boatYaw*=.45;boatPitch*=.45;updateBoat();};
    boatTilt.addEventListener('pointerdown',e=>{
      if(reduced)return;
      dragStart={x:e.clientX,y:e.clientY,yaw:boatYaw,pitch:boatPitch};
      boatTilt.classList.add('is-dragging');boatTilt.setPointerCapture?.(e.pointerId);
    });
    boatTilt.addEventListener('pointermove',e=>{
      if(!dragStart)return;
      const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;
      if(Math.abs(dx)>4)e.preventDefault();
      boatYaw=Math.max(-12,Math.min(12,dragStart.yaw+dx*.085));
      boatPitch=Math.max(-4,Math.min(4,dragStart.pitch-dy*.035));updateBoat();
    });
    ['pointerup','pointercancel','lostpointercapture'].forEach(name=>boatTilt.addEventListener(name,()=>{
      if(!dragStart)return;dragStart=null;boatTilt.classList.remove('is-dragging');settleBoat();
    }));
    boatTilt.addEventListener('keydown',e=>{
      const move={ArrowLeft:[-4,0],ArrowRight:[4,0],ArrowUp:[0,1.5],ArrowDown:[0,-1.5]}[e.key];
      if(!move)return;e.preventDefault();boatYaw=Math.max(-12,Math.min(12,boatYaw+move[0]));boatPitch=Math.max(-4,Math.min(4,boatPitch+move[1]));updateBoat();
    });
  }

  const tabs=$$('[data-tab]');
  function selectTab(tab,focus=false) {
    tabs.forEach(t=>{
      const selected=t===tab;
      t.setAttribute('aria-selected',String(selected));
      t.tabIndex=selected?0:-1;
      const panel=document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden=!selected;
      panel.classList.toggle('is-active',selected);
    });
    if(focus)tab.focus();
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectTab(tab));
    tab.addEventListener('keydown',e=>{
      let next;
      if(e.key==='ArrowRight')next=(index+1)%tabs.length;
      if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
      if(e.key==='Home')next=0;
      if(e.key==='End')next=tabs.length-1;
      if(next!==undefined){e.preventDefault();selectTab(tabs[next],true);}
    });
  });

  // Each colour is a precomposed transparent boat: no browser-specific CSS mask can hide it.
  const choices=$$('[data-color]');
  const colorBoat=$('.color-boat-image');
  choices.forEach(button=>button.addEventListener('click',()=>{
    const selected=button.dataset.color;
    if(!colorBoat)return;
    choices.forEach(c=>c.setAttribute('aria-pressed',String(c===button)));
    colorBoat.src='assets/style-boat-'+selected+'.png';
    colorBoat.alt='YAVA XL COB, '+button.dataset.name.toLowerCase()+' нижний борт';
    $('[data-color-name]').textContent=button.dataset.name;
  }));

  $('[data-year]').textContent=new Date().getFullYear();

  const steps=$$('[data-step]');
  const frames=$$('[data-scene]');
  const tracks=$$('.scene-track i');
  let activeStep=-1;
  const voyage=$('.voyage');
  const storyWindow=$('.voyage-window');
  const storySteps=$('.voyage-steps');
  root.classList.add('story-ready');
  const pinnedStory=()=>innerWidth>960&&innerHeight>=620&&!reduced;
  function goStory(delta) {
    if(!pinnedStory())return;
    const next=Math.max(0,Math.min(steps.length-1,activeStep+delta));
    const travel=voyage.offsetHeight-innerHeight;
    scrollTo({top:scrollY+voyage.getBoundingClientRect().top+next*travel/(steps.length-1),behavior:'smooth'});
  }
  $('[data-story-prev]').addEventListener('click',()=>goStory(-1));
  $('[data-story-next]').addEventListener('click',()=>goStory(1));
  function setStory(index) {
    if(index===activeStep)return;
    activeStep=index;
    steps.forEach((s,i)=>s.classList.toggle('is-active',i===index));
    frames.forEach((s,i)=>{s.classList.toggle('is-active',i===index);s.setAttribute('aria-hidden',String(i!==index));});
    tracks.forEach((s,i)=>s.classList.toggle('is-active',i===index));
    $('[data-scene-number]').textContent=String(index+1).padStart(2,'0')+' / '+String(steps.length).padStart(2,'0');
    $('[data-scene-label]').textContent=steps[index].dataset.label;
  }
  frames.forEach((s,i)=>s.setAttribute('aria-hidden',String(i!==0)));

  // Desktop wheel cadence: one deliberate wheel gesture advances exactly one
  // full-screen chapter (or one pinned story scene), then settles before the
  // next gesture is accepted. Touch, keyboard and reduced-motion stay native.
  const wheelSections=$$('main>section');
  let wheelGestureActive=false;
  let wheelSettling=false;
  let wheelGestureTimer=0;
  let wheelSettleTimer=0;
  const wheelCadenceEnabled=()=>pinnedStory();
  function wheelStops(){
    const stops=[];
    wheelSections.forEach(section=>{
      const top=scrollY+section.getBoundingClientRect().top;
      if(section===voyage&&pinnedStory()){
        const travel=Math.max(0,section.offsetHeight-innerHeight);
        steps.forEach((_,index)=>stops.push(top+travel*index/Math.max(1,steps.length-1)));
      }else{
        stops.push(top);
      }
    });
    return stops.sort((a,b)=>a-b).filter((stop,index,list)=>index===0||Math.abs(stop-list[index-1])>8);
  }
  function expandedFaqNeedsNativeScroll(direction){
    if(!faqDetails.some(detail=>detail.open))return false;
    const faq=$('#faq');
    if(!faq)return false;
    const rect=faq.getBoundingClientRect();
    if(rect.bottom<=0||rect.top>=innerHeight)return false;
    return direction>0?rect.bottom>innerHeight+3:rect.top<-3;
  }
  function updateWheelCadence(){
    root.classList.toggle('wheel-cadence',wheelCadenceEnabled());
  }
  function handleWheelCadence(event){
    if(!wheelCadenceEnabled()||event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
    const direction=Math.sign(event.deltaY);
    if(!direction||expandedFaqNeedsNativeScroll(direction))return;
    event.preventDefault();

    clearTimeout(wheelGestureTimer);
    wheelGestureTimer=setTimeout(()=>{wheelGestureActive=false;},180);
    if(wheelGestureActive||wheelSettling)return;
    wheelGestureActive=true;

    const y=scrollY;
    const tolerance=24;
    const stops=wheelStops();
    const target=direction>0
      ?stops.find(stop=>stop>y+tolerance)
      :[...stops].reverse().find(stop=>stop<y-tolerance);
    if(target===undefined)return;

    wheelSettling=true;
    scrollTo({top:Math.round(target),behavior:'smooth'});
    clearTimeout(wheelSettleTimer);
    wheelSettleTimer=setTimeout(()=>{wheelSettling=false;},680);
  }
  addEventListener('wheel',handleWheelCadence,{passive:false});
  updateWheelCadence();

  const backToTop=$('.back-to-top');
  function updateScroll() {
    const height=document.documentElement.scrollHeight-innerHeight;
    $('.scroll-progress').style.transform='scaleX('+(height>0?scrollY/height:0)+')';
    if(backToTop){
      const visible=$('.hero').getBoundingClientRect().bottom<=0;
      backToTop.classList.toggle('is-visible',visible);
      backToTop.setAttribute('aria-hidden',String(!visible));
      backToTop.tabIndex=visible?0:-1;
    }
    if(pinnedStory()){
      const travel=Math.max(1,voyage.offsetHeight-innerHeight);
      const progress=Math.max(0,Math.min(1,-voyage.getBoundingClientRect().top/travel));
      const index=Math.min(steps.length-1,Math.floor(progress*(steps.length-1)+.25));
      setStory(index);
      storySteps.style.transform='translateY('+(-index*storyWindow.clientHeight)+'px)';
      steps.forEach((step,i)=>{step.inert=i!==index;step.setAttribute('aria-hidden',String(i!==index));});
      $('[data-story-prev]').disabled=index===0;
      $('[data-story-next]').disabled=index===steps.length-1;
    }else{
      storySteps.style.transform='';
      steps.forEach(step=>{step.inert=false;step.removeAttribute('aria-hidden');});
      let nearest=0,distance=Infinity;
      steps.forEach((step,i)=>{const d=Math.abs(step.getBoundingClientRect().top-innerHeight*.25);if(d<distance){distance=d;nearest=i;}});
      setStory(nearest);
    }
    if(!reduced&&innerWidth>600){
      const hero=$('.hero');
      if(scrollY<hero.offsetHeight) $('.hero-photo').style.transform='translateY('+Math.min(scrollY*.13,100)+'px)';
    }
    scrollDirty=false;
  }

  // Bounded, visibility-aware canvas system: white caustics on navy, blue shadows on ice.
  const surfaces=$$('[data-water]').map((canvas,index)=>({
    canvas,photo:canvas.dataset.water==='photo',ctx:canvas.getContext('2d'),dark:canvas.parentElement.classList.contains('dark'),
    visible:false,w:0,h:0,scale:1,seed:index*2.43,ripples:[]
  }));
  const resize=new ResizeObserver(entries=>{
    entries.forEach(entry=>{
      const s=surfaces.find(x=>x.canvas.parentElement===entry.target);
      if(s){
        s.w=entry.contentRect.width;s.h=entry.contentRect.height;
        s.scale=Math.min(1,(s.photo?1600:1100)/Math.max(1,s.w),2100/Math.max(1,s.h));
        s.canvas.width=Math.ceil(s.w*s.scale);s.canvas.height=Math.ceil(s.h*s.scale);
        s.ctx?.setTransform(s.scale,0,0,s.scale,0,0);
      }
    });
    scrollDirty=true;connectTopics();if(reduced)drawAll(0);
  });
  const visibility=new IntersectionObserver(entries=>{
    for(const entry of entries){const s=surfaces.find(x=>x.canvas.parentElement===entry.target);if(s)s.visible=entry.isIntersecting;}
    if(reduced)drawAll(0);
  },{rootMargin:'100px'});
  surfaces.forEach(s=>{resize.observe(s.canvas.parentElement);visibility.observe(s.canvas.parentElement);});
  const reservoir = new Image();
  reservoir.src='assets/reservoir-water.webp';
  reservoir.addEventListener('load',()=>{if(reduced)drawAll(0);else start();});
  const hullWaterCanvas=$('[data-hull-water]');
  const hullWater=hullWaterCanvas?{canvas:hullWaterCanvas,ctx:hullWaterCanvas.getContext('2d'),w:0,h:0,scale:1}:null;
  if(hullWater){
    const sizeHullWater=()=>{
      const r=hullWater.canvas.getBoundingClientRect();
      hullWater.w=r.width;hullWater.h=r.height;
      hullWater.scale=Math.min(1.25,1600/Math.max(1,r.width),1100/Math.max(1,r.height));
      hullWater.canvas.width=Math.ceil(r.width*hullWater.scale);
      hullWater.canvas.height=Math.ceil(r.height*hullWater.scale);
      hullWater.ctx.setTransform(hullWater.scale,0,0,hullWater.scale,0,0);
    };
    new ResizeObserver(sizeHullWater).observe(hullWater.canvas);
    sizeHullWater();
  }
  function renderReservoir(s,time) {
    const c=s.ctx,w=s.w,h=s.h;
    if(!reservoir.complete||!reservoir.naturalWidth)return;
    const activeWater=s.canvas.parentElement.classList.contains('colors-section');
    const phase=time*(activeWater ? .00112 : .0008);
    // Crop away the sky. Overlapping water strips gently refract in a shared swell.
    const sourceY=reservoir.naturalHeight*.23;
    const sourceH=reservoir.naturalHeight-sourceY;
    const scale=Math.max((w+40)/reservoir.naturalWidth,(h+40)/sourceH);
    const sw=(w+40)/scale,sh=(h+40)/scale;
    const sx=(reservoir.naturalWidth-sw)/2,sy=sourceY+(sourceH-sh)/2;
    for(let y=-20;y<h+20;y+=activeWater?2:3){
      const depth=(y+20)/(h+40);
      const dx=Math.sin(phase-depth*9)*(activeWater?7.5:5)+Math.sin(phase*.67+depth*18)*(activeWater?2.8:1.8);
      const dy=Math.sin(phase-depth*7)*(activeWater?2.35:1.4);
      c.drawImage(reservoir,sx,sy+(y+20)/scale,sw,5/scale,-20+dx,y+dy,w+40,5);
    }
    // A broad soft fade, with a slightly irregular edge rather than a hard horizon.
    c.globalCompositeOperation='destination-in';
    const fade=c.createLinearGradient(0,0,0,h);
    fade.addColorStop(0,'transparent');fade.addColorStop(.07,'#fff');
    fade.addColorStop(.91,'#fff');fade.addColorStop(1,'transparent');
    c.fillStyle=fade;c.fillRect(0,0,w,h);
    c.globalCompositeOperation='source-over';
    const boat=$('.color-boat,.join-boat',s.canvas.parentElement);
    if(boat){
      boat.style.transform='translateY('+(Math.sin(phase)*3).toFixed(2)+'px) rotate('+(Math.sin(phase)*.42).toFixed(3)+'deg)';
    }
  }
  function renderHullWater(time){
    if(!hullWater||!hullWater.w||!hullWater.h||!reservoir.complete||!reservoir.naturalWidth)return;
    const c=hullWater.ctx,w=hullWater.w,h=hullWater.h;
    c.clearRect(0,0,w,h);
    const boat=$('.color-boat-image');
    const section=$('.colors-section');
    if(!boat||!section)return;
    const canvasRect=hullWater.canvas.getBoundingClientRect();
    const boatRect=boat.getBoundingClientRect();
    const sectionRect=section.getBoundingClientRect();
    if(sectionRect.bottom<0||sectionRect.top>innerHeight)return;

    const left=boatRect.left-canvasRect.left;
    const top=boatRect.top-canvasRect.top;
    const bw=boatRect.width,bh=boatRect.height;
    const stern=left+bw*.156;
    const front=left+bw*.672;
    const span=front-stern;
    const phase=time*.00155;
    const startY=top+bh*.892;
    const middleY=top+bh*.938;
    const endY=top+bh*.946;

    c.save();
    const points=[];
    for(let i=0;i<=52;i++){
      const u=i/52;
      const x=stern+span*u;
      const base=u<.72
        ?startY+(middleY-startY)*Math.sin(u/.72*Math.PI/2)
        :middleY+(endY-middleY)*((u-.72)/.28);
      const taper=Math.pow(Math.sin(Math.PI*u),1.55);
      const wave=(Math.sin(phase+u*10.5)*4.1+Math.sin(phase*.63+u*23)*1.8)*taper;
      points.push({x,y:base+wave,u});
    }
    c.beginPath();
    points.forEach((point,i)=>{if(i===0)c.moveTo(point.x,point.y);else c.lineTo(point.x,point.y);});
    for(let i=points.length-1;i>=0;i--){
      const point=points[i];
      const depth=Math.pow(Math.sin(Math.PI*point.u),1.35)*(18+Math.sin(phase*.8+point.u*16)*3);
      c.lineTo(point.x,point.y+depth);
    }
    c.closePath();
    c.clip();

    const sectionW=sectionRect.width,sectionH=sectionRect.height;
    const sourceY=reservoir.naturalHeight*.23;
    const sourceH=reservoir.naturalHeight-sourceY;
    const scale=Math.max((sectionW+40)/reservoir.naturalWidth,(sectionH+40)/sourceH);
    const sw=(sectionW+40)/scale,sh=(sectionH+40)/scale;
    const sx=(reservoir.naturalWidth-sw)/2,sy=sourceY+(sourceH-sh)/2;
    const canvasOffsetX=canvasRect.left-sectionRect.left;
    const canvasOffsetY=canvasRect.top-sectionRect.top;
    c.filter='brightness(.82) saturate(.94) contrast(1.04)';
    for(let y=Math.max(0,startY-10);y<Math.min(h,middleY+28);y+=2){
      const globalY=canvasOffsetY+y;
      const depth=(globalY+20)/(sectionH+40);
      const dx=Math.sin(time*.00112-depth*9)*7.5+Math.sin(time*.00075+depth*18)*2.8;
      const dy=Math.sin(time*.00112-depth*7)*2.35;
      c.drawImage(reservoir,sx,sy+(globalY+20)/scale,sw,4/scale,-20+dx-canvasOffsetX,y+dy,sectionW+40,4);
    }
    c.filter='blur(.35px)';
    c.globalCompositeOperation='screen';
    c.lineCap='round';
    [[8,14],[23,31]].forEach((range,index)=>{
      c.beginPath();
      for(let i=range[0];i<=range[1];i++){
        const point=points[i];
        const lift=Math.sin(phase*1.15+point.u*18+index)*.8;
        if(i===range[0])c.moveTo(point.x,point.y+1.5+lift);else c.lineTo(point.x,point.y+1.5+lift);
      }
      c.strokeStyle='rgba(194,225,246,'+(.2+index*.035)+')';
      c.lineWidth=1.15+index*.25;
      c.stroke();
    });
    c.restore();
  }
  function renderWater(s,time) {
    const c=s.ctx;if(!c||!s.w||!s.h)return;
    c.clearRect(0,0,s.w,s.h);
    if(s.photo){renderReservoir(s,time);return;}
    const t=time*.00016+s.seed;
    const rgb=s.dark?'155,202,253':'39,100,168';
    // Long refracted contours, deliberately visible on both background families.
    for(let j=0;j<7;j++){
      const y=s.h*(.12+j*.13);
      c.beginPath();
      for(let x=-30;x<=s.w+30;x+=32){
        const wave=Math.sin(x*.005+t+j*.9)*18+Math.sin(x*.012-t*.72+j)*8;
        if(x===-30)c.moveTo(x,y+wave);else c.lineTo(x,y+wave);
      }
      c.strokeStyle='rgba('+rgb+','+(s.dark?.11:.12)+')';
      c.lineWidth=j%3===0?1.8:.8;c.stroke();
      if(j%2===0){c.strokeStyle='rgba('+rgb+','+(s.dark?.045:.035)+')';c.lineWidth=13;c.stroke();}
    }
    for(let j=0;j<15;j++){
      const x=((j*.618*s.w+t*14)%(s.w+60))-30;
      const y=(Math.sin(j*9.4)*.5+.5)*s.h+Math.sin(t*2+j)*13;
      const alpha=(.5+.5*Math.sin(t*2+j*1.7))*(s.dark?.44:.25);
      c.beginPath();c.ellipse(x,y,j%3===0?2.3:1.2,j%3===0?3:1.7,.4,0,Math.PI*2);
      c.fillStyle='rgba('+rgb+','+alpha+')';c.fill();
    }
    s.ripples=s.ripples.filter(r=>time-r.born<2000);
    for(const r of s.ripples){
      const age=(time-r.born)/2000;
      for(let j=0;j<2;j++){
        const radius=12+age*125-j*12;if(radius<0)continue;
        c.beginPath();c.ellipse(r.x,r.y,radius,radius*.42,0,0,Math.PI*2);
        c.strokeStyle='rgba(203,229,255,'+((1-age)*.32)+')';c.lineWidth=1;c.stroke();
      }
    }
  }
  function drawAll(t){surfaces.filter(s=>s.visible).forEach(s=>renderWater(s,t));renderHullWater(t);}
  const heroWater=surfaces[0];let lastRipple=0;
  $('.hero').addEventListener('pointermove',e=>{
    if(reduced||e.pointerType==='touch')return;
    const now=performance.now();
    if(now-lastRipple<115)return;lastRipple=now;
    const r=heroWater.canvas.getBoundingClientRect();
    heroWater.ripples.push({x:e.clientX-r.left,y:e.clientY-r.top,born:now});
    if(heroWater.ripples.length>12)heroWater.ripples.shift();
  },{passive:true});

  // Connections are a diagram of real club topics, not a second decorative logo.
  const scene=$('.club-scene');
  const connections=$('.club-connections');
  const topicNodes=$$('.club-topics li');
  const paths=topicNodes.map(()=>{
    const pair=['stream-glow','stream-core'].map(name=>{
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('class',name);connections.appendChild(path);return path;
    });
    return pair;
  });
  function connectTopics(time=0) {
    if(!scene)return;
    const r=scene.getBoundingClientRect(),cx=r.width*.5,cy=r.height*.5;
    connections.setAttribute('viewBox','0 0 '+r.width+' '+r.height);
    topicNodes.forEach((node,i)=>{
      const n=node.getBoundingClientRect();
      // Meet the near lower corner of each plate, except Routes: its upper-left
      // corner keeps the last stream clear of the label and the CTA below.
      const routesCorner=i===8;
      const x=routesCorner?n.left-r.left+1:n.left-r.left+(n.left-r.left+n.width/2<cx?n.width-1:1);
      const y=routesCorner?n.top-r.top+1:n.bottom-r.top-1;
      const dx=x-cx,dy=y-cy,length=Math.max(1,Math.hypot(dx,dy));
      const amplitude=Math.min(23,length*.1),phase=time*.00065+i*1.7;
      const points=Array.from({length:25},(_,j)=>{
        const s=j/24;
        const bend=Math.sin(s*Math.PI)*amplitude*(Math.sin(s*Math.PI*3-phase)+.3*Math.sin(s*Math.PI*5+phase*.7));
        return [cx+dx*s-dy/length*bend,cy+dy*s+dx/length*bend];
      });
      let d='M '+cx+' '+cy;
      for(let j=1;j<points.length-1;j++){
        const p=points[j],next=points[j+1];
        d+=' Q '+p[0].toFixed(2)+' '+p[1].toFixed(2)+' '+((p[0]+next[0])/2).toFixed(2)+' '+((p[1]+next[1])/2).toFixed(2);
      }
      d+=' T '+x.toFixed(2)+' '+y.toFixed(2);
      paths[i].forEach(path=>path.setAttribute('d',d));
    });
  }
  scene.addEventListener('pointermove',e=>{
    if(reduced||e.pointerType==='touch')return;
    const r=scene.getBoundingClientRect();
    scene.style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*2);
    scene.style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*2);
  },{passive:true});
  scene.addEventListener('pointerleave',()=>{scene.style.setProperty('--px',0);scene.style.setProperty('--py',0);});
  let lastConnections=0;
  function tick(time) {
    animationId=0;
    if(document.hidden)return;
    if(scrollDirty)updateScroll();
    if(!reduced&&time-lastFrame>33){
      drawAll(time);lastFrame=time;
      if(time-lastConnections>33&&surfaces.find(s=>s.canvas.parentElement===scene.closest('section'))?.visible){connectTopics(time);lastConnections=time;}
    }
    if(!reduced)animationId=requestAnimationFrame(tick);
  }
  function start(){if(!animationId&&!document.hidden)animationId=requestAnimationFrame(tick);}
  function setMotion() {
    reduced=media.matches||userPaused;
    root.classList.toggle('motion-paused',reduced);
    root.dataset.motion=reduced?'reduced':'full';
    if(motionButton){
      motionButton.setAttribute('aria-pressed',String(reduced));
      motionButton.textContent=media.matches?'Анимация отключена системой':userPaused?'Включить анимацию':'Приостановить анимацию';
      motionButton.disabled=media.matches;
    }
    if(reduced){cancelAnimationFrame(animationId);animationId=0;surfaces.forEach(s=>{s.ripples=[];});drawAll(0);connectTopics();}
    scrollDirty=true;updateWheelCadence();start();
  }
  if(motionButton)motionButton.addEventListener('click',()=>{userPaused=!userPaused;setMotion();});
  media.addEventListener('change',setMotion);
  addEventListener('scroll',()=>{scrollDirty=true;start();},{passive:true});
  addEventListener('resize',()=>{scrollDirty=true;updateWheelCadence();if(innerWidth>960)closeMenu();start();},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(animationId);animationId=0;}else{scrollDirty=true;start();}});
  setMotion();
})();
