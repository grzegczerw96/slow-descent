// Starting a film version: the camera, the bar, the shared clips. A version brings its shots, words and information layout.
window.FilmPage = {
  WOMAN: () => [[0, 8.583], [8.583, 8.625], [17.208, 8.458], [25.666, 8.417]].map(([t0, dur], i) => ({ src: `f2-woman-${i}.mp4`, t0, dur })),
  CLIP: (src, dur) => [{ src, t0: 0, dur }],
  // where the person is in a clip at a moment, from tools/subject_track.py
  track(name, off = 0) {
    const tr = window.TRACKS[name];
    return T => { const f = Math.max(0, (T + off) * 2), i = Math.floor(f), a = tr[Math.min(tr.length - 1, i)], b = tr[Math.min(tr.length - 1, i + 1)], k = f - i; if (!a[3] || !b[3]) return a[3] ? a.slice(1) : null; return [1, 2, 3, 4].map(n => a[n] + (b[n] - a[n]) * k); };
  },
  span: (h0, h1, a, b) => h => Home.lerp(a, b, Home.c01((h - h0) / (h1 - h0))),
  // total: length in screens of the fixed part of the page; what follows it scrolls as usual
  async start({ shots, total, base, onFrame, resize, readingFrom, gate, stayOn }) {
    if (total !== null) document.querySelector('.spacer').style.height = (total + 1) * 100 + 'svh';
    let film;
    await Home.init({ resize: () => { film && film.size(); resize && resize(); } });
    await document.fonts.ready;
    film = Film.create(document.querySelector('.gl'), shots, { base });
    const root = document.documentElement, stage = document.querySelector('.stage'), nav = document.querySelector('.nav');
    Home.onFrame((h, y, now) => {
      root.classList.toggle('reading', h > readingFrom);
      const gone = !stayOn && y > (total + 1.1) * Home.H;
      if (stage.style.visibility !== (gone ? 'hidden' : 'visible')) stage.style.visibility = gone ? 'hidden' : 'visible';
      if (!gone) { onFrame && onFrame(h, y, now, film); film.frame(h, now); }
    });
    window.__home.subject = () => film.subject(Home.lenis.scroll / Home.H);
    window.__home.gate = () => (gate ? gate() : null);
    window.__home.film = film;
    return film;
  },
};
