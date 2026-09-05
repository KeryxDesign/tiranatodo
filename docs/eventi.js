/* ══════════════════════════════════════════════════════════════════════
   TiranaToDo — elenco eventi del mockup
   ──────────────────────────────────────────────────────────────────────
   ⚠️ CONTENUTO INVENTATO. Nessuno di questi eventi esiste. I nomi dei
   luoghi sono luoghi veri di Tirana, usati perche' il mockup si giudica
   solo se sembra vero. Per questo la pagina porta in alto un avviso
   permanente che dice che i dati sono finti: si toglie il giorno che
   arrivano gli eventi veri, non prima.

   ⚠️ Il testo che si legge a schermo (titoli, descrizioni, etichette)
   e' segnaposto. DA CHIEDERE A MUSE: il testo definitivo, quando il
   sito vero esiste.

   ⏳ Le date NON sono scritte a mano: ogni evento porta `d`, i giorni da
   oggi. La data esatta si calcola all'apertura della pagina. Cosi' il
   mockup non invecchia e i filtri Today / Tomorrow / Weekend funzionano
   davvero in qualsiasi giorno lo si guardi.

   FOTO — ce ne sono sei (art, cinema, food, meetups, music, outdoors) e
   undici categorie. Le mancanti prendono in prestito la scena piu' vicina,
   dichiarata in `imgFrom`. Da sostituire quando arrivano le foto vere:
     nightlife → meetups   (sera, gruppo, bicchieri)
     theatre   → music     (palco, luci)
     sport     → outdoors  (all'aperto, movimento)
     family    → outdoors  (all'aperto, giorno)
     other     → art       (interno, neutro)
   ══════════════════════════════════════════════════════════════════════ */

window.TE_IMG_BASE = 'https://raw.githubusercontent.com/KeryxDesign/tiranatodo/main/assets/demo/web/';

window.TE_PHOTOS = {
  music:    { file: 'music.jpg',    alt: 'An electric guitar and a microphone on a small dark stage, lit by one spotlight, seen over the heads of a seated audience.' },
  meetups:  { file: 'meetups.jpg',  alt: 'People talking in small groups on a rooftop terrace at dusk, with a line of small light bulbs hanging above them.' },
  cinema:   { file: 'cinema.jpg',   alt: 'Rows of empty folding chairs facing a lit open-air cinema screen at night, under a full moon' },
  outdoors: { file: 'outdoors.jpg', alt: 'A stone path going up through pine trees on a hillside, with the roofs of a city far below in the morning mist.' },
  food:     { file: 'food.jpg',     alt: 'Small plates of grilled vegetables, bread and cheese crowded together on a worn wooden table, seen from above' },
  art:      { file: 'art.jpg',      alt: 'Framed paintings on a white gallery wall, with two visitors standing a few steps away and looking at them.' }
};

/* Categoria → foto usata. Dove le due colonne non coincidono, e' un prestito. */
window.TE_CAT_PHOTO = {
  music: 'music', nightlife: 'meetups', theatre: 'music', cinema: 'cinema',
  art: 'art', food: 'food', sport: 'outdoors', family: 'outdoors',
  meetups: 'meetups', outdoors: 'outdoors', workshop: 'meetups', other: 'art'
};

window.TE_CAT_LABEL = {
  music: 'Music', nightlife: 'Nightlife', theatre: 'Theatre', cinema: 'Cinema',
  art: 'Art', food: 'Food &amp; Drink', sport: 'Sport', family: 'Family',
  meetups: 'Meetups', outdoors: 'Outdoors', workshop: 'Workshops', other: 'Other'
};

/* d = giorni da oggi · time/end = ora locale · price = Lek, 0 = gratis
   featured = slot in alto (a pagamento, §9 del piano)
   picked   = «scelti da noi» (editoriale, §7). ⏳ Nel mockup NON si
              disegna ancora: DA CHIEDERE A LORI la forma del segno.
              Il rosso resta alle azioni, quindi il segno non e' rosso. */
