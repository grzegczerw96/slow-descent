// What someone looking for their first course needs, written once, and three film-minded ways of laying it out.
// All names, dates and prices are placeholders of the prototype.
window.Info2 = (() => {
  const DATES = [
    ['sob. 14.11.2026', 'Pierwszy oddech', 'Basen, Gdynia', '2 wolne miejsca', '390 zł'],
    ['sob. 28.11.2026', 'Pierwszy oddech', 'Basen, Gdynia', '4 wolne miejsca', '390 zł'],
    ['sob. 12.12.2026', 'Pierwszy oddech', 'Basen, Gdynia', 'brak miejsc', '390 zł'],
    ['14–23.02.2027', 'Głębia, wyjazd', 'Dahab, Egipt', '5 wolnych miejsc', 'od 6 900 zł'],
    ['08–16.05.2027', 'Poziom 1 lub Głębia, wyjazd', 'Gozo, Malta', '6 wolnych miejsc', 'od 5 400 zł'],
    ['11–14.09.2027', 'Poziom 1, jezioro', 'Hańcza, Polska', '4 wolne miejsca', '1 450 zł'],
  ];
  const COURSES = [
    ['Pierwszy oddech', 'Bez doświadczenia. Bez certyfikatu.', '1 dzień, basen w Gdyni', '390 zł', 'Spokojne wstrzymanie oddechu, 25 m pod wodą, ratowanie partnera.'],
    ['Poziom 1: do 20 metrów', 'Po Pierwszym oddechu albo od razu, jeśli dobrze czujesz się w wodzie.', '4 dni, basen i jezioro', '1 450 zł', 'Certyfikat międzynarodowy. Nurkowanie z partnerem do 20 m.'],
    ['Poziom 2: Głębia', 'Po poziomie 1.', '6 dni, morze', '3 200 zł', 'Certyfikat międzynarodowy. Zejścia na 30–40 m.'],
  ];
  const FAQ = [
    ['Nie wstrzymam oddechu dłużej niż 30 sekund.', 'Tak zaczyna większość osób. Długość wstrzymania nie jest warunkiem udziału, tylko tym, czego się uczysz. Zaczynamy od oddychania i rozluźnienia, na sucho.'],
    ['Czy muszę dobrze pływać?', 'Wystarczy, że przepłyniesz 100 metrów bez zatrzymania, dowolnym stylem i bez limitu czasu.'],
    ['Boję się wody albo głębokości.', 'Napisz o tym przed kursem. Nie ma głębokości, którą trzeba osiągnąć, a pierwszy dzień odbywa się na basenie. Tempo ustalasz z instruktorem.'],
    ['Co z uszami?', 'To najczęstsza trudność na początku. Wyrównywania ciśnienia uczymy najpierw na lądzie, potem w płytkiej wodzie. Jeśli masz problemy z uszami lub zatokami, powiedz nam wcześniej.'],
    ['Czy to bezpieczne?', 'Bez wyszkolenia nie, główne ryzyko to utrata przytomności pod wodą. Dlatego nikt nie nurkuje sam, a ratowania partnera uczysz się już pierwszego dnia.'],
    ['Mam astmę, problemy z sercem lub ciśnieniem.', 'Przed kursem wypełniasz ankietę zdrowotną. Jeśli któryś punkt Cię dotyczy, potrzebna jest zgoda lekarza.'],
    ['Od ilu lat można się zapisać?', 'Od 15 lat. Osoby niepełnoletnie potrzebują zgody opiekuna.'],
    ['Co zabrać?', 'Strój, ręcznik, klapki, ciepłą bluzę na ćwiczenia oddechowe. Maskę, płetwy i balast pożyczamy na czas kursu.'],
  ];
  const RULES = [
    ['Nigdy sam', 'Każde zejście ma partnera na powierzchni, który patrzy tylko na Ciebie. Także na basenie.'],
    ['Oddech przed głębią', 'Najpierw spokojna statyka na sucho i na basenie, dopiero potem głębokość.'],
    ['Lina i boja', 'Na wodach otwartych zawsze trenujemy przy linie. Nikt nie zgubi kierunku.'],
    ['Mała grupa', 'Najwyżej cztery osoby na instruktora. Nikt nie czeka w kolejce i nikt się nie spieszy.'],
  ];
  const TEAM = [['Instruktorka, ratowniczka wodna, kursy dla początkujących', 'Maja Lis'], ['Instruktor poziomów 1 i 2, wyjazdy na głęboką wodę', 'Tomasz Bąk'], ['Biuro i teoria, pon.–pt. 9:00–17:00', 'Gdynia, Bulwar Nadmorski'], ['Basen', '10 minut od biura, parking na miejscu']];
  const open = d => d[3] !== 'brak miejsc';
  const term = d => `${d[0]} · ${d[1]}`;
  const faq = () => FAQ.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${f[0]}<i>+</i></summary><p>${f[1]}</p></details>`).join('');
  const dates = goto => DATES.map(d => `<div class="tm ${open(d) ? '' : 'full'}"><span class="w">${d[0]}</span><span>${d[1]}<small>${d[2]} · ${d[3]}</small></span><span class="pr">${d[4]}</span>${open(d) ? `<a class="pick" href="#zapis" data-go="${goto}" data-term="${term(d)}">Zapisz się</a>` : '<span class="pick">Brak miejsc</span>'}</div>`).join('');
  const prices = () => `<div class="pr3">${COURSES.map(c => `<article><h3>${c[0]}</h3><p>${c[2]}. ${c[1]}</p><span class="num">${c[3]}</span></article>`).join('')}</div><p class="incl">W cenie: instruktor, teoria, basen, maska, płetwy, balast i ubezpieczenie na czas zajęć.</p>`;
  const form = () => `<form class="fm"><label class="w">Termin<select name="termin">${DATES.filter(open).map(d => `<option>${term(d)}</option>`).join('')}</select></label><label>Imię i nazwisko<input name="imie" autocomplete="name" required></label><label>Telefon<input name="tel" type="tel" autocomplete="tel"></label><label class="w">E-mail<input name="mail" type="email" autocomplete="email" required></label><label class="w">Coś, o czym powinniśmy wiedzieć? (opcjonalnie)<textarea name="uwagi" rows="1"></textarea></label><button class="btn" type="submit">Wyślij zgłoszenie</button></form>`;
  const rules = () => `<div class="r4">${RULES.map(r => `<div><h3>${r[0]}</h3><p>${r[1]}</p></div>`).join('')}</div>`;
  const facts = () => `<dl class="facts"><dt>Czas</dt><dd>1 dzień, około 5 godzin</dd><dt>Gdzie</dt><dd>Basen w Gdyni</dd><dt>Wymagania</dt><dd>Przepłyniesz 100 m bez zatrzymania</dd><dt>Grupa</dt><dd>Najwyżej 4 osoby na instruktora</dd><dt>Cena</dt><dd class="num">390 zł</dd></dl>`;
  const wire = el => {
    el.querySelectorAll('[data-term]').forEach(a => a.addEventListener('click', () => { const s = el.querySelector('select[name=termin]'), o = [...s.options].find(x => x.textContent === a.dataset.term); if (o) s.value = o.value; }));
    const ds = [...el.querySelectorAll('details')];
    ds.forEach(d => d.addEventListener('toggle', () => { if (d.open) ds.forEach(x => { if (x !== d) x.open = false; }); }));
  };

  // I. Scenes: each frame answers one question. goto(i) is where scene i stands on the page
  function scenes(el, goto) {
    const Z = goto(5);
    const S = [
      ['Od czego zacząć?', 'Od jednego dnia na basenie, bez doświadczenia i bez presji na wynik.', `${facts()}<div class="acts"><a class="btn" href="#zapis" data-go="${Z}" data-term="${term(DATES[0])}">Zapisz się na 14 listopada</a><a class="link" href="#pytania" data-go="${goto(3)}">Czy dam radę?</a></div>`],
      ['Ile to kosztuje?', '', prices()],
      ['Kiedy?', '', `<div>${dates(Z)}</div>`],
      ['Czy dam radę?', '', `<div>${faq()}</div>`],
      ['Czy to bezpieczne?', 'Nie ma kursu, na którym któraś z tych zasad przestaje obowiązywać.', `${rules()}<p class="incl" style="margin-top:18px">Uczą: Maja Lis i Tomasz Bąk. Gdynia, Bulwar Nadmorski.</p>`],
      ['Zapisz się', 'Odpowiadamy w ciągu doby. Wolisz najpierw porozmawiać? <a class="link" style="font-size:inherit" href="tel:+48500000000">+48 500 000 000</a>', form()],
    ];
    el.innerHTML = S.map((s, i) => `<section class="scene" id="sc${i}"><h2>${s[0]}</h2>${s[1] ? `<p class="sub">${s[1]}</p>` : ''}<div class="body">${s[2]}</div></section>`).join('');
    wire(el);
    return [...el.querySelectorAll('.scene')];
  }

  // II. Screen and room: returns the sections' names for the strip under the screen
  function room(el) {
    el.innerHTML = `
    <section id="start"><div class="cols"><div><p class="sub" data-rv>Jeden dzień na basenie, bez doświadczenia i bez presji na wynik. Po tym dniu wiesz, czy to dla Ciebie.</p><div class="acts" data-rv><a class="btn" href="#zapis" data-go="#zapis" data-term="${term(DATES[0])}">Zapisz się na 14 listopada</a><a class="link" href="#pytania" data-go="#pytania">Czy dam radę?</a></div></div><div data-rv>${facts()}</div></div></section>
    <section id="kursy"><div data-rv>${prices()}</div></section>
    <section id="terminy"><div data-rv>${dates('#zapis')}</div></section>
    <section id="pytania"><div data-rv>${faq()}</div></section>
    <section id="zasady"><div data-rv>${rules()}</div><p class="incl" data-rv style="margin-top:22px">Uczą: Maja Lis i Tomasz Bąk. Gdynia, Bulwar Nadmorski, pon.–pt. 9:00–17:00.</p></section>
    <section id="zapis"><div class="cols"><div data-rv>${form()}</div><div data-rv><p class="sub">Odpowiadamy w ciągu doby. Jeśli boisz się wody, napisz o tym wprost. To bardzo dobry początek.</p><p class="sub" style="margin-top:18px"><a class="link" href="tel:+48500000000" style="font-size:inherit">+48 500 000 000</a> &nbsp; <a class="link" href="mailto:hej@slowdescent.pl" style="font-size:inherit">hej@slowdescent.pl</a></p></div></div></section>
    <footer class="meta" style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 36px;padding:18px 0;border-top:1px solid var(--line)"><span>Slow Descent, szkoła freedivingu, Gdynia</span><a href="#">Regulamin</a><a href="#">Instagram</a><a href="#" data-go="0">Do góry</a></footer>`;
    wire(el);
    return [['start', 'Pierwszy raz? Zacznij od basenu.'], ['kursy', 'Kursy i ceny'], ['terminy', 'Najbliższe terminy'], ['pytania', 'Czy dam radę?'], ['zasady', 'Zasady bezpieczeństwa'], ['zapis', 'Zapisz się']];
  }

  // III. End credits: one axis; what on the left, who or how much on the right; questions set like dialogue in a script
  function credits(el) {
    el.innerHTML = `
    <section id="start"><h2 data-rv="lines">Pierwszy raz?</h2><p class="note" data-rv>Zacznij od jednego dnia na basenie.</p><div class="roll">
      <div class="cr" data-rv><span>Kurs</span><span>Pierwszy oddech</span></div><div class="cr" data-rv><span>Czas</span><span>1 dzień, około 5 godzin</span></div><div class="cr" data-rv><span>Gdzie</span><span>Basen w Gdyni</span></div><div class="cr" data-rv><span>Wymagania</span><span>Przepłyniesz 100 m bez zatrzymania</span></div><div class="cr" data-rv><span>Grupa</span><span>Najwyżej 4 osoby na instruktora</span></div><div class="cr" data-rv><span>Cena</span><span class="num">390 zł</span></div>
      <div class="cr" data-rv><span></span><a class="btn" style="justify-self:start;margin-top:12px" href="#zapis" data-go="#zapis" data-term="${term(DATES[0])}">Zapisz się na 14 listopada</a></div></div></section>
    <section id="kursy"><h2 data-rv="lines">Kursy i ceny</h2><div class="roll">${COURSES.map(c => `<div class="cr big" data-rv><span>${c[2]}<br>${c[1]}</span><span>${c[0]}<small>${c[4]}</small><small class="num" style="font-size:18px;margin-top:6px">${c[3]}</small></span></div>`).join('')}</div><p class="note" data-rv>W cenie: instruktor, teoria, basen, maska, płetwy, balast i ubezpieczenie na czas zajęć.</p></section>
    <section id="terminy"><h2 data-rv="lines">Najbliższe terminy</h2><div class="roll">${DATES.map(d => `<div class="cr big" data-rv><span>${d[0]}<br>${d[3]}</span><span>${d[1]}<small>${d[2]} · ${d[4]}</small>${open(d) ? `<a class="pick" style="display:inline-block;margin-top:8px;letter-spacing:0" href="#zapis" data-go="#zapis" data-term="${term(d)}">Zapisz się</a>` : ''}</span></div>`).join('')}</div></section>
    <section id="pytania"><h2 data-rv="lines">Czy dam radę?</h2><div class="roll">${FAQ.map(f => `<div class="sp" data-rv><h3>${f[0]}</h3><p>${f[1]}</p></div>`).join('')}</div></section>
    <section id="zasady"><h2 data-rv="lines">Zasady bezpieczeństwa</h2><div class="roll">${RULES.map(r => `<div class="cr" data-rv><span>${r[0]}</span><span>${r[1]}</span></div>`).join('')}</div></section>
    <section id="kto"><h2 data-rv="lines">Kto uczy i gdzie</h2><div class="roll">${TEAM.map(t => `<div class="cr" data-rv><span>${t[0]}</span><span>${t[1]}</span></div>`).join('')}</div></section>
    <section id="zapis"><h2 data-rv="lines">Zapisz się</h2><p class="note" data-rv>Odpowiadamy w ciągu doby. Jeśli boisz się wody, napisz o tym wprost. To bardzo dobry początek.</p><div data-rv>${form()}</div><p class="note" data-rv style="margin-top:32px"><a class="link" href="tel:+48500000000" style="font-size:inherit">+48 500 000 000</a> &nbsp; <a class="link" href="mailto:hej@slowdescent.pl" style="font-size:inherit">hej@slowdescent.pl</a></p></section>
    <div class="finale"><b data-rv>Slow Descent</b><span data-rv>Szkoła freedivingu, Gdynia</span></div>
    <footer class="foot meta" style="margin:0 calc(var(--g)*-1)"><span>Regulamin</span><a href="#">Instagram</a><a href="#">YouTube</a><a href="#" data-go="0">Do góry</a></footer>`;
    wire(el);
  }
  return { scenes, room, credits };
})();
