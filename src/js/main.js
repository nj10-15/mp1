// year in footer
document.getElementById('year').textContent = new Date().getFullYear();

/*// navbar progress indicator
const indicator = document.querySelector('.indicator');
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
  indicator.style.width = pct + '%';
});*/

// simple carousel
// ----- Reliable carousel -----
const trackEl = document.getElementById('track');
const slidesEl = trackEl ? Array.from(trackEl.querySelectorAll('.slide')) : [];
let idx = 0;

function slideWidth() {
  // width of the track viewport (the visible area), not the image
  return trackEl?.parentElement?.clientWidth || 0;
}

function goTo(i) {
  if (!slidesEl.length) return;
  idx = (i + slidesEl.length) % slidesEl.length;
  const w = slideWidth();
  // If width is 0 (e.g., early), try again after next frame
  if (!w) return requestAnimationFrame(() => goTo(idx));
  trackEl.style.transform = `translateX(-${idx * w}px)`;
}

// Buttons
document.querySelector('.next')?.addEventListener('click', () => goTo(idx + 1));
document.querySelector('.prev')?.addEventListener('click', () => goTo(idx - 1));

// Recalculate on resize (responsive)
window.addEventListener('resize', () => goTo(idx));

// Ensure images are loaded before first calc
window.addEventListener('load', () => goTo(0));
goTo(0);


// modal
const modal = document.getElementById('modal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.querySelector('.close');
openBtn?.addEventListener('click', () => (modal.style.display = 'block'));
closeBtn?.addEventListener('click', () => (modal.style.display = 'none'));
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// NEW: horizontal gallery scroll buttons
const scroller = document.getElementById('mediaScroll');
const leftBtn  = document.querySelector('.gallery-strip .left');
const rightBtn = document.querySelector('.gallery-strip .right');

function scrollByCard(dir = 1) {
  if (!scroller) return;
  const card = scroller.querySelector('.item');
  const step = card ? card.clientWidth + 12 : 320; // 12 = gap
  scroller.scrollBy({ left: dir * step, behavior: 'smooth' });
}
leftBtn?.addEventListener('click', () => scrollByCard(-1));
rightBtn?.addEventListener('click', () => scrollByCard(1));



// ----- Scrollspy + underline indicator (robust) -----
(function () {
  const header   = document.querySelector('.site-header');
  const linksUL  = document.querySelector('.nav-links');
  const links    = linksUL ? Array.from(linksUL.querySelectorAll('a')) : [];
  const indicator= linksUL ? linksUL.querySelector('.nav-indicator') : null;
  const sections = Array.from(document.querySelectorAll('section[id], #hero'));

  if (!header || !linksUL || !links.length || !indicator || !sections.length) return;

  function moveIndicatorTo(linkEl){
    // Measure relative to the UL that contains the indicator
    const wrapRect = linksUL.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.left  = `${linkRect.left - wrapRect.left}px`;
  }

  function setActiveById(id){
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    const active = links.find(a => a.classList.contains('active'));
    if (active) moveIndicatorTo(active);
  }

  function updateOnScroll(){
    const headerBottom = header.getBoundingClientRect().bottom;
    // bottom-of-page → last link
    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
    if (atBottom) { setActiveById(sections[sections.length-1].id); return; }

    // pick the section directly under navbar's bottom
    const current = sections.find(sec => {
      const r = sec.getBoundingClientRect();
      return r.top <= headerBottom && r.bottom > headerBottom;
    });
    if (current) setActiveById(current.id);
  }

  // make it responsive to clicks, scroll, resize, and font loading
  links.forEach(a => a.addEventListener('click', () => setActiveById(a.getAttribute('href').slice(1))));
  window.addEventListener('scroll', updateOnScroll, { passive: true });
  window.addEventListener('resize', updateOnScroll);
  window.addEventListener('load', updateOnScroll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateOnScroll);

  // initial
  updateOnScroll();
})();





// Navbar resize on scroll + keep anchor offset correct
(function(){
  const header = document.querySelector('.site-header');
  if (!header) return;

  function updateHeader() {
    const scrolled = window.scrollY > 10;       // threshold
    header.classList.toggle('scrolled', scrolled);
    // keep anchor targets from hiding under the header
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);
  window.addEventListener('load',   updateHeader);
  updateHeader();
})();


// Workshops modal (text-only)
(function(){
  const modal   = document.getElementById('wsModal');
  if (!modal) return;

  const titleEl = document.getElementById('wsTitle');
  const textEl  = document.getElementById('wsText');
  const closeEl = modal.querySelector('.ws-close');

  let lastFocused = null;

  function openFrom(el){
    titleEl.textContent = el.getAttribute('data-title') || 'Workshop';
    textEl.textContent  = el.getAttribute('data-text')  || '';
    lastFocused = document.activeElement;
    modal.style.display = 'block';
    closeEl.focus();
  }
  function closeModal(){
    modal.style.display = 'none';
    if (lastFocused) lastFocused.focus();
  }

  // Open on any workshop card click
  document.querySelectorAll('.card.workshop-open').forEach(el => {
    el.addEventListener('click', () => openFrom(el));
  });

  // Close interactions
  closeEl.addEventListener('click', closeModal);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  window.addEventListener('click',   e => { if (e.target === modal) closeModal(); });
})();
