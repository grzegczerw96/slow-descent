// Starting a film version: the information, the camera, the bar, and what the checks need to know.
// A version supplies its shots, its beats and what else moves (opts.onFrame), and where the film ends in screens.
window.FilmPage = {
  // the film of the woman, in parts, with a depth strip; any time 0..34.5 s
  PARTS: () => [[0, 8.5], [8.5, 8.667], [17.167, 8.5], [25.667, 8.333]].map(([t0, dur], i) => ({ src: `film-depth-${i}.mp4`, t0, dur })),
  CLIP: (src, dur) => [{ src, t0: 0, dur }],
  // where the person is in a clip at a moment, from tools/subject_track.py
  track(name, off = 0) {
    const tr = window.TRACKS[name];
    return T => { const f = Math.max(0, (T + off) * 2), i = Math.floor(f), a = tr[Math.min(tr.length - 1, i)], b = tr[Math.min(tr.length - 1, i + 1)], k = f - i; if (!a[3] || !b[3]) return a[3] ? a.slice(1) : null; return [1, 2, 3, 4].map(n => a[n] + (b[n] - a[n]) * k); };
  },
  async start({ shots, filmEnd, onFrame, resize, snow = 1, snowOnNavy = false }) {
    const el = document.querySelector('#info');
    Info.render(el);
    document.querySelector('.spacer').style.height = (filmEnd + 1) * 100 + 'svh';
    await Home.init({ resize: () => { film.size(); resize && resize(); } });
    await document.fonts.ready;
    const film = Film.create(document.querySelector('.gl'), shots, { snow: el.dataset.base + 'snow.jpg', base: el.dataset.base });
    film.state.snow = snow; film.state.snowOnNavy = snowOnNavy;
    const root = document.documentElement, stage = document.querySelector('.stage'), nav = document.querySelector('.nav');
    Home.onFrame((h, y, now) => {
      const H = Home.H, reading = y > (filmEnd + .92) * H;
      root.classList.toggle('reading', reading);
      const gone = y > (filmEnd + 1.1) * H;
      if (stage.style.visibility !== (gone ? 'hidden' : 'visible')) stage.style.visibility = gone ? 'hidden' : 'visible';
      if (!gone) { onFrame && onFrame(h, y, now, film); film.frame(h, now); }
    });
    window.__home.subject = () => film.subject(Home.lenis.scroll / Home.H);
    window.__home.gate = () => root.classList.contains('reading') ? [nav.offsetHeight + 4, Home.H + 1] : null;
    window.__home.film = film;
    return film;
  },
};
