---
name: Invio e pubblicazione eventi via email (fase manuale, pre-modulo)
classe: D
owner: OPS
stato: PROPOSTA — non ratificata da Davide
created: 2026-09-05
prima_revisione: alla Fase 3 di PLAN.md (quando il modulo `/submit` sostituisce la mail) — se prima non arriva, backstop 2026-12-04
origine: richiesta diretta di Davide, 2026-09-04/05 — «inventa procedura per caricare eventi che passa tramite mail mandando informazioni fisse»
---

# SOP — Invio e pubblicazione eventi via email

**Owner:** OPS. **Esecutore oggi:** Davide, da solo, a mano. **Decide i rifiuti dubbi:** Davide.
**Progetto:** TiranaToDo — non è un cliente Keryx, non esiste `clienti/tiranatodo/`. Contesto in `Documents/Claude/tiranatodo/PLAN.md`.

## 1. A cosa serve, e cosa non copre

Serve a far arrivare un evento da un organizzatore (bar, centro culturale, chi organizza incontri per expat) fino a un registro pronto per il sito, **oggi via email, a mano**, con un formato abbastanza rigido da poter essere letto da uno script il giorno in cui basterà una regex e non serve più un umano.

**Non copre:**
- Il testo che l'organizzatore legge (oggetto dell'esempio, messaggi di richiesta/rifiuto, email di conferma): quello è di **MUSE**, lanciato dal PM quando si scrivono i materiali reali. Qui sotto i campi sono nominati in modo tecnico, non nelle parole che vedrà l'organizzatore.
- La pubblicazione tecnica sul mockup statico (`https://keryxdesign.github.io/tiranatodo/`): il mockup non ha database né templating, quindi un evento accettato oggi **non ha dove finire online**. Resta nel registro (§5) finché non esiste il sito vero (PLAN.md, Fasi 0-4) o finché Davide non decide di persona di editare l'HTML a mano — non è compito di questa SOP.
- Prezzi, offerte «in evidenza», qualunque cifra di vendita: PLAN.md §9 e §11 li affida a STRATEGO+VAULT+PROFANO. Zero numeri di soldi qui dentro.

**Stop condition:** questa SOP smette di valere per la parte "lato organizzatore" (§2) il giorno in cui la Fase 3 di PLAN.md va in produzione: da lì il modulo `/submit` fa il lavoro dei campi fissi, e i campi restano solo come specifica per chi scrive quella Function. La parte "controlli pre-pubblicazione" e "motivi di rifiuto" (§4) **non decade**: si sposta dentro la logica del pannello admin.

## 2. Lato organizzatore — cosa manda

### 2.1 L'oggetto della mail, formato fisso

```
[TIRANATODO] <AZIONE> | <categoria> | <YYYY-MM-DD> | <titolo>
```

- `<AZIONE>` ∈ `NUOVO` · `MODIFICA` · `ANNULLA` (fisso, tre soli valori, in maiuscolo).
- `<categoria>` è una delle undici chiavi del modello dati (PLAN.md §4, allineate al design system 04/09/2026): `music`, `nightlife`, `theatre`, `cinema`, `art`, `food`, `sport`, `family`, `meetups`, `outdoors`, `other`. ⚠️ Nota per chi scrive il testo pubblico: il brief di lancio parlava di "food & drink", ma la fonte tecnica vigente (PLAN.md, enum di database e design system) usa `food`. Vince PLAN.md: è l'enum che il sito vero salverà.
- `<YYYY-MM-DD>` è la data di inizio evento, sempre in questo formato: risolve da solo l'ambiguità 12/09 vs 09/12 perché l'anno viene prima e il mese è sempre a due cifre in seconda posizione.
- Separatore fisso: spazio-pipe-spazio ( ` | ` ), sempre lo stesso numero di pipe (tre), sempre nello stesso ordine. Una macchina domani spacca la stringa su ` | ` e prende i primi tre campi come azione/categoria/data, tutto il resto come titolo.

