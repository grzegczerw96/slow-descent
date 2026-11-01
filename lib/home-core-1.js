// What the three home page versions share: scroll, the score (who is on screen and when), settling, reveals, the menu.
// Frozen with the versions that use it: a change that would alter them goes into home-core-2.js.
//
// The score is a list of beats, each [a, b, c, d] in screens of scroll: comes in a..b, holds b..c, leaves c..d. One beat
// leaves before the next arrives (tools/home_check.py checks it on real layouts), and the page never rests on a half-faded
// beat: when the scroll stops inside a..b or c..d it finishes the movement in the direction it was going.
window.Home = (() => {
  const c01 = v => Math.max(0, Math.min(1, v)), lerp = (a, b, k) => a + (b - a) * k, ss = v => { v = c01(v); return v * v * (3 - 2 * v); };
  const q = new URLSearchParams(location.search);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches && !q.has('motion');
  const coarse = matchMedia('(pointer: coarse)').matches;
  let lenis, H = innerHeight, W = innerWidth, probe;
  const score = [], frames = [];

  function measure() { H = probe.clientHeight; W = document.documentElement.clientWidth; }

  // one beat: its visibility at scroll h (screens), written only when it changes
  function beat(el, at, { y = 14, blur = 8, settle = true, name = '' } = {}) {
    const b = { el, at, y, blur, settle, name, last: -1 };
    el.setAttribute('data-c', name || at.join('-'));
    score.push(b); return b;
  }
  function amount(at, h) { return ss((h - at[0]) / (at[1] - at[0])) * ss((at[3] - h) / (at[3] - at[2])); }
  function apply(b, h) {
    const o = amount(b.at, h);
    const life = c01((h - b.at[0]) / (b.at[3] - b.at[0]));
    if (o === 0 && b.last === 0) return;
    const s = b.el.style;
    s.visibility = o < .004 ? 'hidden' : 'visible';
    if (Math.abs(o - b.last) > .001 || o > 0) {
      s.opacity = o.toFixed(3);
      s.filter = o < .998 && b.blur ? `blur(${((1 - o) * b.blur).toFixed(1)}px)` : 'none';
      if (b.y) s.transform = `translate3d(0,${((.5 - life) * b.y).toFixed(1)}px,0)`;
    }
    b.last = o < .004 ? 0 : o;
  }

  // the page settles only out of half-faded states, in the direction it was moving, never against the reader
  let lastInput = 0, dir = 1, settling = false;
  const extra = [];
  function settleTarget(h) {
    for (const r of [...score.filter(b => b.settle).map(b => b.at), ...extra]) {
      const [a, b, c, d] = r;
      if (h > a && h < b) return (dir > 0 ? (h - a) / (b - a) > .2 : (h - a) / (b - a) > .8) ? b + .01 : a - .01;
      if (h > c && h < d) return (dir < 0 ? (d - h) / (d - c) > .2 : (d - h) / (d - c) > .8) ? c - .01 : d + .01;
    }
    return null;
  }
  function settleTick(now, h) {
    if (reduce || coarse || q.has('nosettle') || settling) return;
    if (now - lastInput < 240 || Math.abs(lenis.velocity) > .35 || menuOpen) return;
    const t = settleTarget(h);
    if (t === null) return;
    const dist = Math.abs(t - h);
    settling = true;
    lenis.scrollTo(t * H, { duration: .5 + dist * 1.6, easing: x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, onComplete: () => { settling = false; } });
  }

  // lines of a text, each in its own mask with room for Polish diacritics; undone after the reveal so text reflows
  function splitLines(el) {
    if (el._html === undefined) el._html = el.innerHTML;
    const walk = n => {
      for (const c of [...n.childNodes]) {
        if (c.nodeType === 3) {
          const f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span'); s.className = 'w'; s.textContent = w; s.style.display = 'inline-block'; f.appendChild(s);
          });
          c.replaceWith(f);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      }
    };
    walk(el);
    const words = [...el.querySelectorAll('.w')], lines = [];
    let top = null, cur = null;
    for (const w of words) { const t = w.offsetTop; if (top === null || Math.abs(t - top) > 4) { cur = []; lines.push(cur); top = t; } cur.push(w); }
    el.textContent = '';
    return lines.map(ws => {
      const m = document.createElement('span'), i = document.createElement('span');
      m.style.cssText = 'display:block;overflow:hidden;padding:.16em 0 .12em;margin:-.16em 0 -.12em';
      i.style.cssText = 'display:block;will-change:transform';
      ws.forEach((w, k) => { i.appendChild(w); if (k < ws.length - 1) i.appendChild(document.createTextNode(' ')); });
      m.appendChild(i); el.appendChild(m); return i;
    });
  }
  function reveal(el, delay = 0) {
    const kind = el.dataset.rv;
    if (reduce) { el.style.opacity = 1; return; }
    if (kind === 'lines') {
      el.style.opacity = 1;
      const ls = splitLines(el);
      gsap.fromTo(ls, { yPercent: 118 }, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: .085, delay, onComplete: () => { el.innerHTML = el._html; } });
    } else gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', delay, clearProps: 'transform' });
  }
  function watchReveals() {
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const sibs = [...e.target.parentElement.querySelectorAll(':scope > [data-rv]')], i = Math.max(0, sibs.indexOf(e.target));
        reveal(e.target, Math.min(i, 3) * .09);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: .01 });
    document.querySelectorAll('[data-rv]').forEach(el => { el.style.opacity = 0; io.observe(el); });
  }

  // the menu: its links either name a section or a place in the score
  let menuOpen = false, menuEl;
  function setMenu(open) {
    if (!menuEl || open === menuOpen) return;
    menuOpen = open;
    document.documentElement.classList.toggle('menu-open', open);
    menuEl.setAttribute('aria-hidden', String(!open));
    document.querySelectorAll('[data-menu]:not(.x)').forEach(b => { b.textContent = open ? 'Zamknij' : 'Menu'; });
    gsap.killTweensOf(menuEl);
    if (open) {
      lenis.stop();
      menuEl.style.visibility = 'visible';
      gsap.fromTo(menuEl, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'expo.inOut' });
      gsap.fromTo(menuEl.querySelectorAll('a > span'), { yPercent: 118 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .06, delay: .34 });
    } else {
      lenis.start();
      gsap.to(menuEl, { clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'expo.inOut', onComplete: () => { menuEl.style.visibility = 'hidden'; } });
    }
  }
  function go(target, dur) {
    const y = typeof target === 'number' ? target * H : document.querySelector(target).getBoundingClientRect().top + lenis.scroll;
    lenis.scrollTo(y, { duration: dur || Math.min(3.2, 1.2 + Math.abs(y - lenis.scroll) / H * .12), easing: x => 1 - Math.pow(1 - x, 4), force: true });
  }
  function wireMenu() {
    menuEl = document.querySelector('.menu');
    document.querySelectorAll('[data-menu]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); setMenu(!menuOpen); }));
    document.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); setMenu(false);
      const t = a.dataset.go; setTimeout(() => go(isNaN(+t) ? t : +t), menuEl && a.closest('.menu') ? 350 : 0);
    }));
    addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    document.querySelectorAll('form').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault(); const b = f.querySelector('button'); if (b) { b.textContent = 'Dziękujemy. Odpiszemy w ciągu doby.'; b.disabled = true; }
    }));
  }

  // space and page keys walk from one held frame to the next
  function wireKeys() {
    addEventListener('keydown', e => {
      if (!['PageDown', 'PageUp', ' '].includes(e.key) || menuOpen || /INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)) return;
      const h = lenis.scroll / H, stops = score.filter(b => b.settle).map(b => (b.at[1] + b.at[2]) / 2).sort((a, b) => a - b);
      const down = e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
      const t = down ? stops.find(s => s > h + .1) : [...stops].reverse().find(s => s < h - .1);
      if (t === undefined) return;
      e.preventDefault(); lenis.scrollTo(t * H, { duration: 1.5, easing: x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2 });
    });
  }

  // video scrubbed by scroll: seeks only when the last seek has landed, and shows a clip once its right frame is there
  function scrub(v, t) {
    v._want = t;
    if (v.readyState >= 1 && !v.seeking && Math.abs(v.currentTime - t) > 1 / 48) v.currentTime = t;
  }
  // clips arrive one at a time in the order they are needed; the first streams, the others are held whole in memory
  function load(videos, base, stream = true) {
    const after = new Promise(r => { const g = () => setTimeout(r, 120); document.readyState === 'complete' ? g() : addEventListener('load', g); });
    let chain = after;
    videos.forEach((c, i) => {
      const v = c.v, url = base + c.src;
      v.muted = true; v.playsInline = true; v.preload = 'auto';
      if (i === 0 && stream) chain = after.then(() => new Promise(done => {
        v.src = url;
        const all = () => { const b = v.buffered; if (b.length && b.end(b.length - 1) >= v.duration - .3) done(); };
        v.addEventListener('progress', all); v.addEventListener('suspend', done); setTimeout(done, 12000);
      }));
      else chain = chain.then(() => fetch(url)).then(r => r.blob()).then(b => { v.src = URL.createObjectURL(b); }).catch(() => { v.src = url; });
      v.addEventListener('seeked', () => { if (Math.abs(v.currentTime - v._want) > .03) v.currentTime = v._want; });
    });
  }

  // a long film in parts, one video each, one on show. When the reader outruns the download the last frame simply waits;
  // no seek ever queues behind the network. parts: [{ src, t0, dur }], given to load() with the other clips
  function stack(box, parts) {
    let cur = null, wanted = 0;
    for (const p of parts) { p.v = document.createElement('video'); p.v.setAttribute('aria-hidden', 'true'); p.v.style.opacity = 0; box.appendChild(p.v); }
    return {
      parts,
      get ready() { return !!cur; },
      get lag() { return cur ? Math.abs(wanted - (cur.t0 + cur.v.currentTime)) : wanted; },
      scrub(T) {
        wanted = T;
        let p = parts.find(x => T < x.t0 + x.dur) || parts[parts.length - 1], t = T - p.t0;
        // not here yet: the last frame that is
        while (p.v.readyState < 2 && parts.indexOf(p) > 0) { p = parts[parts.indexOf(p) - 1]; t = p.dur; }
        if (p.v.readyState < 2) return;
        t = Math.min(t, p.dur - .06);
        // a part goes on show once it holds a frame close to the wanted one, checked before the next seek starts
        if (p !== cur && !p.v.seeking && Math.abs(p.v.currentTime - t) < .6) { p.v.style.opacity = 1; if (cur) cur.v.style.opacity = 0; cur = p; }
        scrub(p.v, t);
      },
    };
  }

  async function init(opts = {}) {
    probe = document.createElement('div'); probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;pointer-events:none;visibility:hidden'; document.body.appendChild(probe);
    measure();
    gsap.registerPlugin(ScrollTrigger);
    lenis = new Lenis({ lerp: .085, wheelMultiplier: .85, smoothWheel: true });
    if (reduce) { lenis.options.lerp = 1; }
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    let lastY = 0;
    const input = () => { lastInput = performance.now(); settling = false; };
    addEventListener('wheel', input, { passive: true }); addEventListener('touchstart', input, { passive: true }); addEventListener('keydown', input); addEventListener('pointerdown', input);
    gsap.ticker.add(() => {
      const now = performance.now(), y = lenis.scroll, h = y / H;
      if (Math.abs(y - lastY) > .5) dir = y > lastY ? 1 : -1;
      lastY = y;
      for (const b of score) apply(b, h);
      for (const f of frames) f(h, y, now);
      settleTick(now, h);
    });
    addEventListener('resize', () => { measure(); opts.resize && opts.resize(); });
    wireMenu(); wireKeys(); watchReveals();
    window.__home = { lenis, score, extra, get H() { return H; }, get W() { return W; }, subject: null, go };
    return lenis;
  }

  return {
    c01, lerp, ss, q, reduce, coarse, score, extra, beat, amount, init, scrub, load, stack, go, reveal, splitLines,
    onFrame: f => frames.push(f),
    get H() { return H; }, get W() { return W; }, get lenis() { return lenis; },
  };
})();
