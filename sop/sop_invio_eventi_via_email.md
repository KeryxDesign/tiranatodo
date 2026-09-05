---
name: Invio e pubblicazione eventi via email (fase manuale, pre-modulo)
classe: D
owner: OPS
stato: PROPOSTA — non ratificata da Davide
created: 2026-09-05
prima_revisione: alla Fase 3 di PLAN.md (quando il modulo `/submit` sostituisce la mail) — se prima non arriva, backstop 2026-12-04
origine: richiesta diretta di Davide, 2026-09-04/05 — «inventa procedura per caricare eventi che passa tramite mail mandando informazioni fisse»
revisioni:
  - 2026-09-05, OPS — segnaposto dentro il modello copiabile (§2.2-bis/ter/quater/quinquies, §2.4, §2.4-bis) e terna d'azione in inglese (§2.1). Due decisioni di Davide del 05/09/2026 dentro una SOP che resta PROPOSTA.
  - 2026-09-05, OPS — la testa passa da **una riga da 60** a **due righe da 28** più riga vuota (§2.2-quater, §2.2-bis, §10). Causa: misura di LORI del 05/09/2026 sul contenitore reale — la premessa «60 caratteri stanno sotto la riga dell'oggetto» era falsa. ⚠️ Il «31 caratteri» previsto in §2.2-bis era **giusto** (`PHOTO:`, misurato 31): la correzione a 24 introdotta in questa revisione veniva da un brief sbagliato del PM ed è stata ritirata lo stesso giorno.
---

# SOP — Invio e pubblicazione eventi via email

**Owner:** OPS. **Esecutore oggi:** Davide, da solo, a mano. **Decide i rifiuti dubbi:** Davide.
**Progetto:** TiranaToDo — non è un cliente Keryx, non esiste `clienti/tiranatodo/`. Contesto in `Documents/Claude/tiranatodo/PLAN.md`.

### Decisioni di Davide già prese dentro questa SOP

La SOP nel complesso resta **PROPOSTA — non ratificata**. Queste due righe invece sono decise, e non si ridiscutono:

1. **L'esempio sta dentro il blocco copiabile** — decisione di Davide del **05/09/2026**, su domanda di LORI («la legenda si consulta dentro l'app di posta, dove la pagina non c'è più»). Origine: richiesta diretta, girata da LORI a OPS. Esecuzione: §2.2-bis, §2.2-ter, §2.4.
2. **Il token dell'azione è in inglese** — decisione di Davide del **05/09/2026**, diretta: `NEW` al posto di `NUOVO`. La terna intera l'ha decisa OPS come conseguenza, §2.1.

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

- `<AZIONE>` ∈ `NEW` · `EDIT` · `CANCEL` (fisso, tre soli valori, in maiuscolo).
  ⚡ **Terna in inglese, decisa il 05/09/2026.** Davide ha ratificato `NEW` al posto di `NUOVO`; la coerenza della terna è di OPS e la decisione è: **si traducono tutti e tre**. Tre ragioni, in ordine di peso:
  1. **Chi scrive non è italiano.** Il mittente tipo è un tedesco, un olandese, un albanese che scrive in inglese. `ANNULLA` non è indovinabile da nessuno di loro; `CANCEL` lo capisce anche chi ha un inglese debole.
  2. **Tutto il resto del protocollo è già inglese**: prefisso `[TIRANATODO]`, i 19 nomi di campo, i valori `YES`/`NO`, `EN/SQ/IT`, le undici chiavi di categoria. I tre token italiani erano l'unico dato non inglese dell'intera procedura.
  3. **Una terna mista è peggio di una terna italiana**: obbliga il mittente a ricordare quale dei tre sta in quale lingua. Un token si copia, non si traduce a metà.
  ⚠️ **Transizione:** una mail che arriva con `NUOVO` / `MODIFICA` / `ANNULLA` **si accetta lo stesso** e si tratta come il token inglese corrispondente; nella risposta si indica la forma nuova. ⛔ Non è un motivo di rifiuto e non se ne aggiunge uno (§4). Quando esisterà il parser, i tre token italiani restano nella tabella di sinonimi finché Davide non li toglie.
  ⚡ `CANCEL` è anche il valore che il registro già usa (`status = cancelled`, §5): un token, una parola, in due posti.