Esempio vero:
```
[TIRANATODO] NUOVO | music | 2026-09-12 | Jazz Night at Radio Bar
```
Esempio di annullamento, stesso schema:
```
[TIRANATODO] ANNULLA | music | 2026-09-12 | Jazz Night at Radio Bar
```

⛔ Il carattere `|` non deve comparire dentro titolo, luogo o indirizzo: se arriva lo stesso, chi legge lo sostituisce con un trattino prima di archiviare, non lo lascia nell'oggetto originale.

### 2.2 Il corpo della mail, campi fissi in ordine fisso

Un campo per riga, `NOME_CAMPO: valore`. Ordine non negoziabile — è quello che permetterà un domani il parsing senza un modello linguistico:

| # | Campo | Obbligatorio | Formato |
|---|---|---|---|
| 1 | `TITLE` | **sì** | testo libero, no `\|` |
| 2 | `CATEGORY` | **sì** | una delle 11 chiavi di §2.1, minuscolo |
| 3 | `DATE_START` | **sì** | `YYYY-MM-DD` |
| 4 | `TIME_START` | **sì, salvo `ALL_DAY: YES`** | `HH:MM`, 24 ore |
| 5 | `DATE_END` | no | `YYYY-MM-DD`, solo se diverso da `DATE_START` |
| 6 | `TIME_END` | no | `HH:MM`, 24 ore |
| 7 | `ALL_DAY` | **sì** | `YES` / `NO` |
| 8 | `VENUE_NAME` | **sì** | testo libero |
| 9 | `ADDRESS` | **sì** | testo libero, indirizzo a Tirana |
| 10 | `IS_FREE` | **sì** | `YES` / `NO` |
| 11 | `PRICE` | **sì se `IS_FREE: NO`** | numero + `ALL` (Lek), es. `500 ALL`; mai altra valuta |
| 12 | `TICKET_URL` | no | URL completo |
| 13 | `DESCRIPTION` | no (raccomandato) | testo libero, max 1.500 caratteri (stesso tetto del modulo futuro, PLAN.md §5.3) |
| 14 | `PHOTO` | no | `ATTACHED` (allegata alla mail) / `LINK:<url>` / `NONE` |
| 15 | `ORGANIZER_NAME` | **sì** | testo libero, pubblico |
| 16 | `ORGANIZER_EMAIL` | **sì** | email valida, **privato** |
| 17 | `ORGANIZER_PHONE` | no | **privato** |
| 18 | `LANGUAGE` | no | `EN` / `SQ` / `IT` — assente = `EN` (default del sito, PLAN.md §6) |
| 19 | `CONSENT` | **sì** | deve essere `YES`; qualunque altro valore o riga assente = non trattabile |

**Data e ora:** sempre `YYYY-MM-DD` e `HH:MM` 24 ore, mai altro formato. È la stessa regola che risolve il caso Albania-vs-America citato nel task: con l'anno davanti non c'è lettura alternativa.

**Prezzo:** sempre in Lek (`ALL`), mai altra valuta scritta dall'organizzatore senza conversione dichiarata. `IS_FREE: YES` è un campo a sé, non un valore di `PRICE` — così un evento gratuito non lascia `PRICE` vuoto per errore, lo dichiara.

**Foto:** allegato ammesso JPG/PNG/WebP, **peso massimo 5 MB** (stesso tetto del modulo futuro, PLAN.md §5.4, per non avere due limiti diversi da riconciliare più avanti). Oltre i 5 MB o se l'organizzatore preferisce: `PHOTO: LINK:<url>` a un file su Drive/WeTransfer/simili. `PHOTO: NONE` è accettato: il sito userà il fondo colore della categoria (PLAN.md §5.4), l'evento non si ferma per l'immagine.

### 2.3 Se manca un campo obbligatorio