window.TE_EVENTS = [

  { slug: 'open-mic-tulla', cat: 'music', d: 0, time: '21:00', end: '23:00',
    featured: true, picked: true, price: 500,
    title: 'Live music: open mic night at Tulla Culture Center',
    venue: 'Tulla Culture Center', area: 'Blloku',
    address: 'Rruga Sami Frashëri, Blloku',
    organizer: 'Tulla Culture Center',
    note: 'Sign-up for performers from 19:30',
    about: ['Every second Saturday Tulla opens its stage to anyone with a song, a poem or a five-minute set. Sign up at the door from 19:30; slots go in order of arrival and each performer gets eight minutes. The audience is a mix of locals and internationals, and the host switches between English and Albanian.',
            'Doors close when the room is full, about sixty people, so come early if you want a seat. The bar stays open until midnight.'] },

  { slug: 'newcomers-drinks', cat: 'meetups', d: 0, time: '19:30', end: '22:00',
    picked: true, price: 0,
    title: 'Newcomers in Tirana: welcome drinks for internationals',
    venue: 'Radio Bar', area: 'Blloku',
    address: 'Rruga Ismail Qemali, Blloku',
    organizer: 'Tirana Internationals',
    note: 'No booking, just turn up',
    about: ['An open table for anyone who moved to Tirana in the last few months. No programme, no name tags: people arrive, sit down and talk. Most of the room speaks English.',
            'The group meets on the first Saturday of the month. If you are new to the city and know nobody yet, this is the cheapest way to fix that.'] },

  { slug: 'open-air-albanian-classics', cat: 'cinema', d: 0, time: '21:30', end: '23:30',
    price: 300,
    title: 'Open-air screening: Albanian classics with English subtitles',
    venue: 'Rinia Park', area: 'open-air stage',
    address: 'Rinia Park, city centre',
    organizer: 'Kinema Millennium',
    note: 'Bring something warm, it cools down after ten',
    about: ['A season of Albanian films from the seventies and eighties, all with English subtitles, shown outdoors on the park stage. Tonight: a comedy that most Albanians over forty can quote by heart.',
            'Chairs are free but limited. The screening moves indoors if it rains, same ticket, same time.'] },

  { slug: 'blloku-bar-crawl', cat: 'nightlife', d: 0, time: '23:00', end: '03:00',
    price: 500,
    title: 'Blloku bar crawl for internationals',
    venue: 'Folie Terrace', area: 'Blloku',
    address: 'Rruga Dëshmorët e 4 Shkurtit, Blloku',
    organizer: 'Tirana Nights',
    note: 'Meeting point is the terrace, not the street',
    about: ['Four bars in one night, walking distance from each other, with a group that changes every week. The ticket covers the first drink and the guide, not the rest.',
            'It starts late because Tirana starts late. Expect to be out until three.'] },

  { slug: 'sunrise-hike-dajti', cat: 'outdoors', d: 1, time: '06:30', end: '12:00',
    featured: false, picked: true, price: 1200,
    title: 'Sunrise hike up Mount Dajti, with breakfast at the top',
    venue: 'Dajti Ekspres', area: 'lower cable car station',
    address: 'Rruga Sotir Kolea, Tirana e Re',
    organizer: 'Outdoor Albania',
    note: 'Cable car down is included',
    about: ['Three hours up on foot, leaving in the dark, to be on the ridge when the sun comes over the mountains. Breakfast is bread, cheese and coffee at the top, and the cable car brings you back down.',
            'The path is steep but not technical. Trainers are fine in dry weather; boots are better after rain.'] },

  { slug: 'pazari-food-tour', cat: 'food', d: 1, time: '12:00', end: '15:00',
    price: 2500,
    title: 'Byrek and raki: a walking food tour of Pazari i Ri',
    venue: 'Pazari i Ri', area: 'the new bazaar',
    address: 'Pazari i Ri, city centre',
    organizer: 'Tirana Food Walks',
    note: 'Eight stops, come hungry',
    about: ['A slow walk through the market and the streets behind it, stopping at eight places that locals actually use. Byrek, pickles, cheese, grilled meat, and raki at the end for anyone who wants it.',
            'The guide explains what you are eating and where it comes from. Vegetarians are covered; tell the organiser when you book.'] },

  { slug: 'destil-young-painters', cat: 'art', d: 1, time: '18:00', end: '21:00',
    price: 0,
    title: 'Opening night: young Albanian painters at Destil',
    venue: 'Destil Creative Hub', area: 'city centre',
    address: 'Rruga Vaso Pasha, city centre',
    organizer: 'Destil Creative Hub',
    note: 'Wine is free, the paintings are not',
    about: ['Fourteen painters under thirty, most showing in public for the first time. The room stays open for three weeks; tonight is the opening, which is when the artists are actually there to talk to.',
            'Free entry, no booking. The catalogue is in Albanian and English.'] },

  { slug: 'farka-five-a-side', cat: 'sport', d: 1, time: '17:00', end: '19:00',
    price: 400,
    title: 'Sunday five-a-side at Farka Lake: mixed levels, mixed languages',
    venue: 'Farka Lake pitches', area: 'east of the city',
    address: 'Liqeni i Farkës, Farkë',
    organizer: 'Tirana Sunday League',
    note: 'Turn up alone, teams are made on the spot',
    about: ['Teams are drawn when everyone has arrived, so you do not need to bring anybody. Levels are mixed and nobody keeps a league table.',
            'The pitch fee is split between whoever shows up. Bring your own water; the kiosk closes at six.'] },

  { slug: 'grand-park-kids-morning', cat: 'family', d: 2, time: '10:30', end: '12:30',
    price: 0,
    title: 'Kids morning at Grand Park: games and stories in English',
    venue: 'Grand Park', area: 'by the lake',
    address: 'Parku i Madh, near the lake shore',
    organizer: 'Tirana Family Circle',
    note: 'Ages three to nine, parents stay',
    about: ['Two hours of running around, simple games and a story read aloud, all in English, run by parents for parents. It happens whatever the weather unless it actually rains.',
            'Free and open to anyone. Bring water and something for your child to sit on.'] },

  { slug: 'national-theatre-drama', cat: 'theatre', d: 2, time: '20:00', end: '22:00',
    price: 800,
    title: 'Contemporary Albanian drama, with English surtitles',
    venue: 'Teatri Kombëtar', area: 'city centre',
    address: 'Bulevardi Dëshmorët e Kombit',
    organizer: 'Teatri Kombëtar',
    note: 'Surtitles on Mondays only',
    about: ['A play written and set in Tirana in the last ten years, performed in Albanian with English surtitles above the stage. Monday is the only night the surtitles run.',
            'Ninety minutes, no interval. Latecomers wait for the first scene change.'] },

  { slug: 'albanian-beginners-class', cat: 'workshop', d: 2, time: '11:00', end: '12:30',
    price: 0,
    title: 'Albanian for absolute beginners: free trial class',
    venue: 'COD', area: 'Center for Openness and Dialogue',
    address: 'Bulevardi Dëshmorët e Kombit, presidency building',
    organizer: 'Albanian Language Studio',
    note: 'One free class, no obligation',
    about: ['Ninety minutes of the basics: greetings, numbers, ordering coffee, asking where something is. Aimed at people who have just arrived and cannot read a menu yet.',
            'The trial class is free and you are under no obligation to sign up for the course afterwards.'] },

  { slug: 'komiteti-brass-night', cat: 'music', d: 3, time: '22:00', end: '01:00',
    price: 700,
    title: 'Balkan brass night at Komiteti',
    venue: 'Komiteti', area: 'Kafe Muzeum',
    address: 'Rruga Fatmir Haxhiu, city centre',
    organizer: 'Komiteti',
    note: 'Small room, it fills up by eleven',
    about: ['A seven-piece brass band in a bar full of communist-era furniture, playing loud enough that nobody talks much after the first set.',
            'The room holds about eighty people and there is no booking. Come before eleven or expect to stand.'] },

  { slug: 'house-of-leaves-guided', cat: 'art', d: 4, time: '19:00', end: '20:30',
    price: 700,
    title: 'Guided visit: House of Leaves, the surveillance museum',
    venue: 'House of Leaves', area: 'city centre',
    address: 'Rruga Ibrahim Rugova, city centre',
    organizer: 'House of Leaves',
    note: 'Guide speaks English',
    about: ['The building was the headquarters of the secret police for forty-five years. The visit goes room by room through how the surveillance actually worked: the microphones, the files, the people who wrote them.',
            'Ninety minutes with an English-speaking guide. Not recommended for children under twelve.'] },

  { slug: 'language-exchange', cat: 'meetups', d: 4, time: '19:00', end: '21:30',
    price: 0,
    title: 'Language exchange: Albanian, English, Italian',
    venue: 'Hemingway Bar', area: 'Blloku',
    address: 'Rruga Pjetër Bogdani, Blloku',
    organizer: 'Tirana Language Exchange',
    note: 'Tables change every thirty minutes',
    about: ['Three tables, one per language, and everybody moves every half hour. You spend some of the evening teaching and some of it struggling, which is the point.',
            'Free. Drinks are on you and the bar keeps the tables for us until nine thirty.'] },

  { slug: 'farka-bike-ride', cat: 'outdoors', d: 5, time: '08:30', end: '11:00',
    price: 0,
    title: 'Morning bike ride around Farka Lake',
    venue: 'Farka Lake', area: 'main entrance',
    address: 'Liqeni i Farkës, Farkë',
    organizer: 'Tirana Bike Club',
    note: 'Bring your own bike',
    about: ['Eighteen kilometres on a flat gravel loop, at a pace set by the slowest rider. It takes about two hours with a coffee stop halfway.',
            'Free, no booking, no bikes for hire on site. Helmets are not compulsory in Albania but the group wears them.'] },

  { slug: 'supper-club-north', cat: 'food', d: 6, time: '19:30', end: '23:00',
    price: 3000,
    title: 'Supper club: home cooking from the north',
    venue: 'Mullixhiu', area: 'Grand Park entrance',
    address: 'Lasgush Poradeci Boulevard, Grand Park',
    organizer: 'Mullixhiu',
    note: 'Twenty seats, booking only',
    about: ['One long table, twenty seats, five courses from the mountain villages of the north: cornbread, cured meat, lamb, and a dessert nobody can pronounce.',
            'Booking only, and the table is usually gone a week ahead. Tell them about allergies when you book, not on the night.'] },

  { slug: 'rooftop-dj-skanderbeg', cat: 'nightlife', d: 6, time: '23:30', end: '04:00',
    price: 600,
    title: 'Rooftop DJ set above Skanderbeg Square',
    venue: 'Sky Tower', area: 'rotating bar',
    address: 'Rruga Dëshmorët e 4 Shkurtit',
    organizer: 'Sky Tower',
    note: 'The floor turns, slowly',
    about: ['A DJ set on the top floor of the tower, where the bar rotates one full turn every ninety minutes and the whole city goes past the window.',
            'Entry includes one drink. The lift queue after midnight is long; go up early and stay.'] }

];
