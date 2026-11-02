// The information after the film, the same in every version: what someone looking for their first course needs, plainly.
// Order follows what they ask: can I do this, what does it cost, when, is it safe, who teaches, how do I sign up.
window.Info = {
  render(el) {
    const DATES = [
      ['sob. 14.11.2026', 'Pierwszy oddech', 'Basen, Gdynia', '2 wolne miejsca', '390 zł'],
      ['sob. 28.11.2026', 'Pierwszy oddech', 'Basen, Gdynia', '4 wolne miejsca', '390 zł'],
      ['sob. 12.12.2026', 'Pierwszy oddech', 'Basen, Gdynia', 'brak miejsc', '390 zł'],
      ['14–23.02.2027', 'Głębia, wyjazd', 'Dahab, Egipt', '5 wolnych miejsc', 'od 6 900 zł'],
      ['08–16.05.2027', 'Poziom 1 lub Głębia, wyjazd', 'Gozo, Malta', '6 wolnych miejsc', 'od 5 400 zł'],
      ['11–14.09.2027', 'Poziom 1, jezioro', 'Hańcza, Polska', '4 wolne miejsca', '1 450 zł'],
    ];
    const FAQ = [
      ['Nie wstrzymam oddechu dłużej niż 30 sekund. Czy to problem?', 'Nie. Tak zaczyna większość osób. Długość wstrzymania nie jest warunkiem udziału, tylko tym, czego się uczysz. Zaczynamy od oddychania i rozluźnienia, na sucho.'],
      ['Czy muszę dobrze pływać?', 'Wystarczy, że przepłyniesz 100 metrów bez zatrzymania, dowolnym stylem i bez limitu czasu. Nie trzeba być sportowcem.'],
      ['Boję się wody albo głębokości.', 'Napisz o tym przed kursem. Nie ma głębokości, którą trzeba osiągnąć, a pierwszy dzień odbywa się na basenie. Tempo ustalasz razem z instruktorem.'],
      ['Co z uszami?', 'To najczęstsza trudność na początku. Wyrównywania ciśnienia uczymy najpierw na lądzie, potem w płytkiej wodzie. Jeśli masz problemy z uszami lub zatokami, powiedz nam wcześniej.'],
      ['Czy to bezpieczne?', 'Freediving bez wyszkolenia jest niebezpieczny, a głównym ryzykiem jest utrata przytomności pod wodą. Dlatego nikt nie nurkuje sam: każde zejście ma partnera, a na wodach otwartych także linę i boję. Ratowania partnera uczysz się już pierwszego dnia.'],
      ['Mam astmę, problemy z sercem lub ciśnieniem. Czy mogę?', 'Przed kursem wypełniasz ankietę zdrowotną. Jeśli któryś punkt Cię dotyczy, potrzebna jest zgoda lekarza.'],
      ['Od ilu lat można się zapisać?', 'Od 15 lat. Osoby niepełnoletnie potrzebują zgody opiekuna.'],
      ['Co się stanie, gdy nie zaliczę wszystkich ćwiczeń?', 'Dokończysz je na kolejnych zajęciach, bez dodatkowej opłaty. Certyfikat daje poziom 1. Pierwszy oddech kończy się bez egzaminu.'],
    ];
    el.innerHTML = `
    <section id="start">
      <div class="first">
        <div>
          <h2 data-rv="lines">Pierwszy raz?<br>Zacznij od jednego dnia na basenie.</h2>
          <p class="lead2" data-rv>Bez doświadczenia, bez sprzętu i bez presji na wynik. Po tym dniu wiesz, czy to dla Ciebie.</p>
          <div class="acts" data-rv><a class="btn" href="#zapis" data-go="#zapis" data-term="sob. 14.11.2026 · Pierwszy oddech">Zapisz się na 14 listopada</a><a class="ghost" href="#pytania" data-go="#pytania">Czy dam radę?</a></div>
        </div>
        <dl data-rv>
          <dt>Kurs</dt><dd>Pierwszy oddech</dd>
          <dt>Czas</dt><dd>1 dzień, około 5 godzin</dd>
          <dt>Gdzie</dt><dd>Basen w Gdyni</dd>
          <dt>Wymagania</dt><dd>Przepłyniesz 100 m bez zatrzymania</dd>
          <dt>Grupa</dt><dd>Najwyżej 4 osoby na instruktora</dd>
          <dt>Cena</dt><dd class="price">390 zł</dd>
        </dl>
      </div>
    </section>

    <section id="kursy">
      <h2 data-rv="lines">Kursy i ceny</h2>
      <div class="courses" data-rv>
        <div class="cr head meta"><span>Kurs</span><span>Dla kogo</span><span>Czas</span><span>Gdzie</span><span>Co umiesz po kursie</span><span class="price">Cena</span></div>
        <div class="cr"><h3>Pierwszy oddech</h3><p>Nigdy nie nurkowało się na wstrzymanym oddechu</p><p>1 dzień</p><p>Basen, Gdynia</p><p>Spokojne wstrzymanie oddechu, 25 m pod wodą, ratowanie partnera. Bez certyfikatu</p><span class="price">390 zł</span></div>
        <div class="cr"><h3>Poziom 1: do 20 metrów</h3><p>Po Pierwszym oddechu albo od razu, jeśli dobrze czujesz się w wodzie</p><p>4 dni</p><p>Basen i jezioro</p><p>Certyfikat międzynarodowy. Nurkowanie z partnerem do 20 m</p><span class="price">1 450 zł</span></div>
        <div class="cr"><h3>Poziom 2: Głębia</h3><p>Po poziomie 1</p><p>6 dni</p><p>Morze: Dahab, Gozo</p><p>Certyfikat międzynarodowy. Zejścia na 30–40 m</p><span class="price">3 200 zł</span></div>
      </div>
      <div class="twice">
        <div data-rv><h3>Co jest w cenie</h3><ul><li>Instruktor i zajęcia teoretyczne</li><li>Wstęp na basen</li><li>Maska, płetwy i balast na czas kursu</li><li>Ubezpieczenie na czas zajęć</li></ul></div>
        <div data-rv><h3>Co zabrać</h3><ul><li>Strój kąpielowy, ręcznik, klapki</li><li>Ciepłą bluzę na ćwiczenia oddechowe</li><li>Wypełnioną ankietę zdrowotną</li><li>Na wodach otwartych: piankę możesz wypożyczyć u nas</li></ul></div>
      </div>
    </section>

    <section id="terminy">
      <h2 data-rv="lines">Najbliższe terminy</h2>
      <div class="dates" data-rv>
        ${DATES.map(d => `<div class="dt ${d[3] === 'brak miejsc' ? 'full' : ''}"><span class="when">${d[0]}</span><span>${d[1]}</span><span>${d[2]}</span><span class="left">${d[3]}</span><span class="pr">${d[4]}</span>${d[3] === 'brak miejsc' ? '<span class="go2">Brak miejsc</span>' : `<a class="go2" href="#zapis" data-go="#zapis" data-term="${d[0]} · ${d[1]}">Zapisz się</a>`}</div>`).join('')}
      </div>
    </section>

    <section id="pytania">
      <div class="qa">
        <h2 data-rv="lines">Czy dam radę?</h2>
        <div data-rv>${FAQ.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${f[0]}<i>+</i></summary><p>${f[1]}</p></details>`).join('')}</div>
      </div>
    </section>

    <section id="zasady">
      <h2 data-rv="lines">Zasady bezpieczeństwa</h2>
      <div class="rules4">
        <div data-rv><h3>Nigdy sam</h3><p>Każde zejście ma partnera na powierzchni, który patrzy tylko na Ciebie. Także na basenie.</p></div>
        <div data-rv><h3>Oddech przed głębią</h3><p>Najpierw spokojna statyka na sucho i na basenie, dopiero potem głębokość.</p></div>
        <div data-rv><h3>Lina i boja</h3><p>Na wodach otwartych zawsze trenujemy przy linie. Nikt nie zgubi kierunku.</p></div>
        <div data-rv><h3>Mała grupa</h3><p>Najwyżej cztery osoby na instruktora. Nikt nie czeka w kolejce i nikt się nie spieszy.</p></div>
      </div>
    </section>

    <section id="kto">
      <h2 data-rv="lines">Kto uczy i gdzie</h2>
      <div class="who">
        <div data-rv><h3>Maja Lis</h3><p>Instruktorka freedivingu i ratowniczka wodna. Prowadzi kursy dla początkujących.</p></div>
        <div data-rv><h3>Tomasz Bąk</h3><p>Instruktor poziomów 1 i 2, prowadzi wyjazdy na głęboką wodę.</p></div>
        <div data-rv><h3>Gdynia, Bulwar Nadmorski</h3><p>Biuro i zajęcia teoretyczne. Basen: 10 minut od biura, parking na miejscu. Poniedziałek–piątek 9:00–17:00.</p></div>
      </div>
    </section>

    <section id="zapis">
      <div class="book">
        <div>
          <h2 data-rv="lines">Zapisz się</h2>
          <p class="lead2" data-rv>Odpowiadamy w ciągu doby. Jeśli boisz się wody, napisz o tym wprost. To bardzo dobry początek.</p>
          <p class="contactline" data-rv>Wolisz najpierw porozmawiać?<br><a href="tel:+48500000000">+48 500 000 000</a></p>
          <p class="contactline" data-rv><a href="mailto:hej@slowdescent.pl">hej@slowdescent.pl</a></p>
        </div>
        <form data-rv>
          <label class="w">Termin<select name="termin">${DATES.filter(d => d[3] !== 'brak miejsc').map(d => `<option>${d[0]} · ${d[1]}</option>`).join('')}</select></label>
          <label>Imię i nazwisko<input name="imie" autocomplete="name" required></label>
          <label>Telefon<input name="tel" type="tel" autocomplete="tel"></label>
          <label class="w">E-mail<input name="mail" type="email" autocomplete="email" required></label>
          <label class="w">Coś, o czym powinniśmy wiedzieć? (opcjonalnie)<textarea name="uwagi" rows="2"></textarea></label>
          <button class="btn" type="submit">Wyślij zgłoszenie</button>
        </form>
      </div>
    </section>
    <div class="band" aria-hidden="true"><video muted playsinline loop preload="none"></video></div>
    <footer class="foot meta"><span>Slow Descent, szkoła freedivingu, Gdynia</span><a href="#">Regulamin</a><a href="#">Instagram</a><a href="#">YouTube</a><a href="#" data-go="0">Do góry</a></footer>`;
    // a date chosen anywhere arrives selected in the form
    el.querySelectorAll('[data-term]').forEach(a => a.addEventListener('click', () => { const s = el.querySelector('select[name=termin]'), o = [...s.options].find(x => x.textContent === a.dataset.term); if (o) s.value = o.value; }));
    // one open question at a time, so the list stays short
    const ds = [...el.querySelectorAll('details')];
    ds.forEach(d => d.addEventListener('toggle', () => { if (d.open) ds.forEach(x => { if (x !== d) x.open = false; }); }));
    const v = el.querySelector('.band video');
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { v.src = el.dataset.base + 'col-surface.mp4'; v.play().catch(() => {}); o.disconnect(); } }, { rootMargin: '30% 0px' }).observe(v);
  },
};
