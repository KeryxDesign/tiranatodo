/* ══════════════════════════════════════════════════════════════════
   TiranaToDo — mockup: costruisce la lista e riempie il dettaglio
   ──────────────────────────────────────────────────────────────────
   Legge window.TE_EVENTS (eventi.js) e disegna le card. I filtri
   filtrano davvero, e stanno nell'URL come previsto dal piano (§5):
   ?date=anytime|today|tomorrow|weekend  ?cat=music,art  ?q=jazz

   ⛔ NON e' il codice del sito vero. Il sito vero e' Astro + Supabase
   e lo costruisce la sessione descritta in PLAN.md. Questo file serve
   solo a far vedere e provare il comportamento.

   ⏳ DA RATIFICARE DA LORI:
     1. il formato della data nella card (funzione fmtCardDate)
     2. il chip «Anytime» in testa alla riga delle date: e' lo stesso
        schema del chip «All» che lei ha gia' messo in testa alle
        categorie, non un modello nuovo
     3. la forma del segno «Picked by us» (§7 del piano), qui non
        ancora disegnato
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function midnight(dt) {
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  }

  /* la data reale dell'evento: oggi + i giorni scritti nel dato */
  function dateOf(ev) {
    var d = midnight(new Date());
    d.setDate(d.getDate() + ev.d);
    return d;
  }

  var sh = function (dt) { return DAYS[dt.getDay()].slice(0, 3); };
  var smon = function (dt) { return MONTHS[dt.getMonth()].slice(0, 3); };

  /* ⏳ Formato della data nella card. Un posto solo: se LORI ne vuole
     un altro, si cambia qui e cambia in tutte le card insieme. */
  function fmtCardDate(ev) {
    var dt = dateOf(ev);
    return sh(dt) + ' ' + dt.getDate() + ' ' + smon(dt) + ' · ' + ev.time;
  }

  function fmtGroupTitle(ev) {
    var dt = dateOf(ev);
    var tail = sh(dt) + ' ' + dt.getDate() + ' ' + smon(dt);
    if (ev.d === 0) { return 'Today · ' + tail; }
    if (ev.d === 1) { return 'Tomorrow · ' + tail; }
    return DAYS[dt.getDay()] + ' ' + dt.getDate() + ' ' + smon(dt);
  }

  function fmtDetailDate(ev) {
    var dt = dateOf(ev);
    return DAYS[dt.getDay()] + ' ' + dt.getDate() + ' ' + MONTHS[dt.getMonth()] +
           ', ' + ev.time + (ev.end ? ' – ' + ev.end : '');
  }

  function isWeekend(ev) {
    var g = dateOf(ev).getDay();
    return g === 6 || g === 0;
  }

  function photoOf(ev) {
    var key = window.TE_CAT_PHOTO[ev.cat] || 'art';
    return window.TE_PHOTOS[key];
  }

  function priceHtml(ev) {
    return ev.price === 0
      ? '<span class="te-badge te-badge--free">Free</span>'
      : '<span class="te-card__price">' + ev.price + ' L</span>';
  }

  var IC_CLOCK = '<svg class="te-ic te-ic--s" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
  var IC_PIN = '<svg class="te-ic te-ic--s" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
  var IC_STAR = '<svg class="te-ic te-ic--s" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';

  function href(ev) { return './dettaglio-evento.html?e=' + encodeURIComponent(ev.slug); }

  function featuredHtml(ev) {
    var ph = photoOf(ev);
    return '<a class="te-card te-card--featured" href="' + href(ev) + '" data-cat="' + ev.cat + '">' +
      '<div class="te-card__media">' +
        '<img src="' + window.TE_IMG_BASE + ph.file + '" width="700" height="438" decoding="async" alt="' + esc(ph.alt) + '">' +
        '<div class="te-card__over">' +
          '<span class="te-tag te-badge--on-image"><i class="te-dot"></i>' + window.TE_CAT_LABEL[ev.cat] + '</span>' +
          '<span class="te-badge te-badge--featured te-badge--on-image">' + IC_STAR + 'Featured</span>' +
        '</div>' +
      '</div>' +
      '<div class="te-card__body">' +
        '<p class="te-card__date">' + IC_CLOCK + fmtCardDate(ev) + '</p>' +
        '<h2 class="te-card__title">' + esc(ev.title) + '</h2>' +
        '<p class="te-card__place">' + IC_PIN + '<span>' + esc(ev.venue + ', ' + ev.area) + '</span></p>' +
        '<div class="te-card__foot">' + priceHtml(ev) + '</div>' +
      '</div></a>';
  }

  function cardHtml(ev) {
    var ph = photoOf(ev);
    return '<a class="te-card te-card--list" href="' + href(ev) + '" data-cat="' + ev.cat + '">' +
      '<div class="te-card__media"><img src="' + window.TE_IMG_BASE + ph.file + '" width="700" height="438" loading="lazy" decoding="async" alt="' + esc(ph.alt) + '"></div>' +
      '<div class="te-card__body">' +
        '<p class="te-card__date">' + fmtCardDate(ev) +
          ' · <span class="te-tag" style="min-height:24px;padding:0 var(--te-sp-2)"><i class="te-dot"></i>' + window.TE_CAT_LABEL[ev.cat] + '</span></p>' +
        '<h3 class="te-card__title">' + esc(ev.title) + '</h3>' +
        '<p class="te-card__place"><span>' + esc(ev.venue + ', ' + ev.area) + '</span></p>' +
        '<div class="te-card__foot">' + priceHtml(ev) + '</div>' +
      '</div></a>';
  }

  /* ── stato, letto e scritto nell'URL ───────────────────────────── */
  function readState() {
    var p = new URLSearchParams(location.search);
    var cat = (p.get('cat') || '').split(',').filter(function (x) { return x; });
    return { date: p.get('date') || 'anytime', cats: cat, q: (p.get('q') || '').trim() };
  }

  function writeState(st) {
    var p = new URLSearchParams();
    if (st.date !== 'anytime') { p.set('date', st.date); }
    if (st.cats.length) { p.set('cat', st.cats.join(',')); }
    if (st.q) { p.set('q', st.q); }
    var q = p.toString();
    history.replaceState(null, '', location.pathname + (q ? '?' + q : ''));
  }

  function matches(ev, st) {
    if (st.date === 'today' && ev.d !== 0) { return false; }
    if (st.date === 'tomorrow' && ev.d !== 1) { return false; }
    if (st.date === 'weekend' && !isWeekend(ev)) { return false; }
    if (st.cats.length && st.cats.indexOf(ev.cat) < 0) { return false; }
    if (st.q) {
      var hay = (ev.title + ' ' + ev.venue + ' ' + ev.area + ' ' + ev.organizer).toLowerCase();
      if (hay.indexOf(st.q.toLowerCase()) < 0) { return false; }
    }
    return true;
  }

  /* ── lista ─────────────────────────────────────────────────────── */
  function renderList() {
    var host = document.querySelector('[data-events]');
    if (!host) { return; }
    var st = readState();
    var all = window.TE_EVENTS.slice().sort(function (a, b) {
      return (a.d - b.d) || a.time.localeCompare(b.time);
    });
    var hits = all.filter(function (ev) { return matches(ev, st); });

    var html = '';
    var feat = hits.filter(function (e) { return e.featured; })[0];
    if (feat) {
      html += '<section class="te-pad te-pad-t" aria-label="Featured event">' + featuredHtml(feat) + '</section>';
    }
    var rest = hits.filter(function (e) { return e !== feat; });
    var lastDay = null;
    rest.forEach(function (ev, i) {
      if (ev.d !== lastDay) {
        if (lastDay !== null) { html += '</div></section>'; }
        html += '<section class="te-group"><h2 class="te-group__title">' + fmtGroupTitle(ev) +
                '</h2><div class="te-list--cols te-pad">';
        lastDay = ev.d;
      }
      html += cardHtml(ev);
      if (i === rest.length - 1) { html += '</div></section>'; }
    });
    host.innerHTML = html;

    /* stato vuoto e contatore */
    var empty = document.querySelector('[data-empty]');
    if (empty) { empty.hidden = hits.length > 0; }
    host.hidden = hits.length === 0;

    var count = document.querySelector('[data-count]');
    if (count) {
      count.textContent = hits.length === 1 ? '1 event' : hits.length + ' events';
    }
    var span = document.querySelector('[data-range]');
    if (span) { span.textContent = rangeLabel(st, hits); }
    writeState(st);
  }

  function rangeLabel(st, hits) {
    if (!hits.length) { return ''; }
    if (st.date === 'today') { return ' · today'; }
    if (st.date === 'tomorrow') { return ' · tomorrow'; }
    if (st.date === 'weekend') { return ' · this weekend'; }
    var a = dateOf(hits[0]), b = dateOf(hits[hits.length - 1]);
    return ' · ' + sh(a) + ' ' + a.getDate() + ' – ' + sh(b) + ' ' + b.getDate() + ' ' + smon(b);
  }

  /* ── chip: data = scelta singola, categorie = piu' scelte con «All» ── */
  function press(btn, on) {
    if (on) { btn.classList.add('is-active'); } else { btn.classList.remove('is-active'); }
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function wireFilters() {
    var st = readState();

    var dateRow = document.querySelector('[data-filter="date"]');
    if (dateRow) {
      var dchips = dateRow.querySelectorAll('.te-chip[data-date]');
      Array.prototype.forEach.call(dchips, function (c) {
        press(c, c.getAttribute('data-date') === st.date);
        c.addEventListener('click', function () {
          var s = readState();
          s.date = c.getAttribute('data-date');
          writeState(s);
          Array.prototype.forEach.call(dchips, function (x) { press(x, x === c); });
          renderList();
        });
      });
    }

    var catRow = document.querySelector('[data-filter="cat"]');
    if (catRow) {
      var cchips = catRow.querySelectorAll('.te-chip[data-cat-key]');
      var syncCats = function () {
        var s = readState();
        Array.prototype.forEach.call(cchips, function (c) {
          var k = c.getAttribute('data-cat-key');
          press(c, k === 'all' ? s.cats.length === 0 : s.cats.indexOf(k) >= 0);
        });
      };
      syncCats();
      Array.prototype.forEach.call(cchips, function (c) {
        c.addEventListener('click', function () {
          var s = readState(), k = c.getAttribute('data-cat-key');
          if (k === 'all') {
            s.cats = [];
          } else {
            var i = s.cats.indexOf(k);
            if (i >= 0) { s.cats.splice(i, 1); } else { s.cats.push(k); }
          }
          writeState(s);
          syncCats();
          renderList();
        });
      });
    }

    var q = document.querySelector('[data-search]');
    if (q) {
      q.value = st.q;
      q.addEventListener('input', function () {
        var s = readState(); s.q = q.value.trim(); writeState(s); renderList();
      });
    }

    var clear = document.querySelector('[data-clear]');
    if (clear) {
      clear.addEventListener('click', function () {
        history.replaceState(null, '', location.pathname);
        wireFilters(); renderList();
      });
    }
  }

  /* ── dettaglio ─────────────────────────────────────────────────── */
  function forcedState() {
    return new URLSearchParams(location.search).get('state');
  }

  function renderDetail() {
    var root = document.querySelector('[data-detail]');
    if (!root) { return; }
    var slug = new URLSearchParams(location.search).get('e');
    var ev = window.TE_EVENTS.filter(function (x) { return x.slug === slug; })[0] || window.TE_EVENTS[0];
    var ph = photoOf(ev);

    var set = function (sel, html) {
      var n = document.querySelector(sel);
      if (n) { n.innerHTML = html; }
    };
    set('[data-d-title]', esc(ev.title));
    set('[data-d-cat]', '<i class="te-dot"></i>' + window.TE_CAT_LABEL[ev.cat]);
    set('[data-d-when]', fmtDetailDate(ev));
    set('[data-d-when-sub]', esc(ev.note || ''));
    set('[data-d-venue]', esc(ev.venue));
    set('[data-d-address]', esc(ev.address) + ' · <a href="#">Open in Maps</a>');
    set('[data-d-organizer]', esc(ev.organizer));
    set('[data-d-about]', ev.about.map(function (p, i) {
      return '<p class="te-body"' + (i ? ' style="margin-top:var(--te-sp-3)"' : ' style="margin-top:var(--te-sp-2)"') + '>' + esc(p) + '</p>';
    }).join(''));

    var hero = document.querySelector('[data-d-hero]');
    if (hero) {
      hero.setAttribute('data-cat', ev.cat);
      var img = hero.querySelector('img');
      if (img) { img.src = window.TE_IMG_BASE + ph.file; img.alt = ph.alt; }
    }
    var fill = function (sel, list) {
      var n = document.querySelector(sel);
      if (n) { n.innerHTML = list.map(cardHtml).join(''); }
    };
    var free = ev.price === 0;
    document.querySelectorAll('[data-show]').forEach(function (n) {
      var want = n.getAttribute('data-show').split(' ');
      var state = free ? 'free' : 'normal';
      if (forcedState()) { state = forcedState(); }
      n.hidden = want.indexOf(state) < 0;
    });
    set('[data-d-price]', free ? 'Free entry' : ev.price + ' L');
    set('[data-d-sticky-price]', free ? 'Free' : ev.price + ' L');

    /* i bottoni che non hanno senso su un evento finito */
    document.querySelectorAll('[data-off-when="past"]').forEach(function (n) {
      if (forcedState() === 'past') { n.setAttribute('disabled', 'disabled'); }
    });

    /* correlati: stessa categoria, poi stesso giorno. Max due per riga. */
    var others = window.TE_EVENTS.filter(function (x) { return x.slug !== ev.slug; });
    fill('[data-related]', others.filter(function (x) { return x.cat === ev.cat; }).slice(0, 2));
    set('[data-related-title]', 'More in ' + window.TE_CAT_LABEL[ev.cat]);
    var same = others.filter(function (x) { return x.d === ev.d; }).slice(0, 2);
    fill('[data-sameday]', same);
    var sdt = document.querySelector('[data-sameday-title]');
    var sds = document.querySelector('[data-sameday]');
    if (sdt) { sdt.textContent = 'Same day · ' + fmtGroupTitle(ev).replace(/^[^·]+· /, ''); }
    if (sds && !same.length && sdt) { sdt.hidden = true; }

    document.title = ev.title + ' · TiranaToDo';
  }

  function boot() { wireFilters(); renderList(); renderDetail(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
