// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Carousel
const trackEl  = document.getElementById('track');
const slidesEl = trackEl ? Array.from(trackEl.querySelectorAll('.slide')) : [];
let idx = 0;

function slideWidth() {
  return trackEl?.parentElement?.clientWidth || 0; // viewport width
}
function goTo(i) {
  if (!slidesEl.length) return;
  idx = (i + slidesEl.length) % slidesEl.length;
  const w = slideWidth();
  if (!w) return requestAnimationFrame(() => goTo(idx));
  trackEl.style.transform = `translateX(-${idx * w}px)`;
}
document.querySelector('.next')?.addEventListener('click', () => goTo(idx + 1));
document.querySelector('.prev')?.addEventListener('click', () => goTo(idx - 1));
window.addEventListener('resize', () => goTo(idx));
window.addEventListener('load', () => goTo(0));
goTo(0);

// Scrollspy
(function () {
  const header   = document.querySelector('.site-header');
  const linksUL  = document.querySelector('.nav-links');
  const links    = linksUL ? Array.from(linksUL.querySelectorAll('a')) : [];
  const sections = Array.from(document.querySelectorAll('section[id], #hero'));
  if (!header || !linksUL || !links.length || !sections.length) return;

  function setActiveById(id){
    links.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
    );
  }

  function updateOnScroll(){
    const headerBottom = header.getBoundingClientRect().bottom;
    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
    if (atBottom) { setActiveById(sections[sections.length-1].id); return; }
    const current = sections.find(sec => {
      const r = sec.getBoundingClientRect();
      return r.top <= headerBottom && r.bottom > headerBottom;
    });
    if (current) setActiveById(current.id);
  }

  links.forEach(a =>
    a.addEventListener('click', () => setActiveById(a.getAttribute('href').slice(1)))
  );
  window.addEventListener('scroll', updateOnScroll, { passive: true });
  window.addEventListener('resize', updateOnScroll);
  window.addEventListener('load', updateOnScroll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateOnScroll);
  updateOnScroll();
})();

// Navbar shrink + anchor offset
(function(){
  const header = document.querySelector('.site-header');
  if (!header) return;
  function updateHeader() {
    const scrolled = window.scrollY > 10;
    header.classList.toggle('scrolled', scrolled);
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);
  window.addEventListener('load',   updateHeader);
  updateHeader();
})();

// Workshops modal
(function(){
  const modal   = document.getElementById('wsModal');
  if (!modal) return;
  const titleEl = document.getElementById('wsTitle');
  const textEl  = document.getElementById('wsText');
  const closeEl = modal.querySelector('.ws-close');

  let lastFocused = null;

  function openFrom(el){
    titleEl.textContent = el.getAttribute('data-title') || 'Workshop';
    textEl.innerHTML  = el.getAttribute('data-text')  || '';
    lastFocused = document.activeElement;
    modal.style.display = 'block';
    closeEl.focus();
  }
  function closeModal(){
    modal.style.display = 'none';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.card.workshop-open').forEach(el => {
    el.addEventListener('click', () => openFrom(el));
  });
  closeEl.addEventListener('click', closeModal);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  window.addEventListener('click',   e => { if (e.target === modal) closeModal(); });
})();