- `<categoria>` è una delle undici chiavi del modello dati (PLAN.md §4, allineate al design system 04/09/2026): `music`, `nightlife`, `theatre`, `cinema`, `art`, `food`, `sport`, `family`, `meetups`, `outdoors`, `other`. ⚠️ Nota per chi scrive il testo pubblico: il brief di lancio parlava di "food & drink", ma la fonte tecnica vigente (PLAN.md, enum di database e design system) usa `food`. Vince PLAN.md: è l'enum che il sito vero salverà.
- `<YYYY-MM-DD>` è la data di inizio evento, sempre in questo formato: risolve da solo l'ambiguità 12/09 vs 09/12 perché l'anno viene prima e il mese è sempre a due cifre in seconda posizione.
- Separatore fisso: spazio-pipe-spazio ( ` | ` ), sempre lo stesso numero di pipe (tre), sempre nello stesso ordine. Una macchina domani spacca la stringa su ` | ` e prende i primi tre campi come azione/categoria/data, tutto il resto come titolo.

Esempio vero (⚠️ **esempio da SOP, non da modello copiabile**: qui i valori sono reali perché questo file lo leggiamo noi e non finisce in nessuna casella di posta — dentro il modello copiabile vale §2.2-ter):
```
[TIRANATODO] NEW | music | 2026-09-12 | Jazz Night at Radio Bar
```
Esempio di annullamento, stesso schema:
```
[TIRANATODO] CANCEL | music | 2026-09-12 | Jazz Night at Radio Bar
```

⛔ Il carattere `|` non deve comparire dentro titolo, luogo o indirizzo: se arriva lo stesso, chi legge lo sostituisce con un trattino prima di archiviare, non lo lascia nell'oggetto originale.

### 2.2 Il corpo della mail, campi fissi in ordine fisso

Un campo per riga, `NOME_CAMPO: valore`. Ordine non negoziabile — è quello che permetterà un domani il parsing senza un modello linguistico:

| # | Campo | Obbligatorio | Formato | Nel modello copiabile (§2.2-bis) |
|---|---|---|---|---|
| 1 | `TITLE` | **sì** | testo libero, no `\|` | `<title>` |
| 2 | `CATEGORY` | **sì** | una delle 11 chiavi di §2.1, minuscolo | `<category>` |
| 3 | `DATE_START` | **sì** | `YYYY-MM-DD` | `<YYYY-MM-DD>` |
| 4 | `TIME_START` | **sì, salvo `ALL_DAY: YES`** | `HH:MM`, 24 ore | `<HH:MM>` |
| 5 | `DATE_END` | no | `YYYY-MM-DD`, solo se diverso da `DATE_START` | `<YYYY-MM-DD>` |
| 6 | `TIME_END` | no | `HH:MM`, 24 ore | `<HH:MM>` |
| 7 | `ALL_DAY` | **sì** | `YES` / `NO` | `<YES/NO>` |
| 8 | `VENUE_NAME` | **sì** | testo libero | `<venue>` |
| 9 | `ADDRESS` | **sì** | testo libero, indirizzo a Tirana | `<address>` |
| 10 | `IS_FREE` | **sì** | `YES` / `NO` | `<YES/NO>` |
| 11 | `PRICE` | **sì se `IS_FREE: NO`** | numero + `ALL` (Lek), es. `500 ALL`; mai altra valuta | `<NNN ALL>` |
| 12 | `TICKET_URL` | no | URL completo | `<url>` |
| 13 | `DESCRIPTION` | no (raccomandato) | testo libero, max 1.500 caratteri (stesso tetto del modulo futuro, PLAN.md §5.3) | `<text>` |
| 14 | `PHOTO` | no | `ATTACHED` (allegata alla mail) / `LINK:<url>` / `NONE` | `<ATTACHED/LINK:url/NONE>` |
| 15 | `ORGANIZER_NAME` | **sì** | testo libero, pubblico | `<name>` |
| 16 | `ORGANIZER_EMAIL` | **sì** | email valida, **privato** | `<email>` |
| 17 | `ORGANIZER_PHONE` | no | **privato** | `<phone>` |
| 18 | `LANGUAGE` | no | `EN` / `SQ` / `IT` — assente = `EN` (default del sito, PLAN.md §6) | `<EN/SQ/IT>` |
| 19 | `CONSENT` | **sì** | deve essere `YES`; qualunque altro valore o riga assente = non trattabile | `<YES/NO>` |

**Data e ora:** sempre `YYYY-MM-DD` e `HH:MM` 24 ore, mai altro formato. È la stessa regola che risolve il caso Albania-vs-America citato nel task: con l'anno davanti non c'è lettura alternativa.

