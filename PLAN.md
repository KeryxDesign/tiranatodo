# TiranaToDo — piano di implementazione

Bozza del 2026-09-04, scritta da Arcadio (PM Keryx Design) per la sessione Claude Code che costruirà il sito.
Nome scelto da Davide il 2026-09-04: **TiranaToDo**. Dominio principale `tiranatodo.com` (whois: nessuna registrazione al 2026-09-04); `tiranatodo.al` in redirect, senza record DNS alla stessa data. Registrazione e ricerca marchio (LEX, classi 35/41/42) sono in §11. Scritto sempre in una forma sola: `TiranaToDo` nel testo, `tiranatodo` nei percorsi.

## 1. Cosa si costruisce

Un portale eventi per la città di Tirana, pensato **prima di tutto per gli expat** che ci vivono e per chi arriva da fuori; i locali sono il secondo pubblico (precisazione di Davide del 2026-09-04). Le persone filtrano gli eventi per data e per categoria, cercano da sole, aprono la card e vedono il dettaglio. Chi organizza un evento lo manda da un modulo, con testo e immagine. Davide approva da un pannello. Il sito conta quante volte si apre ogni evento, ma il numero lo vede solo Davide (§7).

Riferimento di partenza: la sezione eventi di BresciaToday (rete Citynews). Il risultato deve venire meglio, e la misura è una sola: **si usa bene da mobile, con una mano**.

## 2. Stack e infrastruttura

| Pezzo | Scelta | Perché |
|---|---|---|
| Frontend | Astro + Tailwind, output ibrido (pagine statiche + funzioni server) | Stack standard Keryx; pagine evento indicizzabili |
| Hosting | Cloudflare Pages + Pages Functions | Serverless, gratis a questo traffico, Turnstile incluso |
| Database | Supabase (Postgres) | Già in uso su altri progetti Keryx; RLS, Storage, Auth |
| Immagini | Supabase Storage, bucket `event-images`, pubblico in lettura | Un solo fornitore |
| Anti-bot | Cloudflare Turnstile, modalità invisibile | Solo il modulo di invio |
| Email a Davide | Resend | ⚠️ La chiave Resend Keryx è in rotazione (registro verifiche, riga 6). Si usa una chiave nuova dedicata a questo progetto, mai quella condivisa |
| Admin | Supabase Auth con magic link, un solo utente | Nessuna password da gestire |
| Analytics | Cloudflare Web Analytics (senza cookie) | Basta per la fase 1; GA4 solo se LENS lo chiede |

Regole tecniche che non si discutono:

- ⛔ **Nessun segreto lato client.** L'anon key Supabase sta nel client solo con policy in sola lettura. Service role, chiave Resend, segreto Turnstile: solo nelle Pages Functions, come variabili d'ambiente Cloudflare.
- ⛔ **`anon` non scrive mai direttamente.** Invio evento, upload immagine e conteggio aperture passano da una Pages Function che valida e scrive con la service role. Nessuna policy INSERT/UPDATE/DELETE per `anon`. Le policy admin hanno sempre `TO authenticated`.
- ⛔ Le immagini caricate si validano lato server: tipo MIME reale, peso massimo, ridimensionamento, nome file rigenerato. Mai servire il file originale.
- `git add` esplicito, file per file. Mai `git add -u` o `git add .`.

## 3. Modello dati

### `events`
| Campo | Tipo | Note |
|---|---|---|
| id | uuid | |
| slug | text unique | generato dal titolo + data, mai cambiato dopo la pubblicazione |
| title | text | |
| description | text | markdown semplice, sanificato in uscita |
| category | enum | vedi §4 |
| starts_at, ends_at | timestamptz | fuso Europe/Tirane; `ends_at` nullo = evento puntuale |
| all_day | bool | |
| venue_name, address | text | |
| venue_id | uuid nullable | fase 2, pagine luogo |
| lat, lng | numeric nullable | per il link mappa |
| is_free | bool | |
| price_text | text nullable | testo libero, es. «500 lek» |
| ticket_url | text nullable | |
| image_path | text nullable | percorso nel bucket |
| lang | enum sq/en/it | lingua del testo inviato |
| organizer_name | text | pubblico |
| organizer_email, organizer_phone | text | **privati**: mai nelle select pubbliche, viste separate |
| status | enum pending/published/rejected/archived | |
| source | enum form/admin/import | |
| featured_until | timestamptz nullable | predisposizione per «in evidenza» (§9); in fase 1 lo imposta solo l'admin |
| views_count | int default 0 | contatore denormalizzato delle aperture, aggiornato da trigger. ⛔ non si mostra al pubblico in fase 1 (§7) |
| picked | bool default false | «scelti da noi»: lo imposta solo l'admin (§7) |
| created_at, published_at | timestamptz | |

