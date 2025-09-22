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
  const headerEl = document.querySelector('.site-header');
  const navEl    = document.querySelector('.nav-links');
  const linkEls  = navEl ? Array.from(navEl.querySelectorAll('a[href^="#"]')) : [];
  const sectionEls = Array.from(document.querySelectorAll('#hero, section[id]'));
  if (!headerEl || !navEl || !linkEls.length || !sectionEls.length) return;

  const idToLink = new Map(linkEls.map(a => [a.getAttribute('href').slice(1), a]));
  let segments = []; // [{ id, top, bottom }]

  function setActive(id) {
    linkEls.forEach(a => a.classList.toggle('active', a === idToLink.get(id)));
  }

  function recalc() {
    const docH = Math.ceil(document.documentElement.scrollHeight);
    const tops = sectionEls.map(s => Math.round(s.getBoundingClientRect().top + window.scrollY));
    segments = sectionEls.map((s, i) => ({
      id: s.id,
      top: tops[i],
      bottom: i < sectionEls.length - 1 ? tops[i + 1] : docH
    }));
    update();
  }

  function currentId() {
    const lineY = Math.round(window.scrollY + headerEl.offsetHeight + 1);
    const doc   = document.documentElement;
    const EPS   = 4;

    // true bottom → last section
    if (Math.ceil(window.innerHeight + window.scrollY) >= Math.ceil(doc.scrollHeight) - 1) {
      return segments[segments.length - 1].id;
    }

    // section whose range contains the line (with tolerance)
    for (const seg of segments) {
      if (lineY >= seg.top - EPS && lineY < seg.bottom - EPS) return seg.id;
    }

    // in a gap → last section whose top is above the line
    let last = segments[0].id;
    for (const seg of segments) {
      if (lineY >= seg.top - EPS) last = seg.id;
    }
    return last;
  }

  function update() { setActive(currentId()); }

  // immediate visual feedback on click, then let scroll take over
  linkEls.forEach(a => {
    a.addEventListener('click', () => {
      setActive(a.getAttribute('href').slice(1));
      requestAnimationFrame(update);
    });
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', recalc);
  window.addEventListener('load', recalc);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(recalc);

  // late content (images/video) safety recalc
  setTimeout(recalc, 600);
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