**Prezzo:** sempre in Lek (`ALL`), mai altra valuta scritta dall'organizzatore senza conversione dichiarata. `IS_FREE: YES` è un campo a sé, non un valore di `PRICE` — così un evento gratuito non lascia `PRICE` vuoto per errore, lo dichiara.

**Foto:** allegato ammesso JPG/PNG/WebP, **peso massimo 5 MB** (stesso tetto del modulo futuro, PLAN.md §5.4, per non avere due limiti diversi da riconciliare più avanti). Oltre i 5 MB o se l'organizzatore preferisce: `PHOTO: LINK:<url>` a un file su Drive/WeTransfer/simili. `PHOTO: NONE` è accettato: il sito userà il fondo colore della categoria (PLAN.md §5.4), l'evento non si ferma per l'immagine.

### 2.2-bis Il modello copiabile, forma canonica

⚡ **Questa è la fonte.** Il blocco `<pre class="te-copybox" id="mail-template">` di `docs/submit-evento.html` è una **copia** di quello che sta qui sotto: se i due divergono, vince questo file e la pagina si riallinea. ⛔ Chi cambia una riga qui cambia la pagina **e** il registro di §2.4-bis nello stesso giro — sono tre posti, una sola verità.

```
To: events@tiranatodo.com
Subject: [TIRANATODO] NEW | <category> | <YYYY-MM-DD> | <title>

# [MUSE riga 1, §2.2-quater]
# [MUSE riga 2, §2.2-quater]

TITLE: <title>
CATEGORY: <category>
DATE_START: <YYYY-MM-DD>
TIME_START: <HH:MM>
DATE_END: <YYYY-MM-DD>
TIME_END: <HH:MM>
ALL_DAY: <YES/NO>
VENUE_NAME: <venue>
ADDRESS: <address>
IS_FREE: <YES/NO>
PRICE: <NNN ALL>
TICKET_URL: <url>
DESCRIPTION: <text>
PHOTO: <ATTACHED/LINK:url/NONE>
ORGANIZER_NAME: <name>
ORGANIZER_EMAIL: <email>
ORGANIZER_PHONE: <phone>
LANGUAGE: <EN/SQ/IT>
CONSENT: <YES/NO>
```

**Le due eccezioni, dichiarate perché sono eccezioni:**

- **`To: events@tiranatodo.com` non ha le parentesi angolari, e non deve averle.** La convenzione di §2.2-ter dice «tutto ciò che sta fra `<` e `>` lo devi sostituire tu»: mettere l'indirizzo fra parentesi direbbe al mittente di inventarsene uno. L'indirizzo si copia com'è. ⚠️ Che il dominio non sia ancora registrato è un altro problema, dichiarato in §3, e sulla pagina lo segnala LORI col suo marcatore visivo — non con questa convenzione.
- **`NEW` nell'oggetto è scritto per esteso, ed è l'unico valore vero precompilato di tutto il modello.** Ragione: è l'unico caso in cui un segnaposto **non sostituito produce il comportamento giusto**. Chi copia questo blocco sta mandando un evento nuovo — la pagina si chiama «manda un evento» — quindi `NEW` lasciato lì è corretto, non è un errore da intercettare. `EDIT` e `CANCEL` li usa chi ha già mandato una mail, e la forma gliela diamo noi nella risposta (§6): non ha bisogno di trovarla qui. ⛔ Questa eccezione vale **solo** per l'azione: nessun altro campo prende un valore vero.

**Forma canonica del blocco, e si conta:** `To:` · `Subject:` · **riga vuota** · **due righe `#`** (§2.2-quater) · **riga vuota** · **19 righe di campo**. La riga vuota dopo il blocco `#` **fa parte del modello**: è lei che separa il commento dai campi, e senza di lei la seconda riga `#` mandata a capo dal contenitore si incolla sopra `TITLE:`. ⛔ Non si toglie e non si sposta. ⚡ Il parser non la vede: non contiene `:` e non entra in `^([A-Z_]+):[ ]?(.*)$`.