Non si pubblica e non si scarta subito. Una sola mail di risposta che elenca **con precisione** quali campi mancano o sono nel formato sbagliato (mai "compila meglio", sempre il nome del campo), chiedendo di rimandare **l'intera mail corretta**, non solo il pezzo mancante — un thread con mezza informazione in un punto e mezza in un altro è quello che rompe il parsing futuro. Termine per la correzione: 48 ore (⏳ STIMA DA VALIDARE, la valida Davide dopo le prime settimane reali). Scaduto il termine senza risposta: si archivia come `NON COMPLETATO` nel log (§5), non come rifiuto — sono due esiti diversi e si contano separati.

## 3. Lato nostro — quando arriva la mail

**Chi legge:** Davide, unico esecutore in questa fase. Non c'è ancora una casella `events@tiranatodo.com` reale — il dominio non è registrato (PLAN.md, intestazione). ⚠️ **Dichiarato, non risolto:** finché non esiste, la casella di raccolta effettiva è quella che Davide comunica di volta in volta agli organizzatori; questa SOP descrive il formato del messaggio, non l'indirizzo che lo riceve.

**Ogni quanto:** una lettura al giorno, dato il volume atteso (unità a settimana). ⏳ STIMA DA VALIDARE.

**Tempo di risposta all'organizzatore:** entro 24 ore dall'arrivo. Scelto per coincidere con la promessa già scritta per il modulo futuro (PLAN.md §5: «lo pubblichiamo entro 24 ore»), così il giorno in cui il modulo sostituisce la mail non cambia un tempo dichiarato — evita il guasto B del governo delle SOP (due promesse diverse per la stessa cosa). ⏳ STIMA DA VALIDARE sul volume reale.

## 4. Controlli prima di pubblicare, in ordine

