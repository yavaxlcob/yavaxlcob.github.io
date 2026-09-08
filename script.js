(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    nav?.classList.toggle('is-open', !isOpen);
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

  const tabs = document.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('[data-panel]');
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel) => {
      const active = panel.dataset.panel === name;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  }));

  const colorPreview = document.querySelector('#color-preview');
  const colorName = document.querySelector('[data-color-name]');
  document.querySelectorAll('[data-image]').forEach((button) => button.addEventListener('click', () => {
    if (!colorPreview || !button.dataset.image) return;
    colorPreview.src = button.dataset.image;
    colorPreview.alt = `YAVA XL COB в цвете ${button.dataset.color || ''}`;
    if (colorName) colorName.textContent = button.dataset.color || '';
    document.querySelectorAll('.color-dot').forEach((dot) => dot.setAttribute('aria-pressed', String(dot === button)));
  }));

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lightboxImage) lightboxImage.src = '';
  };
  document.querySelectorAll('[data-gallery]').forEach((item) => item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    const remote = item.dataset.gallery;
    const fallback = item.dataset.local;
    lightboxImage.alt = item.querySelector('img')?.alt || 'Фотография YAVA XL COB';
    lightboxImage.onerror = () => { lightboxImage.onerror = null; lightboxImage.src = fallback || ''; };
    lightboxImage.src = remote || fallback || '';
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
  }));
  document.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox(); });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