**Lunghezza delle righe — misurata da LORI il 05/09/2026, non stimata.** Il contenitore `.te-copybox` a 375 px di viewport tiene **30 caratteri per riga** (content-box 309 px, `ui-monospace` 17 px, avanzamento 10,235 px). Da lì i tre fatti:
- la riga di corpo più lunga è **31 caratteri** (`PHOTO: <ATTACHED/LINK:url/NONE>`), e va a capo di un carattere. Le altre 18 stanno su una riga visiva sola, e la più lunga fra loro è **24** (`ORGANIZER_EMAIL: <email>`). ⚠️ La previsione originale di questo paragrafo — 31 su `PHOTO:` — era **giusta**; l'errore sta nel brief del PM del 05/09/2026, che ha riportato il 24 di LORI come se fosse il massimo di tutte e 19. ⚡ **Il wrap di `PHOTO:` si accetta, e la ragione è la stessa che vieta quello della riga `#`:** lì la continuazione parte a filo sinistro **senza** il `#` e si legge come un campo; qui la continuazione è `NONE>`, che non ha i due punti e quindi non somiglia a nessun campo. ⛔ E in nessuno dei due casi il wrap tocca il testo copiato: è resa a schermo, non contenuto;
- la riga più lunga del blocco resta l'**oggetto, 63 caratteri**, prima e dopo questa modifica: va a capo, ed è accettato — è una riga di intestazione mail, non un commento che deve distinguersi dai campi;
- ⛔ **non si compra spazio col CSS.** Verificato da LORI: padding 16→12 lascia 30 caratteri (guadagno zero), 16→8 dà 31 caratteri rompendo la spaziatura del design system. Verdetto: nessun CSS. Il vincolo si mette sul testo, non sul contenitore.

### 2.2-ter La convenzione del segnaposto

**Una regola sola, e regge tutto il resto: dentro il modello copiabile non compare mai un valore che il sistema accetterebbe.** Tutto ciò che è precompilato sta fra parentesi angolari `<…>` — la stessa forma che §2.1 usa già per `<AZIONE>`, `<categoria>`, `<YYYY-MM-DD>` e che `PHOTO: LINK:<url>` usa già dentro un valore. Non si inventa una convenzione nuova: si estende quella che c'è.

⚡ **Il rischio che questa regola compra, e va detto perché è il motivo per cui la regola esiste:** il pericolo non è il parser, è che qualcuno rimandi il modello con dentro il nostro esempio e noi pubblichiamo un evento che si chiama come l'esempio. Un `TITLE: Jazz Night at Radio Bar` lasciato lì è indistinguibile da un evento vero. Un `TITLE: <title>` no, e non lo è **nemmeno per una macchina**.

**Da qui discendono tre divieti operativi:**

- ⛔ **Nessun segnaposto è un valore valido.** `<YYYY-MM-DD>` insegna il formato meglio di `2026-09-12` e non è una data; `<YES/NO>` mostra i due valori ammessi e non è nessuno dei due; `<NNN ALL>` mostra dove va la valuta e non è un prezzo. Il **valore vero d'esempio** (`2026-09-12`, `500 ALL`, `music`) sta **sulla pagina**, nella legenda dei formati, dove non può viaggiare dentro una mail. ⚡ È la divisione del lavoro fra i due pezzi: **la legenda insegna con un esempio vero, il modello insegna con una forma inservibile.**
- ⛔ **Mai un segnaposto che somigli a una cosa reale.** Niente nomi di locali di Tirana, niente indirizzi plausibili, niente nomi di persona, niente titoli di eventi credibili. Se un segnaposto è verosimile, il giorno che sfugge al controllo pubblichiamo un fatto falso su un luogo che esiste.
- ⛔ **`CONSENT` non è mai precompilato col valore che serve a noi.** Il campo vale solo `YES`, e scrivere `CONSENT: <YES>` sarebbe la versione via mail della casella pre-spuntata che PLAN.md §5.5 vieta sul modulo. Il segnaposto è `<YES/NO>`: se un client di posta mangia le parentesi resta `YES/NO`, che non è `YES`, quindi non passa il controllo. Il consenso lo scrive la persona, sempre.

**Il confine fra dato e copy, misurabile:** dentro le parentesi, **una parola sola in minuscolo, una forma (`YYYY-MM-DD`, `HH:MM`, `NNN`) o un elenco di valori separati da `/` è un dato**, e lo scrive OPS — sono gli stessi token che §2.1 già usa e che la pagina già mostra dentro `<code>`. ⛔ **Più di una parola è copy, e lo scrive MUSE** (regola 0). ⚠️ Vale anche per le tre lingue: i token dentro `<…>` **non si traducono** in SQ/IT, esattamente come i valori dentro `<code>` nella legenda.

### 2.2-quater La riga di testa

Il modello porta in cima al corpo un **blocco di due righe**, ciascuna delle quali comincia con `#`, seguito da una **riga vuota**. Serve, e i segnaposto da soli non bastano, perché deve portare due fatti che nessun segnaposto può dire da sé:

1. che **tutto quello che sta fra `<` e `>` va sostituito**, parentesi comprese — senza questa frase un mittente può pensare che le parentesi facciano parte del formato e lasciarle dentro il valore;
2. che **le 19 righe restano tutte**, anche quelle che si lasciano vuote — l'ordine fisso è quello che permette il parsing (§2.2), e una riga cancellata lo rompe.

**Vincoli del blocco**, che sono di OPS:
- **due righe**, non una e non tre. Ogni riga comincia con `#` e uno spazio.
- **massimo 28 caratteri per riga**, `#` e spazio compresi. ⛔ Il tetto è per riga, non per il blocco: due righe da 28 sono ammesse, una riga da 40 no.
- **una riga vuota subito dopo la seconda `#`**, prima di `TITLE:`. Fa parte del modello canonico (§2.2-bis).
- ⛔ nessuna parentesi angolare dentro — se le contenesse il blocco sarebbe lui stesso un segnaposto per il controllo di §2.4.

⚡ **Perché 28 e non 60, e perché due righe.** Misura di LORI del 05/09/2026: `.te-copybox` a 375 px tiene **30 caratteri per riga**. Il vecchio tetto di 60 poggiava sulla premessa «sto sotto la riga dell'oggetto, che è il caso peggiore»: la premessa era vera sul numero di caratteri e falsa sull'effetto, perché **l'oggetto e il commento non si rompono allo stesso modo**. ⛔ Il difetto non è l'andare a capo: è che **la riga di continuazione riparte a filo sinistro esattamente come `TITLE:`, senza il `#`, incollata sopra l'elenco dei campi — e si legge come un campo, non come un commento.** Una riga da 60 diventa 2 righe visive nel caso buono e 3 nel cattivo, cioè fino a 2 righe che sembrano campi. Due righe da 28 ci stanno per intero, portano il `#` ognuna, e la riga vuota chiude il blocco. **I 2 caratteri di margine su 30 non si spendono:** proteggono da un carattere accentato, da uno zoom di sistema e dall'arrotondamento di un browser diverso.

⛔ **Il CSS non è una via d'uscita** (§2.2-bis): il contenitore è stato provato e non cede spazio. Se il testo non ci sta, si accorcia il testo.

⛔ **Il testo in inglese non lo scrive OPS.** Qui è fissata solo la funzione e la misura: le parole sono di **MUSE** (§10), e i due fatti si dividono uno per riga — riga 1 le parentesi da sostituire, riga 2 le 19 righe che restano tutte — salvo che MUSE trovi una divisione migliore dentro i 28 caratteri.

**Regola per il parser:** ogni riga che comincia con `#` si ignora, e le righe vuote pure. ⚡ **La regola era già generica, e per questo il passaggio da una riga a due non tocca il parsing:** «una riga sola» era una scelta di forma, non un vincolo tecnico. Il mittente **non è tenuto a cancellare il blocco**: se torna indietro è normale, non è un errore e non si conta da nessuna parte.

### 2.2-quinquies Perché il parsing futuro regge — verdetto

**Regge, e ne esce più forte.** La grammatica di riga non cambia: `^([A-Z_]+):[ ]?(.*)$`, 19 nomi noti, ordine fisso di §2.2. Un valore precompilato cambia **cosa** sta nel gruppo 2, mai la forma della riga. Le righe `To:` e `Subject:` non vengono raccolte per caso, perché non sono tutte maiuscole e quindi non entrano in `[A-Z_]+`.

⚡ **Il guadagno:** oggi il parser vedrebbe due soli stati, *vuoto* o *pieno*, e non saprebbe distinguere «non ha compilato niente» da «ha compilato tutto». Con i segnaposto gli stati diventano tre — **VUOTO · SEGNAPOSTO · VALORE** — e il terzo caso, che oggi non esiste, diventa riconoscibile e rifiutabile.

⛔ **La regressione, che è il motivo per cui §2.4 è obbligatoria:** un parser scritto ingenuamente come «valore non vuoto = campo presente» adesso vede **19 campi presenti** su un modello mai toccato, e pubblicherebbe un evento fatto di segnaposto. ⛔ **Nessun parser si scrive senza aver prima implementato §2.4.** Chi costruirà la Function `POST /api/submit` o l'importatore del registro (PLAN.md, Fasi 1 e 3) lo legge qui.

### 2.3 Se manca un campo obbligatorio