Eventi ricorrenti: in fase 1 una riga per occorrenza. L'admin ha un tasto «duplica» che copia la riga con data nuova. Il campo `series_id` (uuid nullable) tiene insieme le occorrenze per la fase 2.

### `event_views`
| Campo | Tipo | Note |
|---|---|---|
| event_id | uuid | |
| viewer_hash | text | hash server-side di (id anonimo del dispositivo + sale segreto); mai l'IP in chiaro |
| ip_hash | text | hash dell'IP con sale, per il filtro anti-robot |
| created_at | timestamptz | |
| indice | (event_id, viewer_hash, created_at) | **nessun vincolo di unicità**: una pagina si riapre per motivi legittimi. La finestra anti-doppione sta nella Function (§7) |

⚠️ Questa tabella cresce a ogni apertura. Le righe più vecchie di 90 giorni si aggregano in un totale per evento e si cancellano: tiene bassa la tabella e riduce il dato personale conservato.

### `submissions_log`
Ogni chiamata al modulo, anche rifiutata: timestamp, ip_hash, esito, motivo. Serve a vedere gli abusi.

### Viste
- `events_public`: solo `status = published`, senza i campi privati dell'organizzatore. È l'unica cosa che `anon` legge.
- `events_admin`: tutto, `TO authenticated`.

## 4. Categorie

**Undici, fisse in fase 1**, tarate sugli expat. Le chiavi in database sono queste, in inglese, e sono le stesse del design system:

`music` · `nightlife` · `theatre` · `cinema` · `art` · `food` · `sport` · `family` · `meetups` · `outdoors` · `other`

Ogni categoria ha la sua terna di colori nel design system (`--te-cat-<nome>`, con `-bg` e `-ink`) e un'etichetta per ognuna delle tre lingue (§6).

⚠️ **Allineate al design system il 04/09/2026, dopo la consegna di LORI.** La prima stesura di questo piano ne elencava dieci accorpate (`theatre & cinema`, `sport & outdoors`, `family & other`, più `workshops & talks` e `markets & fairs`). LORI ha separato le coppie e sostituito le ultime due con `meetups` e `outdoors`, con questa ragione scritta nel design system: *un expat filtra per meetup e per escursione, non per mercatini*. Vince il design system, che è già costruito e reso.

⚠️ **Conseguenza da tenere d'occhio:** workshop, conferenze e mercatini non hanno più una categoria propria e cadono in `other`. Se dopo tre mesi la coda di `/submit` mostra che arrivano spesso, si aggiunge una categoria: costa una riga di enum, una terna di colori e tre etichette. ⛔ Non si aggiunge prima di vedere il dato.

## 5. Pagine e funzioni

### Lista eventi `/` (e `/sq/`, `/it/`)
- Barra filtri **sticky in alto** su mobile: chip data (Oggi, Domani, Weekend, Scegli data) + riga chip categorie a scorrimento orizzontale + campo cerca. Contatore risultati sempre visibile.
- I filtri stanno nell'URL (`?date=weekend&cat=music&q=jazz`): la pagina si condivide e si indicizza.
- Ordinamento: prima gli eventi con `featured_until` valido, poi per data. Né le aperture né il segno «scelti da noi» cambiano la posizione (§7).
- Lista raggruppata per giorno, card compatte. Caricamento a pagine di 20 con «carica altri», niente scroll infinito.
- Il filtro data e categoria gira lato client sui dati già caricati per il periodo scelto; la ricerca testuale interroga Supabase con `ilike` su titolo, luogo e descrizione.

### Dettaglio `/events/[slug]` (e `/sq/events/…`, `/it/events/…`)
- Pagina server-rendered, indicizzabile, con JSON-LD `Event` (schema.org) completo: Google mostra gli eventi nelle sue schede.
- Immagine, titolo, data e ora leggibili («Sabato 12 settembre, 21:00»), luogo con link a Google Maps, prezzo o Gratis, biglietti, descrizione, organizzatore.
- Bottoni: «Aggiungi al calendario» (file `.ics` generato al volo) e «Condividi» (Web Share API, fallback copia link e WhatsApp). ⛔ Nessun bottone di voto (§7).
- Sotto: «Altri eventi in questa categoria» e «Stesso giorno».
- Evento passato: banner «Questo evento è finito», niente bottone calendario, resta indicizzato per 30 giorni poi `noindex`.

