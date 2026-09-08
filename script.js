(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const progress = document.querySelector('[data-scroll-progress]');
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-photo');

  const updateScrollState = () => {
    const scrollTop = window.scrollY || 0;
    header?.classList.toggle('is-scrolled', scrollTop > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? scrollTop / max : 0) + ')';
    }
    if (!reducedMotion && heroImage && hero) {
      const bounds = hero.getBoundingClientRect();
      const progressInHero = Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height)));
      heroImage.style.setProperty('--hero-shift', Math.round(progressInHero * 65) + 'px');
      heroImage.style.setProperty('--hero-scale', String(1.07 + progressInHero * .06));
    }
  };
  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }));

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const voyageLabels = ['Открытая вода', 'Кабина / защита', 'Оснащение / основа', 'Маршрут / люди'];
  const voyageSteps = [...document.querySelectorAll('[data-voyage-step]')];
  const voyageFrames = [...document.querySelectorAll('[data-scene-frame]')];
  const voyageLabel = document.querySelector('[data-voyage-label]');
  const activateVoyage = (name) => {
    voyageSteps.forEach((step) => step.classList.toggle('is-active', step.dataset.voyageStep === name));
    voyageFrames.forEach((frame) => frame.classList.toggle('is-active', frame.dataset.sceneFrame === name));
    if (voyageLabel) voyageLabel.textContent = voyageLabels[Number(name)] || voyageLabels[0];
  };
  if ('IntersectionObserver' in window && voyageSteps.length) {
    const voyageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activateVoyage(entry.target.dataset.voyageStep);
      });
    }, { threshold: .55 });
    voyageSteps.forEach((step) => voyageObserver.observe(step));
  }

  const tabs = [...document.querySelectorAll('[data-tab]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const activateTab = (tab) => {
    const name = tab.dataset.tab;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.dataset.panel === name;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = (index + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    });
  });

  const colorPreview = document.querySelector('#color-preview');
  const colorName = document.querySelector('[data-color-name]');
  document.querySelectorAll('[data-image]').forEach((button) => button.addEventListener('click', () => {
    if (!colorPreview || !button.dataset.image) return;
    colorPreview.classList.add('is-changing');
    window.setTimeout(() => {
      colorPreview.src = button.dataset.image;
      colorPreview.alt = 'YAVA XL COB в цвете ' + (button.dataset.color || '');
      colorPreview.classList.remove('is-changing');
    }, reducedMotion ? 0 : 130);
    if (colorName) colorName.textContent = button.dataset.color || '';
    document.querySelectorAll('.color-dot').forEach((dot) => {
      const active = dot === button;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
  }));

  const countItems = document.querySelectorAll('[data-count]');
  const formatNumber = (value, decimals) => Number(value).toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const runCount = (element) => {
    const target = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals || 0);
    if (reducedMotion || !Number.isFinite(target)) {
      element.textContent = formatNumber(target, decimals);
      return;
    }
    const started = performance.now();
    const duration = 850;
    const tick = (now) => {
      const progressValue = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = formatNumber(target * eased, decimals);
      if (progressValue < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && countItems.length) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .6 });
    countItems.forEach((item) => countObserver.observe(item));
  } else {
    countItems.forEach(runCount);
  }

  const canvas = document.querySelector('[data-water-canvas]');
  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let frame = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const drawWater = () => {
      frame += 0.004;
      ctx.clearRect(0, 0, width, height);
      const base = height * .68;
      for (let line = 0; line < 9; line += 1) {
        ctx.beginPath();
        for (let x = -40; x <= width + 40; x += 28) {
          const y = base + line * 28 + Math.sin(x * .008 + frame * (1.4 + line * .06)) * (5 + line * .8) + Math.sin(x * .018 - frame) * 3;
          if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(154, 224, 216, ' + (0.022 + line * .003) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      requestAnimationFrame(drawWater);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(drawWater);
  }

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  let lastFocused = null;
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lightboxImage) lightboxImage.src = '';
    lastFocused?.focus();
  };
  document.querySelectorAll('[data-gallery]').forEach((item) => item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lastFocused = item;
    lightboxImage.alt = item.querySelector('img')?.alt || 'Фотография YAVA XL COB';
    lightboxImage.src = item.dataset.gallery || '';
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    document.querySelector('[data-lightbox-close]')?.focus();
  }));
  document.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();