Non si pubblica e non si scarta subito. Una sola mail di risposta che elenca **con precisione** quali campi mancano o sono nel formato sbagliato (mai "compila meglio", sempre il nome del campo), chiedendo di rimandare **l'intera mail corretta**, non solo il pezzo mancante — un thread con mezza informazione in un punto e mezza in un altro è quello che rompe il parsing futuro. Termine per la correzione: 48 ore (⏳ STIMA DA VALIDARE, la valida Davide dopo le prime settimane reali). Scaduto il termine senza risposta: si archivia come `NON COMPLETATO` nel log (§5), non come rifiuto — sono due esiti diversi e si contano separati.

⚠️ **Un campo lasciato col segnaposto non è un campo mancante**: stessa procedura di risposta, esito diverso nel log. Vedi §2.4.

### 2.4 Segnaposto non sostituito — il controllo nuovo

È un esito **diverso** da «campo mancante» (§2.3), e si conta a parte: un campo mancante è una persona che non aveva il dato, un segnaposto non sostituito è una persona che non ha capito il modello. Sono due difetti diversi e si riparano con due frasi diverse.

**Come si riconosce** — un valore è un segnaposto se, dopo aver tolto gli spazi ai bordi, ricade in una di queste:

| | Regola | Copre |
|---|---|---|
| **R1** | comincia con `<` **e** finisce con `>` | il caso normale: `<title>`, `<YES/NO>` |
| **R2** | contiene `<` **o** `>` in uno dei 14 campi a formato vincolato (tutti tranne `TITLE`, `VENUE_NAME`, `ADDRESS`, `DESCRIPTION`, `ORGANIZER_NAME`) | il caso `PHOTO: LINK:<url>`, dove la parentesi sta dentro il valore e non ai bordi |
| **R3** | è identico — spazi normalizzati, maiuscole ignorate — a una stringa del registro §2.4-bis, **anche senza parentesi** | il client di posta che mangia le angolari incollando: resta `DATE_START: YYYY-MM-DD`, e va preso lo stesso |

⚠️ **R3 è quella che serve davvero**, e va spiegata: alcuni client trattano `<…>` come marcatura e la tolgono. Senza R3 un modello «pulito» dal client arriverebbe con valori nudi tipo `YYYY-MM-DD` o `email`, che nessuna delle altre due regole vede. Il costo di R3 è un falso positivo teorico — un locale che si chiama davvero `venue` — e l'esito di un falso positivo è **una domanda, mai un rifiuto**: costo accettato.

**Cosa si fa, per tipo di campo:**

- **Campo obbligatorio con segnaposto** → si tratta come §2.3 (una sola mail che nomina le righe, si chiede di rimandare tutto il messaggio), ma nel log l'esito è `SEGNAPOSTO`, non `NON COMPLETATO`.
- **Campo facoltativo con segnaposto** (i 7 di §2.2) → **si tratta come vuoto**, si pubblica lo stesso e si annota nel log. ⛔ Non si rimbalza un evento buono perché è rimasto un `<url>` in `TICKET_URL`: sarebbe sproporzionato.
- **Tutti e 19 i campi sono segnaposto** → il modello è tornato intatto. Esito `MODELLO INTATTO`, **una riga di log sola e una risposta sola**. ⛔ Non si elencano 19 errori a una persona che non ha compilato niente: si spiega una volta come si compila.

**I tre divieti che chiudono il controllo:**
- ⛔ **Non si indovina mai il valore.** Un segnaposto non si sostituisce a mano con quello che sembra sensato, nemmeno se il resto della mail lo suggerisce.
- ⛔ **Non finisce mai nel registro un valore che contiene `<` o `>`.** Vale anche per i campi facoltativi: lì il segnaposto diventa cella vuota, non testo copiato.
- ⛔ **Non si aggiunge un ottavo motivo di rifiuto.** Un segnaposto è un errore di formato: se non viene corretto entro il termine di §2.3 ricade nel motivo 1 già esistente (§4). La lista dei sette resta di sette.

### 2.4-bis Registro dei segnaposto — la lista che il parser confronta

⚡ Queste sono le stringhe esatte, **senza parentesi**, che la regola R3 cerca. Sono 15 per 19 campi, perché alcune si ripetono. ⛔ **Chi cambia il modello di §2.2-bis aggiorna questa lista nello stesso giro:** una stringa che sta nel modello e non qui è un segnaposto che nessun controllo intercetta.