### Invio evento `/submit` (e `/sq/submit`, `/it/submit`)
Un modulo solo, su una pagina, pensato per il telefono:
1. Titolo, categoria, data e ora inizio, fine opzionale, «tutto il giorno».
2. Luogo (nome + indirizzo), gratis sì/no, prezzo in testo, link biglietti.
3. Descrizione (max 1.500 caratteri, contatore visibile).
4. Immagine: un file, JPG/PNG/WebP, max 5 MB, anteprima prima dell'invio, ritaglio suggerito 4:5. Se manca, il sito usa un fondo colore categoria: l'evento non si ferma per l'immagine.
5. Chi sei: nome organizzatore (pubblico), email e telefono (privati), consenso privacy con checkbox **non pre-spuntata**.
6. Turnstile invisibile → Pages Function `POST /api/submit`.

Esito: pagina «Ricevuto, lo pubblichiamo entro 24 ore» + email di conferma a chi ha inviato + email a Davide con anteprima e due link firmati «Approva» / «Rifiuta» che aprono il pannello.

Limiti: 5 invii per ip_hash al giorno; titolo duplicato nella stessa data → avviso all'admin, non blocco.

⚡ **Prima che il modulo esista, gli eventi arrivano per mail.** La procedura è scritta e vale da subito: `sop/sop_invio_eventi_via_email.md` (OPS, 2026-09-05, stato PROPOSTA). I campi del modulo qui sopra e i campi della mail devono restare gli stessi: quando il modulo entra in funzione, la mail resta come seconda strada per chi non vuole compilare niente. Il registro `eventi/registro_eventi.csv` della SOP ha già le colonne di `events`: gli eventi raccolti a mano si importano, non si riscrivono.

