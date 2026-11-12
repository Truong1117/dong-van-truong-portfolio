/* Content stays in index.html so it can be updated without touching interactions. */
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preloader = document.querySelector('.preloader');
  setTimeout(() => preloader?.classList.add('done'), reducedMotion ? 0 : 700);

  const progress = document.querySelector('.scroll-progress span');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true }); updateProgress();

  if (!reducedMotion) {
    const glow = document.querySelector('.cursor-glow');
    addEventListener('pointermove', (event) => { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; }, { passive: true });
  }

  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  menuButton?.addEventListener('click', () => {
    const opening = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', opening); menuButton.classList.toggle('is-open', opening);
    menuButton.setAttribute('aria-expanded', String(opening));
  });
  document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', () => {
    mobileMenu.classList.remove('open'); menuButton.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

  document.querySelectorAll('.word-reveal').forEach((element) => {
    const words = element.dataset.text.split(' ');
    element.innerHTML = words.map((word, index) => `<span class="word" style="transition-delay:${index * 25}ms">${word}</span>`).join(' ');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.querySelectorAll('.word').forEach((word) => word.classList.add('shown')); observer.disconnect(); }
    }, { threshold: .35 }); observer.observe(element);
  });

  document.querySelectorAll('.accordion-item button').forEach((button) => button.addEventListener('click', () => {
    const item = button.parentElement; const willOpen = !item.classList.contains('is-open');
    document.querySelectorAll('.accordion-item').forEach((el) => { el.classList.remove('is-open'); el.querySelector('button').setAttribute('aria-expanded', 'false'); });
    if (willOpen) { item.classList.add('is-open'); button.setAttribute('aria-expanded', 'true'); }
  }));

  const skillsObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.skill-ring').forEach((ring) => {
      const circumference = 327; const percent = Number(ring.dataset.progress);
      ring.querySelector('.progress-circle').style.strokeDashoffset = circumference - (circumference * percent / 100);
    }); skillsObserver.disconnect();
  }, { threshold: .25 });
  const skills = document.querySelector('.skills'); if (skills) skillsObserver.observe(skills);

  const counterObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('[data-count]').forEach((counter) => {
      const target = Number(counter.dataset.count); const start = performance.now();
      const tick = (time) => { const value = Math.min(target, Math.ceil(((time - start) / 750) * target)); counter.textContent = value; if (value < target) requestAnimationFrame(tick); };
      reducedMotion ? counter.textContent = target : requestAnimationFrame(tick);
    }); counterObserver.disconnect();
  }, { threshold: .5 });
  const stats = document.querySelector('.stats'); if (stats) counterObserver.observe(stats);

  const timeline = document.querySelector('.timeline');
  if (timeline) new IntersectionObserver(([entry]) => { if (entry.isIntersecting) timeline.querySelector('.timeline-line i').style.height = '100%'; }, { threshold: .2 }).observe(timeline);

  const sections = [...document.querySelectorAll('.section-observe')];
  const dots = [...document.querySelectorAll('.dot-nav a')];
  const spy = new IntersectionObserver((entries) => entries.forEach((entry) => {
    const matchingDot = dots.find((dot) => dot.getAttribute('href') === `#${entry.target.id}`);
    if (entry.isIntersecting && matchingDot) dots.forEach((dot) => dot.classList.toggle('active', dot === matchingDot));
  }), { rootMargin: '-35% 0px -55% 0px', threshold: 0 }); sections.forEach((section) => spy.observe(section));

  if (!reducedMotion && matchMedia('(pointer:fine)').matches) document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => { const r = card.getBoundingClientRect(); const x = (event.clientX - r.left) / r.width - .5; const y = (event.clientY - r.top) / r.height - .5; card.style.transform = `perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-4px)`; });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  if (!reducedMotion && matchMedia('(pointer:fine)').matches) document.querySelectorAll('.magnetic').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const box = item.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      item.style.transform = `translate(${x * .12}px, ${y * .12}px)`;
    });
    item.addEventListener('pointerleave', () => { item.style.transform = ''; });
  });
});