`title` · `category` · `YYYY-MM-DD` · `HH:MM` · `YES/NO` · `venue` · `address` · `NNN ALL` · `url` · `text` · `ATTACHED/LINK:url/NONE` · `name` · `email` · `phone` · `EN/SQ/IT`

⚠️ **`YES/NO` copre `ALL_DAY`, `IS_FREE` e `CONSENT`.** Su `CONSENT` la regola non ammette deroghe: qualunque valore diverso da `YES` scritto dalla persona — segnaposto compreso — significa che il consenso non c'è. ⛔ Il consenso non si deduce mai dal contesto, dal fatto che ha mandato la mail, o dal resto dei campi compilati bene.

## 3. Lato nostro — quando arriva la mail

**Chi legge:** Davide, unico esecutore in questa fase. Non c'è ancora una casella `events@tiranatodo.com` reale — il dominio non è registrato (PLAN.md, intestazione). ⚠️ **Dichiarato, non risolto:** finché non esiste, la casella di raccolta effettiva è quella che Davide comunica di volta in volta agli organizzatori; questa SOP descrive il formato del messaggio, non l'indirizzo che lo riceve.

**Ogni quanto:** una lettura al giorno, dato il volume atteso (unità a settimana). ⏳ STIMA DA VALIDARE.

**Tempo di risposta all'organizzatore:** entro 24 ore dall'arrivo. Scelto per coincidere con la promessa già scritta per il modulo futuro (PLAN.md §5: «lo pubblichiamo entro 24 ore»), così il giorno in cui il modulo sostituisce la mail non cambia un tempo dichiarato — evita il guasto B del governo delle SOP (due promesse diverse per la stessa cosa). ⏳ STIMA DA VALIDARE sul volume reale.

## 4. Controlli prima di pubblicare, in ordine

