/* TiranaToDo — questionario a passi, pagina «Send us your event».
   Progetto: LORI 05/09/2026 · la meccanica la ratifica SENTINEL
   (criteri/meccanica_componenti.md). Nessuna rete, nessun dato salvato:
   tutto sta nella pagina e finisce dentro un mailto.

   Le tre regole di comportamento che vengono dal progetto:
   1) «Next» non e' mai spento. Un bottone disabilitato senza spiegazione
      e' un vicolo cieco: si preme, si controlla, e se manca qualcosa si
      dice quale riga e ci si va sopra.
   2) Un campo che non serve non si vede: TIME_START sparisce se l'evento
      dura tutto il giorno, PRICE se e' gratis. Sparito, non e' obbligatorio.
   3) La mail si compone con i valori veri, senza segnaposto e senza le
      due righe «#»: quelle servivano a chi copiava il modello a mano.
      Le 19 righe restano tutte, in ordine, anche quelle vuote (SOP §2.2). */

(function () {
  /* Le righe erano 19 (SOP §2.2). Ora sono 21: MAPS_URL sta dopo ADDRESS,
     LANGUAGE_OTHER dopo LANGUAGE. CATEGORY e LANGUAGE possono portare piu'
     valori, separati da virgola e spazio.
     DA CHIEDERE A OPS: la SOP fissa 19 righe con un valore solo per
     CATEGORY e LANGUAGE, e il controllo §4.3 rimbalzerebbe un evento che
     questa pagina permette di compilare. Il separatore qui e' scelto, non
     ratificato. */
  var FIELDS = ['TITLE','CATEGORY','DATE_START','TIME_START','DATE_END','TIME_END',
    'ALL_DAY','VENUE_NAME','ADDRESS','MAPS_URL','IS_FREE','PRICE','TICKET_URL',
    'DESCRIPTION','PHOTO','ORGANIZER_NAME','ORGANIZER_EMAIL','ORGANIZER_PHONE',
    'LANGUAGE','LANGUAGE_OTHER','CONSENT'];
  var SEP = ', ';

  var ERR = {
    text:   'Please write something here.',
    date:   'Please pick a date.',
    time:   'Please pick a time.',
    choice: 'Please pick one of the options.',
    email:  'Please write a valid email, like name@mail.com.',
    number: 'Please write the price as a number, like 500.',
    TIME_START: 'Please pick a time, or say it lasts all day.',
    'choice-multi': 'Please pick at least one option.',
    CATEGORY: 'Please pick at least one category.',
    url: 'Please paste a link that starts with https.',
    partial: 'Please pick both hours and minutes.',
    consent: 'Please tick the box, or we cannot publish it.'
  };
  var STEPS = 7, LAST_Q = 6, MAIL_TO = 'events@tiranatodo.com';

  var doc = document, cur = 1, answers = {};
  var panels = [].slice.call(doc.querySelectorAll('[data-step]'));
  var bar = doc.getElementById('bar'), fill = doc.getElementById('fill'),
      count = doc.getElementById('count'), nav = doc.querySelector('.te-wiz__nav'),
      btnNext = doc.getElementById('next'), btnBack = doc.getElementById('back'),
      intro = doc.getElementById('intro');

  function panel(n) { return panels[n - 1]; }
  function fieldsOf(n) { return [].slice.call(panel(n).querySelectorAll('.te-field')); }
  function val(name) {
    if (answers[name] !== undefined) return answers[name];
    var el = doc.querySelector('[name="' + name + '"]');
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked ? 'YES' : '';
    return (el.value || '').trim();
  }

  /* — scelta multipla: categorie e lingue —
     Le regole sono tre e le fa la macchina, non la persona: si accende e
     si spegne premendo, oltre il tetto le altre voci si spengono ma
     restano visibili, e una voce dichiarata esclusiva («Other») svuota
     le altre e viene svuotata da loro. «Other» insieme a «Music» sarebbe
     un dato che non vuol dire niente. */
  var CHECK = '<svg class="te-ic te-ic--s te-chip__ic" viewBox="0 0 24 24" ' +
    'aria-hidden="true"><path d="m5 13 4 4L19 7"></path></svg>';

  function picked(group) {
    return [].slice.call(group.querySelectorAll('[aria-pressed="true"]'))
      .map(function (o) { return o.getAttribute('data-value'); });
  }
  function paintMulti(group) {
    var excl = group.getAttribute('data-exclusive'),
        max = parseInt(group.getAttribute('data-max'), 10) || 0,
        list = [].slice.call(group.querySelectorAll('[data-value]')),
        on = picked(group), full = max && on.length >= max;
    list.forEach(function (o) {
      var yes = o.getAttribute('aria-pressed') === 'true';
      o.classList.toggle('is-picked', yes);
      /* l'icona di categoria lascia il posto alla spunta: acceso e spento
         si distinguono anche senza colore, che e' la prova del bianco e nero */
      var ic = o.querySelector('.te-chip__ic');
      if (ic) {
        if (yes && !o.hasAttribute('data-ic')) {
          o.setAttribute('data-ic', ic.outerHTML);
          ic.outerHTML = CHECK;
        } else if (!yes && o.hasAttribute('data-ic')) {
          o.querySelector('.te-chip__ic').outerHTML = o.getAttribute('data-ic');
          o.removeAttribute('data-ic');
        }
      } else {
        /* le lingue non hanno un'icona da sostituire: la spunta si aggiunge
           e si toglie, se no restano due riempimenti pallidi indistinguibili
           per chi non vede il colore. */
        var mark = o.querySelector('.te-mark');
        if (yes && !mark) o.insertAdjacentHTML('afterbegin', CHECK.replace('te-chip__ic', 'te-mark'));
        if (!yes && mark) mark.remove();
      }
      /* il tetto non spegne mai la voce esclusiva: e' quella che svuota le
         altre, e lasciarla spenta a tetto pieno chiude una strada aperta. */
      if (full && !yes && o.getAttribute('data-value') !== excl) {
        o.setAttribute('aria-disabled', 'true');
      } else { o.removeAttribute('aria-disabled'); }
    });
    answers[group.getAttribute('data-choice-multi')] = on.join(SEP);
  }

  [].slice.call(doc.querySelectorAll('[data-choice-multi]')).forEach(function (group) {
    var excl = group.getAttribute('data-exclusive'),
        max = parseInt(group.getAttribute('data-max'), 10) || 0;
    group.addEventListener('click', function (e) {
      var opt = e.target.closest('[data-value]');
      if (!opt || !group.contains(opt)) return;
      var was = opt.getAttribute('aria-pressed') === 'true',
          v = opt.getAttribute('data-value');
      if (!was && !opt.hasAttribute('aria-disabled')) {
        if (excl && v === excl) {
          [].slice.call(group.querySelectorAll('[data-value]')).forEach(function (o) {
            o.setAttribute('aria-pressed', 'false');
          });
        } else if (excl) {
          var e2 = group.querySelector('[data-value="' + excl + '"]');
          if (e2) e2.setAttribute('aria-pressed', 'false');
        }
        opt.setAttribute('aria-pressed', 'true');
      } else if (was) {
        opt.setAttribute('aria-pressed', 'false');
      }
      paintMulti(group);
      clearError(opt.closest('.te-field'));
      sync();
    });
    paintMulti(group);
  });

  /* — orario: due menu, e valgono solo se sono pieni tutti e due — */
  [].slice.call(doc.querySelectorAll('[data-time]')).forEach(function (grp) {
    var name = grp.getAttribute('data-time');
    function read() {
      var h = grp.querySelector('[data-part="h"]').value,
          m = grp.querySelector('[data-part="m"]').value;
      answers[name] = (h && m) ? h + ':' + m : '';
      answers[name + '__half'] = (h && !m) || (!h && m) ? '1' : '';
    }
    grp.addEventListener('change', function () {
      read();
      clearError(grp.closest('.te-field'));
    });
    read();
  });

  /* — scelte a bersaglio: pastiglie e pulsanti si comportano uguale — */
  [].slice.call(doc.querySelectorAll('[data-choice]')).forEach(function (group) {
    group.addEventListener('click', function (e) {
      var opt = e.target.closest('[data-value]');
      if (!opt) return;
      [].slice.call(group.querySelectorAll('[data-value]')).forEach(function (o) {
        o.classList.remove('is-active'); o.setAttribute('aria-checked', 'false');
      });
      opt.classList.add('is-active'); opt.setAttribute('aria-checked', 'true');
      answers[group.getAttribute('data-choice')] = opt.getAttribute('data-value');
      clearError(opt.closest('.te-field'));
      sync();
    });
  });

  /* — campi che compaiono solo se una risposta precedente lo chiede — */
  function sync() {
    [].slice.call(doc.querySelectorAll('[data-show-if]')).forEach(function (f) {
      var raw = f.getAttribute('data-show-if'), on;
      if (raw.indexOf('~') > -1) {          /* «~» = fra i valori scelti c'e' */
        var c = raw.split('~');
        on = (val(c[0]) || '').split(SEP).indexOf(c[1]) > -1;
      } else {
        var cond = raw.split('=');
        on = val(cond[0]) === cond[1];
      }
      f.hidden = !on;
      if (!on) clearError(f);
    });
    [].slice.call(doc.querySelectorAll('[data-req-unless]')).forEach(function (f) {
      var cond = f.getAttribute('data-req-unless').split('='),
          off = val(cond[0]) === cond[1];
      f.hidden = off;
      if (off) clearError(f);
    });
  }

  /* — errori: si mostrano dopo «Next», mai mentre si scrive — */
  function clearError(f) {
    if (!f) return;
    f.classList.remove('is-error');
    var p = f.querySelector('.te-error'); if (p) p.remove();
  }
  function showError(f, msg) {
    clearError(f);
    f.classList.add('is-error');
    var p = doc.createElement('p');
    p.className = 'te-error';
    p.innerHTML = '<svg class="te-ic" viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path>' +
      '<path d="M12 16h.01"></path></svg><span></span>';
    p.querySelector('span').textContent = msg;
    f.appendChild(p);
  }
  function checkField(f) {
    if (f.hidden) return true;
    /* un orario compilato a meta' non si scarta in silenzio: senza questo
       controllo «21» senza minuti sparirebbe dalla mail e nessuno lo saprebbe.
       Vale anche su TIME_END, che obbligatorio non e'. */
    var g = f.querySelector('[data-time]');
    if (g && answers[g.getAttribute('data-time') + '__half']) {
      clearError(f); showError(f, ERR.partial); return false;
    }
    /* un link va controllato anche quando il campo e' facoltativo: se non
       si scrive niente va bene, ma se si incolla qualcosa deve essere un
       indirizzo, se no arriva in mail una riga inservibile. */
    if (f.getAttribute('data-type') === 'url') {
      var u = val(f.getAttribute('data-f'));
      if (u && !/^https?:\/\/\S+$/i.test(u)) { clearError(f); showError(f, ERR.url); return false; }
    }
    if (!f.getAttribute('data-req')) return true;
    /* si ripulisce prima di ricontrollare: senza questo un errore gia'
       mostrato resta rosso sotto un campo ormai compilato, e lo si
       ritrova tornando indietro. */
    clearError(f);
    var name = f.getAttribute('data-f'), type = f.getAttribute('data-type'), v = val(name);
    if (type === 'email') {
      if (!v) { showError(f, ERR.email); return false; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { showError(f, ERR.email); return false; }
      return true;
    }
    if (type === 'number') {
      if (!v || isNaN(Number(v))) { showError(f, ERR.number); return false; }
      return true;
    }
    if (!v) {
      showError(f, ERR[name] || ERR[type] || ERR.text);
      return false;
    }
    return true;
  }

  function go(n) {
    cur = n;
    sync();
    panels.forEach(function (p, i) { p.hidden = (i + 1) !== n; });
    intro.hidden = n > 1;
    btnBack.hidden = n === 1;
    btnNext.hidden = n === STEPS;      /* in fondo comanda il bottone rosso */
    bar.hidden = n === STEPS;
    fill.style.width = Math.round(n / LAST_Q * 100) + '%';
    count.textContent = 'Step ' + n + ' of ' + LAST_Q;
    btnNext.firstChild.nodeValue = n === LAST_Q ? 'See the message' : 'Next';
    window.scrollTo(0, 0);
  }

  btnNext.addEventListener('click', function () {
    var bad = null;
    fieldsOf(cur).forEach(function (f) { if (!checkField(f) && !bad) bad = f; });
    if (bad) {
      var focusable = bad.querySelector('input,textarea,select,[data-value]');
      if (focusable) focusable.focus({ preventScroll: true });
      bad.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    if (cur === LAST_Q) { compose(); go(STEPS); } else { go(cur + 1); }
  });
  btnBack.addEventListener('click', function () { go(Math.max(1, cur - 1)); });

  /* — contatore della descrizione — */
  var desc = doc.getElementById('f-desc'), cdesc = doc.getElementById('c-desc');
  if (desc && cdesc) desc.addEventListener('input', function () {
    cdesc.textContent = desc.value.length + ' / 1500';
  });

  /* — la mail — */
  function photoValue() {
    var p = val('PHOTO');
    if (p === 'LINK') { var u = val('PHOTO_URL'); return u ? 'LINK:' + u : ''; }
    return p || '';
  }
  function priceValue() {
    if (val('IS_FREE') === 'YES') return '';
    var n = val('PRICE');
    return n ? n + ' ALL' : '';
  }
  function bodyText() {
    var v = {
      TITLE: val('TITLE'), CATEGORY: val('CATEGORY'), DATE_START: val('DATE_START'),
      TIME_START: val('ALL_DAY') === 'YES' ? '' : val('TIME_START'),
      DATE_END: val('DATE_END'), TIME_END: val('TIME_END'), ALL_DAY: val('ALL_DAY'),
      VENUE_NAME: val('VENUE_NAME'), ADDRESS: val('ADDRESS'),
      MAPS_URL: val('MAPS_URL'), IS_FREE: val('IS_FREE'),
      PRICE: priceValue(), TICKET_URL: val('TICKET_URL'),
      DESCRIPTION: val('DESCRIPTION').replace(/\s*\n\s*/g, ' '),
      PHOTO: photoValue(), ORGANIZER_NAME: val('ORGANIZER_NAME'),
      ORGANIZER_EMAIL: val('ORGANIZER_EMAIL'), ORGANIZER_PHONE: val('ORGANIZER_PHONE'),
      /* niente ripiego su 'EN': in una scelta multipla senza voci accese
         un default consegnerebbe come inglese un evento in albanese. Vuoto
         e' onesto, sbagliato no. */
      LANGUAGE: val('LANGUAGE'),
      LANGUAGE_OTHER: (val('LANGUAGE') || '').split(SEP).indexOf('OTHER') > -1
        ? val('LANGUAGE_OTHER') : '',
      CONSENT: val('CONSENT') ? 'YES' : 'NO'
    };
    return FIELDS.map(function (k) { return k + ': ' + v[k]; }).join('\n');
  }
  function subject() {
    /* nell'oggetto va una categoria sola, la prima scelta: con tre
       etichette l'oggetto si allunga e i client di posta lo tagliano.
       Le altre restano tutte nel corpo. */
    var c = (val('CATEGORY') || '').split(SEP)[0];
    return '[TIRANATODO] NEW | ' + c + ' | ' + val('DATE_START') +
      ' | ' + val('TITLE');
  }
  function compose() {
    var s = subject(), b = bodyText();
    doc.getElementById('mail-text').textContent =
      'To: ' + MAIL_TO + '\nSubject: ' + s + '\n\n' + b;
    doc.getElementById('open-mail').href = 'mailto:' + MAIL_TO +
      '?subject=' + encodeURIComponent(s) + '&body=' + encodeURIComponent(b);
    doc.getElementById('photo-note').hidden = val('PHOTO') !== 'ATTACHED';
  }

  var btnCopy = doc.getElementById('copy-mail');
  btnCopy.addEventListener('click', function () {
    var t = doc.getElementById('mail-text').textContent;
    var done = function () { btnCopy.classList.add('is-active'); };
    if (navigator.clipboard) { navigator.clipboard.writeText(t).then(done, fallback); }
    else fallback();
    function fallback() {
      var ta = doc.createElement('textarea');
      ta.value = t; doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); done(); } catch (e) {}
      doc.body.removeChild(ta);
    }
  });

  go(1);
})();