1. **Formato.** Oggetto e corpo rispettano §2.1 e §2.2? Se no → §2.3.
2. **Campi obbligatori completi e validi** (data reale ed esistente, email con la forma di un'email, `CONSENT: YES` presente).
3. **Categoria riconosciuta** fra le 11 chiavi. Se non riconosciuta: non si assegna `other` in automatico, si chiede conferma all'organizzatore — sbagliare qui sporca il filtro che userà chi legge il sito.
4. **Data non passata**, e coerente con `ALL_DAY`/`TIME_START`.
5. **Prezzo coerente**: se `IS_FREE: NO` deve esserci `PRICE`; se `IS_FREE: YES` non deve esserci `PRICE`.
6. **Foto conforme**, se presente: formato e peso di §2.2. Se non conforme, **non si rifiuta l'intero evento**: si pubblica senza foto (fallback colore) e si avvisa l'organizzatore.
7. **Non duplicato**: stesso titolo, stessa data, stesso luogo di un evento già pubblicato o in coda.
8. **È un evento reale e pubblico**, non pubblicità mascherata da evento, non un evento privato/chiuso a iscritti.
9. **Contenuto lecito**: niente di illegale, discriminatorio, violento, o per adulti non dichiarato come tale.

### Motivi di rifiuto (elenco secco, unico e citabile in ogni risposta)

1. Campo obbligatorio mancante o errato, non corretto entro il termine di §2.3.
2. Data dell'evento non valida o già passata.
3. Categoria non riconoscibile fra le undici e non chiarita dall'organizzatore.
4. Non è un evento reale aperto al pubblico (pubblicità mascherata, evento privato o chiuso).
5. Contenuto vietato per legge o per decenza (illegale, discriminatorio, violento, per adulti non dichiarato).
6. Duplicato di un evento già pubblicato o già in coda.
7. Manca il consenso esplicito al trattamento dei dati (`CONSENT` assente o diverso da `YES`).

⛔ Un evento non si rifiuta per un motivo fuori da questa lista. Se ne serve uno nuovo, si aggiunge qui prima di usarlo, non si inventa nella singola risposta.

### Cosa si risponde a chi manda male

Una sola mail, che nomina il campo esatto e chiede di rimandare tutto il messaggio corretto (§2.3). Il testo lo scrive MUSE quando si producono i materiali reali; qui è fissato solo **cosa** deve contenere la risposta: quali campi, quale termine, dove rimandare.

## 5. Dove finisce l'evento accettato

Un evento che passa tutti i controlli di §4 va in un **registro locale**, con colonne che rispecchiano il modello dati futuro (PLAN.md §3, tabella `events`) meno gli ID tecnici — così il giorno in cui il sito vero esiste, importarlo è un caricamento, non una riscrittura:

`Documents/Claude/tiranatodo/eventi/registro_eventi.csv`

Colonne: `title, category, date_start, time_start, date_end, time_end, all_day, venue_name, address, is_free, price, ticket_url, description, photo, organizer_name, organizer_email, organizer_phone, lang, status, source, received_at, published_at`. `status` ∈ `pending`/`published`/`rejected`/`cancelled`. `source` sempre `email` in questa fase (corrisponde al futuro `source = form`).

Ogni mail arrivata, accettata o no, lascia una riga in un secondo file di log — l'equivalente manuale di `submissions_log` (PLAN.md §3):

`Documents/Claude/tiranatodo/eventi/log_invii.md`

con data, oggetto ricevuto, esito, motivo (uno dei sette di §4, o `NON COMPLETATO`, o `OK`).

## 6. Eventi annullati o spostati dopo la pubblicazione

È il caso che fa più danno: chi legge esce di casa per niente. Procedura:

1. L'organizzatore manda una nuova mail con oggetto `[TIRANATODO] ANNULLA | ...` o `[TIRANATODO] MODIFICA | ...` (stesso schema di §2.1), riferita allo stesso titolo e alla stessa data originale.
2. Si aggiorna la riga nel registro (§5) lo stesso giorno in cui arriva la mail, non alla lettura successiva: `status = cancelled`, oppure i campi data/ora aggiornati per `MODIFICA`.
3. Se l'evento era già visibile da qualche parte (sito vero, quando esisterà), la rimozione o la modifica ha priorità su qualunque altra lettura di posta della giornata.
4. Avvisare chi aveva mostrato interesse (voti «Mi interessa», PLAN.md §7) non è costruito: è una funzione di fase 2 del progetto, non esiste oggi. Si dichiara qui perché non si scopra dopo.

## 7. Checklist pre-consegna (prima di considerare un evento "pronto")

- [ ] Oggetto conforme a §2.1, azione corretta.
- [ ] Tutti i campi obbligatori di §2.2 presenti e nel formato giusto.
- [ ] Data non passata, coerente con `ALL_DAY`.
- [ ] Categoria fra le undici, o chiarita.
- [ ] Prezzo coerente con `IS_FREE`.
- [ ] Foto conforme o `NONE`/fallback deciso.
- [ ] Nessuno dei sette motivi di rifiuto si applica.
- [ ] Riga scritta in `registro_eventi.csv` e in `log_invii.md`.

## 8. Tabella costi

Non applicabile: progetto personale di Davide, nessun prezzo a cliente in questa fase. Se in futuro TiranaToDo vende «in evidenza» (PLAN.md §9), la forma e il numero li fanno STRATEGO e VAULT con lettura di PROFANO e firma in tre (PLAN.md §11) — non questa SOP.

## 9. Struttura cartelle

```
Documents/Claude/tiranatodo/
├── PLAN.md
├── sop/
│   └── sop_invio_eventi_via_email.md   (questo file)
└── eventi/
    ├── registro_eventi.csv
    └── log_invii.md
```

## 10. Da chiedere, non deciso qui

- **DA CHIEDERE A LEX:** l'indirizzo email dell'organizzatore (`ORGANIZER_EMAIL`) e il telefono (`ORGANIZER_PHONE`) sono dati personali raccolti via mail e conservati in un registro locale, senza informativa privacy pubblicata (il sito è solo un mockup oggi). Che cosa serve per essere a norma in questa fase manuale — un'informativa minima da inviare nella mail di conferma, un tempo di conservazione, una base giuridica — prima che esista una pagina privacy vera?
- Nessun altro punto fuori perimetro trovato durante la stesura: il resto rientra nel mestiere OPS (formato, controlli, registro) o è già assegnato da PLAN.md (testi a MUSE, prezzi a STRATEGO/VAULT, sito a SENTINEL/LORI).