### Pannello `/admin`
- Accesso con magic link Supabase, una sola email autorizzata (variabile d'ambiente).
- Coda «in attesa» con anteprima card così come la vedrà il pubblico. Azioni: approva, modifica poi approva, rifiuta con motivo (email automatica all'organizzatore), duplica, metti in evidenza fino a data, segna «scelti da noi», archivia.
- Tab «pubblicati», «rifiutati», «aperture»: quest'ultimo mostra `views_count` per evento e per categoria. È il pannello dei numeri di Davide (§7).
- Tutto usabile da telefono: Davide approva dal letto.

### Funzioni server (Pages Functions)
| Rotta | Fa |
|---|---|
| `POST /api/submit` | valida campi, verifica Turnstile, carica immagine, inserisce con `status = pending`, manda le due email |
| `POST /api/view` | conta un'apertura della pagina dettaglio, con finestra anti-doppione e filtro robot (§7) |
| `GET /api/ics/[slug]` | genera il file calendario |
| `GET /api/admin/*` | solo con sessione Supabase valida |

## 6. Multilingua dalla fase 1

Decisione di Davide del 2026-09-04: il sito nasce multilingua. Tre lingue di interfaccia, con l'inglese come default perché il pubblico primario è expat:

| Lingua | URL | Ruolo |
|---|---|---|
| Inglese | `/…` | default, lingua di riferimento delle stringhe |
| Albanese | `/sq/…` | locali e organizzatori |
| Italiano | `/it/…` | comunità italiana a Tirana, numerosa |

Regole:
- Stringhe di interfaccia in `i18n/en.json`, `i18n/sq.json`, `i18n/it.json`, con una chiave sola per stringa. Una chiave assente in una lingua cade sull'inglese e finisce in un report di build, non in pagina vuota.
- Le pagine evento hanno un URL per lingua e i tag `hreflang` incrociati. Il selettore lingua tiene la stessa pagina, non rimanda alla home.
- La lingua iniziale segue il browser (`Accept-Language`), poi la scelta salvata in cookie tecnico.
- Il contenuto degli eventi resta nella lingua in cui arriva, con l'etichetta `lang`. Il modulo di invio chiede titolo e descrizione in una lingua a scelta e offre campi opzionali per le altre due; il campo `title_i18n`/`description_i18n` (jsonb) tiene le versioni. Se una traduzione manca, la pagina mostra l'originale con l'avviso «Testo in albanese» (o inglese, o italiano).
- Date, ore e valuta si formattano con `Intl` per lingua: «Sat 12 Sep, 21:00» · «E shtunë 12 shtator, 21:00» · «Sabato 12 settembre, 21:00».
- Le email a chi invia partono nella lingua in cui ha compilato il modulo.
- Aggiungere una quarta lingua deve costare un file JSON in più e niente altro: questo è il criterio di accettazione dell'architettura.
- ⛔ I testi definitivi delle tre lingue (etichette, messaggi, email) li scrive MUSE, che dichiara mercato e set per ciascuna: Opus mette segnaposto in inglese e li elenca in `i18n/TODO_MUSE.md`. Nessuna traduzione automatica va in produzione senza il suo passaggio.

## 7. Aperture contate, «scelti da noi», niente voti

**Decisione di Davide del 2026-09-05, che sostituisce la sua del 2026-09-04.** Prima erano previsti i voti «Mi interessa»; ora escono. ⛔ Non si rifanno, e questo paragrafo è l'unica fonte: se un altro file del progetto parla ancora di voti, è vecchio.

**Perché i voti sono usciti.** Un contatore di voti paga solo con numeri grossi. Con numeri piccoli si gira al contrario: un evento con 2 interessati sembra morto, e il sito sembra deserto. In più chiede alla gente un clic che su un sito nuovo non arriva.

**Perché le aperture sì.** Si contano da sole, senza chiedere niente a nessuno. E danno la frase che un giorno si vende all'organizzatore: «la tua pagina è stata aperta 200 volte».

### Il numero non si mostra
⛔ **`views_count` non compare in nessuna pagina pubblica in fase 1.** Quattro motivi, e valgono finché il traffico non è grosso:

1. Un numero piccolo è un segnale negativo, e aprire una pagina non costa niente: «7 aperture» dice meno di zero.
2. Le aperture misurano la posizione, non la qualità: l'evento in cima si apre di più perché sta in cima. Mostrarlo chiude il giro e premia chi era primo.
3. Si gonfia in un minuto ricaricando la propria pagina.
4. Conta la curiosità, non la soddisfazione: premierebbe i titoli furbi.

Il numero si raccoglie comunque **dal primo giorno**, perché accenderlo dopo è un attimo e raccoglierlo a posteriori è impossibile. Chi lo vede: solo Davide, nel tab «aperture» del pannello.

### Come si conta
- La pagina dettaglio chiama `POST /api/view` una volta caricata. La Function scrive; il client non tocca mai il database.
- **Finestra anti-doppione:** stessa coppia (evento, `viewer_hash`) entro 30 minuti = una sola apertura contata.
- **Filtro robot:** user agent noti dei crawler scartati, e richieste senza referer interno né sessione scartate. Le soglie sono variabili d'ambiente, non numeri nel codice; SENTINEL le rivede in costruzione.
- `viewer_hash` nasce da un uuid anonimo in `localStorage` più un sale segreto lato server. ⛔ Mai l'IP in chiaro, mai un identificativo che segua la persona fra siti diversi.
- Nessun Turnstile su questa rotta: sarebbe un attrito su una pagina di lettura. La difesa qui è la finestra anti-doppione, non l'anti-bot.
- ⛔ **Le aperture non cambiano l'ordine della lista.** L'ordine lo danno la data e `featured_until`.

### «Scelti da noi»
È la cosa che premia davvero gli eventi migliori, perché un contatore non ci arriva: le aperture non sanno se l'evento era bello, lo sa solo chi c'è andato.

- Campo `picked` sull'evento, impostabile **solo dall'admin**.
- Sulla card e nel dettaglio compare un segno. LORI decide la forma; il rosso resta alle azioni, quindi il segno non è rosso.
- Un chip di filtro in più nella riga categorie: «Picked by us».
- ⛔ **Anche `picked` non cambia la posizione in lista.**

⚡ **Questa è la separazione che tiene in piedi il sito quando entrano i soldi** (§9): *chi paga sale di posizione, chi è scelto da noi prende un segno.* Due cose diverse che non si scambiano. Se un giorno il segno editoriale si potesse comprare, il segno non varrebbe più niente e il sito perderebbe la sola cosa che lo distingue.

### Detto per onestà
Il pubblico di questo sito sono expat e turisti, che a Tirana non conoscono nessuno. Per loro il valore è che **qualcuno ha scelto**, non che una folla ha votato. Il voto della folla ha bisogno di numeri; la scelta funziona dal primo evento.

**Restano fuori dalla fase 1, e non si aggiungono di iniziativa:** voti, stelle, recensioni, pagina di valutazione degli organizzatori. Quest'ultima è stata valutata e scartata il 2026-09-05: chiede alla gente di tornare dopo l'evento (il comportamento più difficile da ottenere), mette il sito contro gli organizzatori — che sono le stesse persone che mandano gli eventi e a cui si venderà l'evidenza — ed è un sistema di recensioni su persone e locali con nome e cognome, quindi vuole identità, moderazione e una procedura per la recensione falsa. Se si riapre, prima passa da LEX.

## 8. Design

Il visivo è di LORI. Il design system sta in Claude Design, progetto **«Tirana Events Design System»** (tipo design system; il nome del contenitore è precedente alla scelta del nome e non è stato rinominato). Opus **non inventa colori, misure o componenti**: importa i token da `styles.css` del design system e costruisce con quelli. Se una misura non c'è, la chiede a LORI (scrive `DA CHIEDERE A LORI: …` nel report), non la stima.

Pavimento tipografico mobile, fonte `Sistema/_CORE/sop/grafica/graf_pagina_web.md` punto 4 (ratifica #82), profilo A perché il target parte da 18 anni. Misurato a 390 px sul valore computato dal DOM:

| Voce | Minimo |
|---|---|
| Testo corrente | 17 px |
| Qualunque altro testo (etichette, chip, form, footer) | 15 px |
| H1 mobile | 28 px |
| Contrasto testo/fondo, corpo | 4,5:1 |
| Contrasto testo grande (≥ 24 px o ≥ 19 px bold) | 3:1 |
| Peso minimo | 400; nessun `font-weight` ≤ 300 |
| Filetti e bordi | ≥ 1 px, alpha ≥ 0,4 |

In `package.json`: `"keryx": { "etaTargetMin": 18 }`. Tap target ≥ 44×44 px. Nessuno scroll orizzontale della pagina. Tutto testato a 375 e 390 px prima che a desktop.

LORI approva ogni pagina prima del deploy in produzione: fino a tre giri, finché scrive APPROVATO. Il giro lo porta il PM, non Opus.

## 9. Predisposizione alla monetizzazione (non si accende in fase 1)

Il modello che Davide ha in mente: pubblicazione gratuita, «in evidenza» a pagamento, pacchetti per chi pubblica spesso. Offerta e prezzi **non sono decisi**: li disegnano STRATEGO (forma), VAULT (numeri), con lettura a freddo di PROFANO e firma in tre. Fino ad allora il sito predispone e basta:

- `featured_until` esiste ed è impostabile solo dall'admin.
- La lista riserva lo slot in alto e la card «in evidenza» ha il suo stile nel design system.
- Nessun pagamento, nessun listino, nessuna pagina prezzi. ⛔ Opus non scrive prezzi da nessuna parte.
- Newsletter: in fase 1 solo un campo iscrizione in footer collegato a Kit (chiave in variabile d'ambiente). È il pubblico che rende vendibile l'evidenza dopo.

## 10. Fasi, in ordine, con criterio di chiusura

**Fase 0 — Scaffold.** Repo, Astro + Tailwind + adapter Cloudflare, i18n a tre lingue, token importati dal design system, CI che builda a ogni push e deploya su Cloudflare Pages (anteprima per branch, produzione da `main`). Chiuso quando: build verde, pagina vuota online con i token giusti.

**Fase 1 — Dati.** Migrazioni SQL in `supabase/migrations/`: tabelle, enum, viste, trigger aperture, policy RLS, bucket. Script di seed con 30 eventi finti chiaramente segnati come tali. Chiuso quando: `anon` legge solo `events_public`, ogni tentativo di scrittura anonima fallisce (test scritto), i campi privati non escono da nessuna select pubblica.

**Fase 2 — Lista e dettaglio.** Le due pagine pubbliche nelle tre lingue con filtri nell'URL, JSON-LD, `.ics`, condividi. Chiuso quando: Lighthouse mobile ≥ 90 su performance e accessibilità, pavimento tipografico misurato dal DOM e rispettato, filtri usabili con una mano a 375 px, screenshot mobile allegati al report.

**Fase 3 — Invio evento.** Modulo, Function, Turnstile, upload immagine, email. Chiuso quando: un invio finto arriva in coda con immagine ridimensionata, l'email a Davide ha i due link firmati, un invio con file non immagine viene rifiutato, il sesto invio dallo stesso ip_hash nel giorno viene rifiutato.

**Fase 4 — Pannello admin.** Magic link, coda, azioni, tab. Chiuso quando: Davide approva un evento dal telefono e lo vede pubblico entro un minuto; un utente non autorizzato non vede niente.

**Fase 5 — Aperture e «scelti da noi».** Function `POST /api/view`, finestra anti-doppione, filtro robot, tab «aperture» nel pannello, campo `picked` con segno sulla card e chip di filtro. Chiuso quando: due aperture della stessa pagina dallo stesso dispositivo entro 30 minuti contano una sola volta, un crawler noto non conta, `views_count` **non compare** in nessuna pagina pubblica (verificato cercandolo nell'HTML costruito), l'admin segna un evento «scelti da noi» e il segno appare senza che la posizione cambi.

**Fase 6 — Rifiniture.** PWA installabile, sitemap, `robots`, pagina privacy (testo da LEX, segnaposto intanto), 404, stato vuoto, skeleton, campo newsletter. Chiuso quando: LORI scrive APPROVATO sulle pagine pubbliche.

**Fase 2 del progetto (non ora):** pagine luogo, profili organizzatore, eventi ricorrenti nativi, mappa, preferiti, canale WhatsApp/Telegram, story Instagram automatica dall'evento approvato, estrazione campi da una locandina con Claude API (visione), pagamento «in evidenza».

## 11. Cosa decide Davide prima o durante

| Decisione | Chi la prende | Serve per |
|---|---|---|
| Registrare `tiranatodo.com` (+ `.al`) | Davide | fase 0 |
| Progetto Supabase nuovo: URL, anon key, service role | Davide crea, passa le chiavi come secret Cloudflare | fase 1 |
| Chiavi Turnstile (sito + segreto) | Davide, dashboard Cloudflare | fase 3 |
| Chiave Resend dedicata e dominio mittente verificato | Davide | fase 3 |
| Email admin autorizzata | Davide | fase 4 |
| Testi interfaccia sq/en ed email | MUSE, lanciata dal PM | fase 3-6 |
| Testo privacy e termini d'uso | LEX, lanciata dal PM | fase 6 |
| Offerta e prezzi «in evidenza» | STRATEGO + VAULT + PROFANO + firma in tre | progetto fase 2 |

## 11-bis. Il nome: questione chiusa, non riaprirla

Ricerca marchio fatta il 04/09/2026 su TMview (che non è un registro ufficiale): «tiranatodo» e «tirana events» non danno nessun marchio. Ne esiste uno vicino, **«TIRANA TODAY Lexo, bej diferencen»**, marchio combinato albanese AL/T/2020/000851, registrato il 10/11/2021 e in scadenza il 16/10/2030, **nella sola classe 35** (pubblicità online, pay-per-click, promozione vendite per terzi). Il titolare è il quotidiano online Tirana Today.

LEX ha consigliato di cambiare nome. **Davide ha deciso di tenere TiranaToDo**, e la decisione è sua: sta agli atti in `project_status.md`. ⛔ La sessione che costruisce non riapre la questione e non propone nomi.

L'unica cosa che ricade sulla costruzione: **conservare prove d'uso datate dal primo giorno**. In pratica, il primo deploy in produzione deve lasciare una traccia con data verificabile (commit firmato, cronologia dei deploy Cloudflare, prima pagina indicizzata). Non serve fare niente in più: serve non cancellarlo.

## 12. Regole per la sessione che costruisce

- Un task per sessione. Una fase alla volta, nell'ordine sopra.
- Report a fine fase: massimo 30 righe, conclusione in prima riga, prove (comandi eseguiti, output, screenshot), poi le righe `DA CHIEDERE A <chi>`.
- Un ritrovamento fuori fase non apre lavoro nuovo: si scrive nel report e si va avanti.
- Ogni numero non presente in questo piano si chiede, non si stima. Le eccezioni sono le soglie di §7, dichiarate come valori di partenza.
- Prima di dire «fatto» si riprova: un test che passava ieri non è la prova di oggi.
