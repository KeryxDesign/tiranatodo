# TiranaToDo — brief per Claude Design

Incolla questo testo come primo messaggio in un progetto Claude Design che ha agganciato il design system «Tirana Events Design System». Scritto il 2026-09-04 da Arcadio. Il piano completo del sito sta in PLAN.md, nello stesso repo: Claude Design non lo legge, gli basta questo.

---

Costruisci le pagine di **TiranaToDo**, portale eventi di Tirana per expat e turisti. Chi lo usa ha il telefono in mano, per strada, con una mano sola. Prima mobile a 390 px, poi desktop a 1280 px con la stessa pagina responsive: mai due file per la stessa pagina.

## Usa il design system, non inventare

- Importa solo `styles.css` del design system. Ogni colore, misura, raggio, ombra e font viene da un token `--te-*`. Nessun colore nuovo, nessun valore in px scritto a mano se esiste un token.
- Font: Figtree, una famiglia sola, pesi da 400 in su.
- Il rosso `--te-red` fa una cosa sola: azioni (bottone primario, link, FAB Add, cuore votato). Mai per categorie, badge o decorazioni.
- Chip attiva = nera, per data e categoria. Categorie: le undici del design system (`music, nightlife, theatre, cinema, art, food, sport, family, meetups, outdoors, other`), ognuna col suo tag colorato e l'etichetta sempre scritta.
- Icone: Lucide, tratto 2 px. Mai un'icona da sola dove serve una parola.
- Parti dai template `Lista eventi (mobile)` e `Dettaglio evento (mobile)` e dai componenti già pronti (barra filtri, ricerca, card evento, testata, bottoni e voto, campi form, badge, stati, navigazione). Se un pezzo manca, lo costruisci come classe `te-<nome>` con soli token e lo dichiari nel report.

## Pavimento di leggibilità, non negoziabile

Corpo ≥ 17 px · ogni altro testo ≥ 15 px · H1 ≥ 28 px · contrasto testo/fondo ≥ 4,5:1 (3:1 solo sopra i 24 px) · peso ≥ 400 · filetti ≥ 1 px · tap target ≥ 44×44 · campi form alti 52 con testo 17 · niente scroll orizzontale della pagina. Link sottolineati.

## Pagine da costruire, una per messaggio, in quest'ordine

1. **Lista eventi** (home). Header 56 con logo segnaposto, ricerca, barra filtri sticky (chip Today · Tomorrow · Weekend · icona data; categorie a scorrimento; contatore risultati), lista raggruppata per giorno con card compatte, primo slot riservato a una card «Featured» con il suo stile, bottone «Load more» in fondo (niente scroll infinito), barra in basso a cinque con Add rosso al centro, piede nero con lingua `EN | SQ | IT`. Stati: con risultati, zero risultati, caricamento (skeleton).
2. **Dettaglio evento**. Foto 4:3 con fallback fondo colore categoria, titolo 28, tre righe di fatti (quando, dove con link mappa, prezzo o Free), cuore «I'm interested» con contatore, azioni Add to calendar · Share · Tickets, descrizione, organizzatore (solo nome), «More in this category», «Same day», CTA biglietti fissa in basso solo se l'evento è a pagamento. Variante evento passato: banner «This event has ended», voto e calendario disabilitati.
3. **Submit event**. Un modulo solo su una pagina, cinque blocchi: (1) titolo, categoria, data e ora inizio, fine opzionale, «all day»; (2) luogo nome + indirizzo, Free sì/no, prezzo in testo, link biglietti; (3) descrizione max 1.500 caratteri con contatore visibile; (4) immagine: un file, anteprima, suggerimento 4:5, frase «no image? we use a colour background»; (5) nome organizzatore (pubblico), email e telefono (privati, dichiarato), consenso privacy con checkbox **non pre-spuntata**. Errori con icona e parola sotto il campo. Bottone finale rosso 56.
4. **Received**. Pagina di conferma: «Got it. We publish within 24 hours», link a lista.
5. **Admin, accesso**. Un campo email e un bottone «Send me a link». Nessuna password.
6. **Admin, coda**. Tab In review · Published · Rejected · Vote alerts. Ogni riga è la card come la vedrà il pubblico più le azioni: Approve · Edit then approve · Reject with reason · Duplicate · Feature until date · Freeze votes · Archive. Usabile da telefono con una mano: le azioni stanno in un foglio dal basso, non in una riga di sette bottoni.
7. **404** e **pagina privacy** con testo segnaposto.

## Testi

Tutte le etichette in inglese, segnaposto: il copy vero lo scrive un copywriter dopo. Alla fine di ogni pagina scrivi un elenco `chiave → testo` di ogni stringa visibile, perché diventeranno file di traduzione (EN default, SQ, IT). Date nel formato «Sat 12 Sep, 21:00». Prezzi d'esempio in Lek, marcati come esempio.

## Cosa non fare

- Nessun prezzo di listino, nessuna pagina prezzi, nessun «premium»: lo slot «Featured» esiste, il suo prezzo no.
- Nessun voto negativo, nessuna stella: solo il cuore. Sotto 5 voti si vede l'icona senza numero.
- Nessun login per votare o cercare.
- Nessuna libreria oltre al design system e alle icone Lucide. Nessuna logica di backend: solo l'interfaccia e i suoi stati.
- Non cambiare i token. Se un token ti sembra sbagliato, lo scrivi nel report e vai avanti.

## Come consegni ogni pagina

HTML semantico (`header`, `nav`, `main`, `footer`; `button` per le azioni, `a` per i link), etichette collegate ai campi, `aria-label` sulle icone. Screenshot a 390 e a 1280. Poi tre righe: cosa hai costruito, cosa manca nel design system, quali stringhe hai aggiunto.

---

## Per Davide, fuori dal brief

- Prima di incollare: verifica che nel progetto Claude Design del design system compaiano le 15 schede (4 fondamenta, 9 componenti, 2 template). Se è vuoto, il caricamento di LORI non è finito.
- Le categorie del design system (11) non coincidono con quelle di PLAN.md §4 (10: ha talks e markets, non ha cinema separato). LORI le ha cambiate con una ragione scritta nel readme del DS. Il brief segue il DS. PLAN.md §4 va allineato: una riga, lo faccio quando dici.
- Ogni pagina uscita da Claude Design passa da LORI prima di scendere nel repo: fino a tre giri, finché scrive APPROVATO.