1. **Formato.** Oggetto e corpo rispettano §2.1 e §2.2? Se no → §2.3.
1-bis. **Segnaposto non sostituito** (§2.4), e si guarda **prima** dei campi obbligatori: una riga rimasta col segnaposto sembra un campo compilato, quindi il controllo 2 la darebbe per buona. Si applicano R1, R2, R3 a tutti e 19 i valori; ⛔ nessun valore che contiene `<` o `>` passa oltre questo punto. Se sono segnaposto tutti e 19 → esito `MODELLO INTATTO`, si risponde una volta sola e ci si ferma qui.
2. **Campi obbligatori completi e validi** (data reale ed esistente, email con la forma di un'email, `CONSENT: YES` presente — scritto dalla persona, ⛔ mai dedotto).
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

⚠️ **Il segnaposto non sostituito non aggiunge un ottavo motivo**, ed è deliberato: è un errore di formato, quindi se non viene corretto entro il termine di §2.3 ricade nel **motivo 1**. Nel log però si scrive `SEGNAPOSTO` o `MODELLO INTATTO`, perché sapere quante persone non hanno capito il modello è l'unico dato che dirà se il modello va rifatto. ⚠️ Nemmeno un token d'azione italiano (`NUOVO`/`MODIFICA`/`ANNULLA`, §2.1) è un motivo di rifiuto: si accetta e si corregge nella risposta.

### Cosa si risponde a chi manda male

Una sola mail, che nomina il campo esatto e chiede di rimandare tutto il messaggio corretto (§2.3). Il testo lo scrive MUSE quando si producono i materiali reali; qui è fissato solo **cosa** deve contenere la risposta: quali campi, quale termine, dove rimandare.

## 5. Dove finisce l'evento accettato

Un evento che passa tutti i controlli di §4 va in un **registro locale**, con colonne che rispecchiano il modello dati futuro (PLAN.md §3, tabella `events`) meno gli ID tecnici — così il giorno in cui il sito vero esiste, importarlo è un caricamento, non una riscrittura:

`Documents/Claude/tiranatodo/eventi/registro_eventi.csv`

Colonne: `title, category, date_start, time_start, date_end, time_end, all_day, venue_name, address, is_free, price, ticket_url, description, photo, organizer_name, organizer_email, organizer_phone, lang, status, source, received_at, published_at`. `status` ∈ `pending`/`published`/`rejected`/`cancelled`. `source` sempre `email` in questa fase (corrisponde al futuro `source = form`).

Ogni mail arrivata, accettata o no, lascia una riga in un secondo file di log — l'equivalente manuale di `submissions_log` (PLAN.md §3):

`Documents/Claude/tiranatodo/eventi/log_invii.md`

con data, oggetto ricevuto, esito, motivo (uno dei sette di §4, o `NON COMPLETATO`, o `SEGNAPOSTO`, o `MODELLO INTATTO`, o `OK`).

⚡ **I quattro esiti non-rifiuto si contano separati e non si sommano mai fra loro:** `NON COMPLETATO` è chi non ha risposto, `SEGNAPOSTO` è chi ha compilato in parte lasciando dei `<…>`, `MODELLO INTATTO` è chi ha rimandato il blocco senza toccarlo, `OK` è pubblicato. ⛔ Un contatore che li somma misura sé stesso e non dice dove sta il difetto: se cresce `MODELLO INTATTO` il problema è la riga di testa (§2.2-quater), se cresce `SEGNAPOSTO` il problema sono i singoli campi, se cresce `NON COMPLETATO` il problema è la risposta che mandiamo.

⛔ **Nel registro non entra mai una cella che contiene `<` o `>`** (§2.4). Un campo facoltativo rimasto col segnaposto si scrive **vuoto**, non si copia.

## 6. Eventi annullati o spostati dopo la pubblicazione

È il caso che fa più danno: chi legge esce di casa per niente. Procedura:

1. L'organizzatore manda una nuova mail con oggetto `[TIRANATODO] CANCEL | ...` o `[TIRANATODO] EDIT | ...` (stesso schema di §2.1), riferita allo stesso titolo e alla stessa data originale. ⚡ **La forma esatta gliela diamo noi**, dentro la mail di conferma della pubblicazione: il modello copiabile della pagina porta solo `NEW` (§2.2-bis), quindi chi deve annullare non ha dove leggerla se non gliela scriviamo. Testo della conferma: MUSE (§10).
2. Si aggiorna la riga nel registro (§5) lo stesso giorno in cui arriva la mail, non alla lettura successiva: `status = cancelled`, oppure i campi data/ora aggiornati per `EDIT`.
3. Se l'evento era già visibile da qualche parte (sito vero, quando esisterà), la rimozione o la modifica ha priorità su qualunque altra lettura di posta della giornata.
4. Avvisare chi aveva mostrato interesse (voti «Mi interessa», PLAN.md §7) non è costruito: è una funzione di fase 2 del progetto, non esiste oggi. Si dichiara qui perché non si scopra dopo.

## 7. Checklist pre-consegna (prima di considerare un evento "pronto")

- [ ] Oggetto conforme a §2.1, azione corretta (`NEW`/`EDIT`/`CANCEL`).
- [ ] **Nessun campo contiene `<` o `>`**, e nessuna cella del registro li contiene (§2.4).
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
- **DA CHIEDERE A MUSE:** il testo di testa del modello copiabile (§2.2-quater). Funzione fissata qui, parole no: deve dire che tutto ciò che sta fra `<` e `>` va sostituito parentesi comprese, e che le 19 righe restano tutte anche se se ne lascia qualcuna vuota. Vincoli: **due righe**, ognuna comincia con `#` e uno spazio, **max 28 caratteri per riga** incluso `#` e spazio (misura di LORI, 05/09/2026), ⛔ nessuna parentesi angolare dentro, inglese di chi non è madrelingua inglese. Divisione suggerita: riga 1 le parentesi, riga 2 le 19 righe. Stesso lancio: se MUSE vuole allungare i segnaposto di `TITLE`, `VENUE_NAME`, `ADDRESS`, `DESCRIPTION`, `ORGANIZER_NAME` oltre la parola singola, può — dentro i divieti di §2.2-ter (⛔ mai un valore verosimile, ⛔ mai un locale o un indirizzo di Tirana che esiste) e aggiornando §2.4-bis.
- ✅ **LORI, chiuso il 05/09/2026:** contenitore misurato (30 caratteri per riga a 375 px), CSS escluso come via d'uscita, riga di corpo più lunga confermata a **31** (`PHOTO:`), che va a capo di un carattere e si accetta (§2.2-bis). ⚠️ La sua misura di 24 riguardava `ORGANIZER_EMAIL`, cioè la più lunga delle altre 18, non il massimo delle 19. Resta a LORI la verifica finale quando MUSE consegna le due righe vere, e il riallineamento del blocco in `docs/submit-evento.html` (§2.2-bis: la pagina è una copia, la fonte è questo file).
- Nessun altro punto fuori perimetro trovato durante la stesura: il resto rientra nel mestiere OPS (formato, controlli, registro) o è già assegnato da PLAN.md (testi a MUSE, prezzi a STRATEGO/VAULT, sito a SENTINEL/LORI).
