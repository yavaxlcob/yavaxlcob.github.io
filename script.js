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

  // Only these official transparent hull layers change. The photographic base is immutable.
  const choices=$$('[data-color]');
  const hulls=$$('[data-hull]');
  let colorRequest = 0;
  choices.forEach(button=>button.addEventListener('click',async()=>{
    const request = ++colorRequest;
    const selected=button.dataset.color;
    const layer=hulls.find(img=>img.dataset.hull===selected);
    try{await layer.decode();}catch{return;}
    if(request!==colorRequest)return;
    choices.forEach(c=>c.setAttribute('aria-pressed',String(c===button)));
    hulls.forEach(img=>img.classList.toggle('is-active',img===layer));
    $('[data-color-name]').textContent=button.dataset.name;
    $('.color-boat').setAttribute('aria-label','YAVA XL COB, цвет нижнего борта: '+button.dataset.name);
  }));

  // Native dialog supplies focus containment and Escape. Return focus to the clicked photo.
  const gallery=$$('[data-gallery]');
  const dialog=$('.lightbox');
  const largePhoto=$('img',dialog);
  let photoIndex=0, photoOpener=null;
  function showPhoto(index) {
    photoIndex=(index+gallery.length)%gallery.length;
    const item=gallery[photoIndex];
    const wrap=$('.lightbox-image-wrap');
    wrap.classList.toggle('is-light',item.classList.contains('light'));
    wrap.classList.toggle('is-interior',item.classList.contains('interior'));
    largePhoto.src=item.dataset.gallery;
    largePhoto.alt=$('img',item).alt;
    $('[data-photo-caption]').textContent=(photoIndex+1)+' / '+gallery.length+' — '+item.dataset.caption;
  }
  gallery.forEach((item,index)=>item.addEventListener('click',()=>{
    photoOpener=item;showPhoto(index);dialog.showModal();document.body.classList.add('modal-open');
  }));
  $('.lightbox-close').addEventListener('click',()=>dialog.close());
  $('[data-next]').addEventListener('click',()=>showPhoto(photoIndex+1));
  $('[data-prev]').addEventListener('click',()=>showPhoto(photoIndex-1));
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}
    if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}
  });
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');photoOpener?.focus({preventScroll:true});});
  let swipeX=null;
  dialog.addEventListener('touchstart',e=>{swipeX=e.changedTouches[0].clientX;},{passive:true});
  dialog.addEventListener('touchend',e=>{
    if(swipeX!==null){const dx=e.changedTouches[0].clientX-swipeX;if(Math.abs(dx)>65)showPhoto(photoIndex+(dx<0?1:-1));}
    swipeX=null;
  },{passive:true});
  $('[data-year]').textContent=new Date().getFullYear();

  const steps=$$('[data-step]');
  const frames=$$('[data-scene]');
  const tracks=$$('.scene-track i');
  let activeStep=0;
  function setStory(index) {
    if(index===activeStep)return;
    activeStep=index;
    steps.forEach((s,i)=>s.classList.toggle('is-active',i===index));
    frames.forEach((s,i)=>{s.classList.toggle('is-active',i===index);s.setAttribute('aria-hidden',String(i!==index));});
    tracks.forEach((s,i)=>s.classList.toggle('is-active',i===index));
    $('[data-scene-number]').textContent='0'+(index+1)+' / 04';
    $('[data-scene-label]').textContent=steps[index].dataset.label;
  }
  frames.forEach((s,i)=>s.setAttribute('aria-hidden',String(i!==0)));
  function updateScroll() {
    const height=document.documentElement.scrollHeight-innerHeight;
    $('.scroll-progress').style.transform='scaleX('+(height>0?scrollY/height:0)+')';
    const target=innerWidth<=600?Math.max(350,innerHeight*.64):innerHeight*.5;
    let nearest=0,distance=Infinity;
    steps.forEach((step,i)=>{const r=step.getBoundingClientRect();const d=Math.abs(r.top+Math.min(r.height*.45,180)-target);if(d<distance){distance=d;nearest=i;}});
    setStory(nearest);
    if(!reduced&&innerWidth>600){
      const hero=$('.hero');
      if(scrollY<hero.offsetHeight) $('.hero-photo').style.transform='translateY('+Math.min(scrollY*.13,100)+'px)';
    }
    scrollDirty=false;
  }

  // Bounded, visibility-aware canvas system: white caustics on navy, blue shadows on ice.
  const surfaces=$$('[data-water]').map((canvas,index)=>({
    canvas,ctx:canvas.getContext('2d'),dark:canvas.parentElement.classList.contains('dark'),
    visible:false,w:0,h:0,scale:1,seed:index*2.43,ripples:[]
  }));
  const resize=new ResizeObserver(entries=>{
    entries.forEach(entry=>{
      const s=surfaces.find(x=>x.canvas.parentElement===entry.target);
      if(s){
        s.w=entry.contentRect.width;s.h=entry.contentRect.height;
        s.scale=Math.min(1,1100/Math.max(1,s.w),2100/Math.max(1,s.h));
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
  function renderWater(s,time) {
    const c=s.ctx;if(!c||!s.w||!s.h)return;
    c.clearRect(0,0,s.w,s.h);
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
  function drawAll(t){surfaces.filter(s=>s.visible).forEach(s=>renderWater(s,t));}
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
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    connections.appendChild(path);return path;
  });
  function connectTopics() {
    if(!scene)return;
    const r=scene.getBoundingClientRect(),cx=r.width*.5,cy=r.height*.5;
    connections.setAttribute('viewBox','0 0 '+r.width+' '+r.height);
    topicNodes.forEach((node,i)=>{
      const n=node.getBoundingClientRect(),x=n.left-r.left+n.width/2,y=n.top-r.top+n.height/2;
      paths[i].setAttribute('d','M '+cx+' '+cy+' Q '+((cx+x)/2+(i%2?24:-24))+' '+((cy+y)/2)+' '+x+' '+y);
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
      if(time-lastConnections>100&&surfaces.find(s=>s.canvas.parentElement===scene.closest('section'))?.visible){connectTopics();lastConnections=time;}
    }
    if(!reduced)animationId=requestAnimationFrame(tick);
  }
  function start(){if(!animationId&&!document.hidden)animationId=requestAnimationFrame(tick);}
  function setMotion() {
    reduced=media.matches||userPaused;
    root.classList.toggle('motion-paused',reduced);
    root.dataset.motion=reduced?'reduced':'full';
    motionButton.setAttribute('aria-pressed',String(reduced));
    motionButton.textContent=media.matches?'Анимация отключена системой':userPaused?'Включить анимацию':'Приостановить анимацию';
    motionButton.disabled=media.matches;
    if(reduced){cancelAnimationFrame(animationId);animationId=0;surfaces.forEach(s=>{s.ripples=[];});drawAll(0);connectTopics();}
    scrollDirty=true;start();
  }
  motionButton.addEventListener('click',()=>{userPaused=!userPaused;setMotion();});
  media.addEventListener('change',setMotion);
  addEventListener('scroll',()=>{scrollDirty=true;start();},{passive:true});
  addEventListener('resize',()=>{scrollDirty=true;if(innerWidth>960)closeMenu();start();},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(animationId);animationId=0;}else{scrollDirty=true;start();}});
  setMotion();
})();
