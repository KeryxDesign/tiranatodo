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
  - 2026-09-06, OPS — **da 19 campi a 21, e due campi passano a più valori.** Causa: il questionario di `docs/submit-evento.html` è passato a scelte multiple il 06/09/2026 su ordine di Davide (più categorie per evento, orario a scatti di 15 minuti, link Maps facoltativo, più lingue con «Other»), ed è in produzione: la SOP era rimasta a 19 campi con un valore solo, e il controllo §4.3 avrebbe rimbalzato un evento che la pagina permette di compilare. Deciso qui: **separatore ufficiale `, `** (§2.2-0), **`OTHER` ammesso su `LANGUAGE`** con `LANGUAGE_OTHER` su riga propria (§2.2), **oggetto con una categoria sola, la prima dell'elenco** (§2.1-bis), **`LANGUAGE` diventa obbligatorio e il default `EN` muore** (§2.2). Aggiornati di conseguenza §2.2-bis (modello a 21 righe), §2.4 e §2.4-bis (registro segnaposto: `EN/SQ/IT` **SUPERATO il 06/09/2026 da OPS**, entrano `EN/SQ/IT/OTHER` e `language`), §4 (controlli 3, 3-bis, 6-bis), §5 (due colonne nuove e le celle a più valori fra virgolette) e §7. Aggiunta **§2.5**, il pavimento di larghezza che una lista chiusa regge. ⚠️ Nessuna di queste righe è ratificata da Davide: la SOP resta PROPOSTA.
  - 2026-09-06, OPS — ⚠️ **fatto trovato, non riparato:** il blocco copiabile e la legenda dei formati **non stanno più sulla pagina** (tolti il 05/09/2026, `docs/pagine.css` riga 234). §2.2-bis è stata aggiornata per dirlo con la data; ⛔ la decisione di Davide del 05/09 («l'esempio sta dentro il blocco copiabile») **non è dichiarata decaduta qui** — riga aperta in §10.
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
  2. **Tutto il resto del protocollo è già inglese**: prefisso `[TIRANATODO]`, i nomi di campo (19 allora, **21 dal 06/09/2026**), i valori `YES`/`NO`, i codici di lingua (`EN/SQ/IT` allora, **`EN/SQ/IT/OTHER` dal 06/09/2026**), le undici chiavi di categoria. I tre token italiani erano l'unico dato non inglese dell'intera procedura.
  3. **Una terna mista è peggio di una terna italiana**: obbliga il mittente a ricordare quale dei tre sta in quale lingua. Un token si copia, non si traduce a metà.
  ⚠️ **Transizione:** una mail che arriva con `NUOVO` / `MODIFICA` / `ANNULLA` **si accetta lo stesso** e si tratta come il token inglese corrispondente; nella risposta si indica la forma nuova. ⛔ Non è un motivo di rifiuto e non se ne aggiunge uno (§4). Quando esisterà il parser, i tre token italiani restano nella tabella di sinonimi finché Davide non li toglie.
  ⚡ `CANCEL` è anche il valore che il registro già usa (`status = cancelled`, §5): un token, una parola, in due posti.
- `<categoria>` è una delle undici chiavi del modello dati (PLAN.md §4, allineate al design system 04/09/2026): `music`, `nightlife`, `theatre`, `cinema`, `art`, `food`, `sport`, `family`, `meetups`, `outdoors`, `other`. ⚠️ Nota per chi scrive il testo pubblico: il brief di lancio parlava di "food & drink", ma la fonte tecnica vigente (PLAN.md, enum di database e design system) usa `food`. Vince PLAN.md: è l'enum che il sito vero salverà.
  ⛔ **Nell'oggetto va una categoria sola, anche quando l'evento ne ha tre** — deciso da OPS il 06/09/2026, §2.1-bis.
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

### 2.1-bis Un evento ha fino a tre categorie, l'oggetto ne porta una

**La regola, in una frase: nell'oggetto va una categoria sola, ed è la prima dell'elenco di §2.1 fra quelle scelte.** Decisa da OPS il 06/09/2026, su domanda del PM: nel codice il comportamento c'era già (`subject()` prende il primo valore), ⛔ ma non era scritto da nessuna parte, quindi non era una regola.

⚡ **«La prima» non vuol dire «quella premuta per prima», e questa è la metà che conta.** L'ordine è quello **fisso** dell'elenco delle undici chiavi di §2.1 — `music` viene prima di `outdoors` sempre, chiunque prema cosa. Un ordine di scelta non è ripetibile: due persone che scelgono le stesse due categorie in ordine diverso otterrebbero due oggetti diversi per lo stesso evento, e un duplicato (controllo §4.7) non si riconoscerebbe più. ⚡ Il questionario si comporta già così, perché legge le voci accese **nell'ordine in cui stanno nella pagina**, che è l'ordine dell'elenco: ⛔ nessuna modifica al codice discende da questa riga.

**Perché una e non tutte.** Tre ragioni, in ordine di peso:

1. **L'oggetto lo tagliano i client di posta.** La riga oggi è già di 63 caratteri nel caso d'esempio (misura di LORI, 05/09/2026, §2.2-bis): due categorie in più la portano oltre, e il primo pezzo a sparire è **il titolo dell'evento**, che è la sola cosa che serve a riconoscere una mail in una lista.
2. **L'oggetto non è la fonte delle categorie, il corpo lo è.** Nell'oggetto la categoria è un'etichetta per l'occhio e un indice grossolano. ⛔ Chi pubblica legge `CATEGORY` nel corpo, sempre, anche quando l'oggetto ne mostra una sola.
3. **La forma dell'oggetto è a tre pipe fisse** (§2.1), e una lista dentro il secondo campo la spaccherebbe: `music, outdoors` contiene una virgola, non un pipe, quindi non rompe il parsing — ⛔ ma allunga il campo che una macchina domani prende come «la categoria», e le mail già mandate col formato vecchio smetterebbero di somigliare a quelle nuove.

⚠️ **Un oggetto che porta una categoria diversa da quelle del corpo non è un motivo di rifiuto** (§4): si pubblica leggendo il corpo, e nella risposta non si dice niente. ⛔ Non si aggiunge un ottavo motivo.

### 2.2 Il corpo della mail, campi fissi in ordine fisso

Un campo per riga, `NOME_CAMPO: valore`. Ordine non negoziabile — è quello che permetterà un domani il parsing senza un modello linguistico.

⚡ **Dal 06/09/2026 i campi sono 21, non 19.** I due nuovi sono `MAPS_URL` (decimo, subito dopo `ADDRESS`) e `LANGUAGE_OTHER` (ventesimo, subito dopo `LANGUAGE`). ⛔ **Stanno lì e non in fondo**: l'ordine è quello che permette il parsing posizionale, e un campo che sta accanto a quello che spiega si legge anche a occhio. È la posizione che il questionario già usa.

| # | Campo | Obbligatorio | Formato | Nel modello copiabile (§2.2-bis) |
|---|---|---|---|---|
| 1 | `TITLE` | **sì** | testo libero, no `\|` | `<title>` |
| 2 | `CATEGORY` | **sì** | **da 1 a 3** delle 11 chiavi di §2.1, minuscolo, separate da `, ` (§2.2-0). ⛔ `other` non sta con nessun'altra | `<category>` |
| 3 | `DATE_START` | **sì** | `YYYY-MM-DD` | `<YYYY-MM-DD>` |
| 4 | `TIME_START` | **sì, salvo `ALL_DAY: YES`** | `HH:MM`, 24 ore | `<HH:MM>` |
| 5 | `DATE_END` | no | `YYYY-MM-DD`, solo se diverso da `DATE_START` | `<YYYY-MM-DD>` |
| 6 | `TIME_END` | no | `HH:MM`, 24 ore | `<HH:MM>` |
| 7 | `ALL_DAY` | **sì** | `YES` / `NO` | `<YES/NO>` |
| 8 | `VENUE_NAME` | **sì** | testo libero | `<venue>` |
| 9 | `ADDRESS` | **sì** | testo libero, indirizzo a Tirana. ⛔ Resta obbligatorio anche con `MAPS_URL` pieno | `<address>` |
| 10 | `MAPS_URL` | no | URL completo, `http://` o `https://`. Il link al luogo su una mappa | `<url>` |
| 11 | `IS_FREE` | **sì** | `YES` / `NO` | `<YES/NO>` |
| 12 | `PRICE` | **sì se `IS_FREE: NO`** | numero + `ALL` (Lek), es. `500 ALL`; mai altra valuta | `<NNN ALL>` |
| 13 | `TICKET_URL` | no | URL completo | `<url>` |
| 14 | `DESCRIPTION` | no (raccomandato) | testo libero, max 1.500 caratteri (stesso tetto del modulo futuro, PLAN.md §5.3) | `<text>` |
| 15 | `PHOTO` | no | `ATTACHED` (allegata alla mail) / `LINK:<url>` / `NONE` | `<ATTACHED/LINK:url/NONE>` |
| 16 | `ORGANIZER_NAME` | **sì** | testo libero, pubblico | `<name>` |
| 17 | `ORGANIZER_EMAIL` | **sì** | email valida, **privato** | `<email>` |
| 18 | `ORGANIZER_PHONE` | no | **privato** | `<phone>` |
| 19 | `LANGUAGE` | **sì** (dal 06/09/2026) | **uno o più** fra `EN` `SQ` `IT` `OTHER`, maiuscolo, separati da `, ` (§2.2-0). ⛔ Nessun tetto e nessuna esclusiva: `OTHER` può stare con gli altri | `<EN/SQ/IT/OTHER>` |
| 20 | `LANGUAGE_OTHER` | **sì se `LANGUAGE` contiene `OTHER`** | il nome della lingua **scritto in inglese**, testo libero (es. `Greek`). ⛔ Non si spacca sul separatore: lo legge una persona | `<language>` |
| 21 | `CONSENT` | **sì** | deve essere `YES`; qualunque altro valore o riga assente = non trattabile | `<YES/NO>` |

**Data e ora:** sempre `YYYY-MM-DD` e `HH:MM` 24 ore, mai altro formato. È la stessa regola che risolve il caso Albania-vs-America citato nel task: con l'anno davanti non c'è lettura alternativa. ⚠️ **Dal 06/09/2026 il questionario offre solo i quarti d'ora** (`:00`, `:15`, `:30`, `:45`): è un vincolo del modulo, ⛔ **non un vincolo del formato**. Una mail scritta a mano che porta `21:10` è valida e si pubblica — un orario vero non si rifiuta perché non cade su un quarto.

**`LANGUAGE`, e il default che è morto.** Fino al 05/09/2026 questa SOP diceva «assente = `EN`, default del sito». ⛔ **La riga era sbagliata due volte** e va detto perché non torni: (a) il default di PLAN.md §6 è la lingua **in cui è scritto il sito**, non la lingua **parlata all'evento** — sono due cose diverse, e confonderle consegna come inglese un evento in albanese, che è esattamente il danno che il sito esiste per evitare; (b) dal 06/09/2026 il questionario **richiede** almeno una lingua e non ne pre-accende nessuna, quindi il default non esisteva più nel codice mentre era ancora scritto qui. ⛔ **Da oggi `LANGUAGE` non si deduce mai**: se manca si chiede (§2.3), come per qualunque campo obbligatorio.

**`OTHER` è ammesso, e la lingua vera viaggia su una riga sua.** Deciso da OPS il 06/09/2026, ed è la risposta a una domanda che il questionario aveva già aperto nel codice. I valori ammessi su `LANGUAGE` diventano **quattro**: `EN`, `SQ`, `IT`, `OTHER`. ⛔ **Il nome della lingua non si accoda dentro `LANGUAGE`** — né come `OTHER: Greek`, né come `OTHER (Greek)`, né sostituendo `OTHER` con `GREEK`. Va in `LANGUAGE_OTHER`, riga 20, campo suo. Tre ragioni, in ordine di peso:
1. ⛔ **`LANGUAGE` è una lista chiusa, e chiusa deve restare.** È il campo su cui il sito filtrerà: un filtro si costruisce su un insieme finito di valori noti. Se dentro `LANGUAGE` può comparire testo libero, il campo diventa aperto e il filtro va scritto per indovinare invece che per confrontare. `OTHER` è un valore chiuso come gli altri tre; `Greek` no.
2. ⛔ **Accodarlo romperebbe il separatore.** `LANGUAGE` porta più valori separati da `, ` (§2.2-0), e il separatore regge **solo** perché i valori sono parole singole di una lista chiusa. Un `EN, OTHER: Modern Greek` è ambiguo alla prima virgola che una persona ci mette dentro.
3. ⚡ **Sono due dati con due destini diversi.** `OTHER` serve alla macchina (filtro, conteggio, futura colonna `lang`); `Greek` serve a **una persona che legge la scheda**. ⛔ Per questo `LANGUAGE_OTHER` **non si spacca sul separatore** anche se contiene una virgola: è prosa, non un elenco.

⚠️ **Quello che questa regola non risolve, e si dichiara:** con `OTHER` il sito sa che l'evento **non** è in EN/SQ/IT, ma non sa in che lingua è, se non leggendo `LANGUAGE_OTHER` a occhio. È accettato: chi legge il sito è un espatriato o un turista, e per lui il dato utile è «non è in una lingua che capisco». ⛔ Non si aggiunge una quinta lingua alla lista chiusa per anticipare un caso che non è ancora arrivato — si guarda cosa scrivono davvero le persone in `LANGUAGE_OTHER`, e se una lingua torna spesso **allora** entra nella lista (e allora si rilegge §2.5, perché la lista chiusa regge una misura).

**`MAPS_URL`, e cosa non è.** ⛔ **Non sostituisce `ADDRESS`**: un link muore, cambia, o punta a un posto sbagliato, e chi legge il sito da un telefono senza rete ha bisogno dell'indirizzo scritto. ⚠️ Non si controlla che l'host sia Google: si controlla che sia un URL completo. Se il link non porta a una mappa, ⛔ **non si rifiuta l'evento**: si pubblica senza mappa e si avvisa l'organizzatore, come già si fa con la foto non conforme (§4.6).

**Prezzo:** sempre in Lek (`ALL`), mai altra valuta scritta dall'organizzatore senza conversione dichiarata. `IS_FREE: YES` è un campo a sé, non un valore di `PRICE` — così un evento gratuito non lascia `PRICE` vuoto per errore, lo dichiara.

**Foto:** allegato ammesso JPG/PNG/WebP, **peso massimo 5 MB** (stesso tetto del modulo futuro, PLAN.md §5.4, per non avere due limiti diversi da riconciliare più avanti). Oltre i 5 MB o se l'organizzatore preferisce: `PHOTO: LINK:<url>` a un file su Drive/WeTransfer/simili. `PHOTO: NONE` è accettato: il sito userà il fondo colore della categoria (PLAN.md §5.4), l'evento non si ferma per l'immagine.

### 2.2-0 Il separatore ufficiale di un campo con più valori

> **Il separatore è la virgola seguita da uno spazio: `, `.** Deciso da OPS il 06/09/2026. ⚡ È quello che il questionario già scrive dal 06/09/2026 (`docs/submit-evento.js`, costante `SEP`), scelto lì dal PM e ⛔ non ratificato da nessuno fino a oggi. ⛔ **Nessuna modifica al codice discende da questa riga:** ratificare ciò che è già in produzione costa zero e non introduce un giro di riallineamento.

**Dove vale, e solo lì.** ⛔ **Due campi su 21 portano più valori: `CATEGORY` e `LANGUAGE`.** Nessun altro. Un separatore che vale ovunque è un separatore che prima o poi spacca un titolo.

**Perché la virgola e non un altro carattere.** In ordine di peso:

1. **`|` è già impegnato**, ed è impegnato nell'oggetto (§2.1, tre pipe fisse). Usarlo anche nel corpo significherebbe due grammatiche con lo stesso segno, e un titolo con un pipe dentro — che §2.1 già vieta — diventerebbe ambiguo in due posti invece che in uno.
2. **La virgola non può comparire dentro i valori che separa.** Le undici chiavi di categoria e i quattro codici di lingua sono elenchi **chiusi**, tutti di una parola sola senza virgole: il separatore non può mai essere scambiato per contenuto. ⛔ Questo è il vincolo che regge tutta la regola, e ha una conseguenza: **il giorno in cui una chiave nuova contenesse una virgola, si cambia la chiave — non il separatore.**
3. **È la forma che una persona scrive da sola.** Chi compila a mano scriverà `music, outdoors` senza che glielo si dica. Un separatore che va insegnato viene sbagliato.

**Come si legge, oggi a mano e domani a macchina.** Si spacca sulla virgola e si tolgono gli spazi ai bordi di ogni pezzo: `^([A-Z_]+):[ ]?(.*)$` per la riga (§2.2-quinquies, invariato), poi `valore.split(",")` e `trim` su ognuno. ⚡ **Quindi `music,outdoors` senza spazio si accetta**, e così `music ,  outdoors`: la forma canonica è `, `, ⛔ ma una mail non si rimbalza per uno spazio. Il registro (§5) riceve sempre la forma canonica, qualunque cosa sia arrivata.

⚠️ **Il separatore vale nella mail, non nel CSV.** Nel registro di §5 una cella con più valori va **fra virgolette doppie** — `"music, outdoors"` — perché lì la virgola è già il separatore delle colonne. È scritto in §5 e non si dimentica: senza virgolette la riga si sposta di una colonna e il registro diventa illeggibile a valle.

### 2.2-bis Il modello copiabile, forma canonica

⚡ **Questa è la fonte.** ⛔ Chi cambia una riga qui cambia il registro di §2.4-bis **nello stesso giro** — e, se il blocco tornerà sulla pagina, anche quello.

⚠️⚠️ **[FATTO, verificato il 06/09/2026] Il blocco copiabile e la legenda dei formati non stanno più sulla pagina.** Sono stati tolti il **05/09/2026** insieme alle classi `.te-steps`, `.te-legend*` e `.te-submit-cols` (`docs/pagine.css`, commento alla riga 234); la pagina oggi porta un solo `<pre class="te-copybox" id="mail-text">`, che il questionario riempie **coi valori veri** — nessun segnaposto, e senza le due righe `#`. Fino a oggi questo paragrafo diceva che la pagina è una copia del modello: **non lo è più, e da almeno un giorno il rinvio era morto.**

**Cosa resta vero, e perché il modello non si cancella:**
- **la mail può ancora arrivare scritta a mano** — la casella esiste, il questionario è un aiuto e non un cancello — quindi §2.2-bis resta la forma canonica per chi scrive senza il modulo, e i controlli §2.4 e §2.4-bis restano **necessari**: un segnaposto può ancora arrivare, copiato da questo file o da una risposta nostra;
- ⛔ **la decisione di Davide del 05/09/2026** («l'esempio sta dentro il blocco copiabile») **non si dichiara decaduta qui**: l'ha presa lui e la chiude lui. Riga aperta in §10.
- ⏳ **la richiesta a MUSE** per le due righe `#` (§2.2-quater) **resta aperta ma non è più urgente**: nessuno le legge finché il blocco non torna sulla pagina.

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
MAPS_URL: <url>
IS_FREE: <YES/NO>
PRICE: <NNN ALL>
TICKET_URL: <url>
DESCRIPTION: <text>
PHOTO: <ATTACHED/LINK:url/NONE>
ORGANIZER_NAME: <name>
ORGANIZER_EMAIL: <email>
ORGANIZER_PHONE: <phone>
LANGUAGE: <EN/SQ/IT/OTHER>
LANGUAGE_OTHER: <language>
CONSENT: <YES/NO>
```

**Le due eccezioni, dichiarate perché sono eccezioni:**

- **`To: events@tiranatodo.com` non ha le parentesi angolari, e non deve averle.** La convenzione di §2.2-ter dice «tutto ciò che sta fra `<` e `>` lo devi sostituire tu»: mettere l'indirizzo fra parentesi direbbe al mittente di inventarsene uno. L'indirizzo si copia com'è. ⚠️ Che il dominio non sia ancora registrato è un altro problema, dichiarato in §3, e sulla pagina lo segnala LORI col suo marcatore visivo — non con questa convenzione.
- **`NEW` nell'oggetto è scritto per esteso, ed è l'unico valore vero precompilato di tutto il modello.** Ragione: è l'unico caso in cui un segnaposto **non sostituito produce il comportamento giusto**. Chi copia questo blocco sta mandando un evento nuovo — la pagina si chiama «manda un evento» — quindi `NEW` lasciato lì è corretto, non è un errore da intercettare. `EDIT` e `CANCEL` li usa chi ha già mandato una mail, e la forma gliela diamo noi nella risposta (§6): non ha bisogno di trovarla qui. ⛔ Questa eccezione vale **solo** per l'azione: nessun altro campo prende un valore vero.

**Forma canonica del blocco, e si conta:** `To:` · `Subject:` · **riga vuota** · **due righe `#`** (§2.2-quater) · **riga vuota** · **21 righe di campo** (erano 19 fino al 06/09/2026). La riga vuota dopo il blocco `#` **fa parte del modello**: è lei che separa il commento dai campi, e senza di lei la seconda riga `#` mandata a capo dal contenitore si incolla sopra `TITLE:`. ⛔ Non si toglie e non si sposta. ⚡ Il parser non la vede: non contiene `:` e non entra in `^([A-Z_]+):[ ]?(.*)$`.

**Lunghezza delle righe — misurata da LORI il 05/09/2026, non stimata.** Il contenitore `.te-copybox` a 375 px di viewport tiene **30 caratteri per riga** (content-box 309 px, `ui-monospace` 17 px, avanzamento 10,235 px). Da lì i tre fatti:
- la riga di corpo più lunga è **31 caratteri** (`PHOTO: <ATTACHED/LINK:url/NONE>`), e va a capo di un carattere. Le altre 20 stanno su una riga visiva sola. ⚡ **Ricontato il 06/09/2026 sulle due righe nuove e su `LANGUAGE` allungato:** `MAPS_URL: <url>` misura **15**, `LANGUAGE_OTHER: <language>` **26**, e `LANGUAGE: <EN/SQ/IT/OTHER>` passa da 20 a **26**. Il massimo delle righe che **non** vanno a capo sale quindi da 24 (`ORGANIZER_EMAIL: <email>`) a **26**, e resta sotto i 30 del contenitore: **il modello a 21 righe non tocca il CSS e non aggiunge nessun wrap**. ⚠️ La previsione originale di questo paragrafo — 31 su `PHOTO:` — era **giusta**; l'errore sta nel brief del PM del 05/09/2026, che ha riportato il 24 di LORI come se fosse il massimo di tutti i campi. ⚡ **Il wrap di `PHOTO:` si accetta, e la ragione è la stessa che vieta quello della riga `#`:** lì la continuazione parte a filo sinistro **senza** il `#` e si legge come un campo; qui la continuazione è `NONE>`, che non ha i due punti e quindi non somiglia a nessun campo. ⛔ E in nessuno dei due casi il wrap tocca il testo copiato: è resa a schermo, non contenuto;
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
2. che **le 21 righe restano tutte**, anche quelle che si lasciano vuote — l'ordine fisso è quello che permette il parsing (§2.2), e una riga cancellata lo rompe.

**Vincoli del blocco**, che sono di OPS:
- **due righe**, non una e non tre. Ogni riga comincia con `#` e uno spazio.
- **massimo 28 caratteri per riga**, `#` e spazio compresi. ⛔ Il tetto è per riga, non per il blocco: due righe da 28 sono ammesse, una riga da 40 no.
- **una riga vuota subito dopo la seconda `#`**, prima di `TITLE:`. Fa parte del modello canonico (§2.2-bis).
- ⛔ nessuna parentesi angolare dentro — se le contenesse il blocco sarebbe lui stesso un segnaposto per il controllo di §2.4.

⚡ **Perché 28 e non 60, e perché due righe.** Misura di LORI del 05/09/2026: `.te-copybox` a 375 px tiene **30 caratteri per riga**. Il vecchio tetto di 60 poggiava sulla premessa «sto sotto la riga dell'oggetto, che è il caso peggiore»: la premessa era vera sul numero di caratteri e falsa sull'effetto, perché **l'oggetto e il commento non si rompono allo stesso modo**. ⛔ Il difetto non è l'andare a capo: è che **la riga di continuazione riparte a filo sinistro esattamente come `TITLE:`, senza il `#`, incollata sopra l'elenco dei campi — e si legge come un campo, non come un commento.** Una riga da 60 diventa 2 righe visive nel caso buono e 3 nel cattivo, cioè fino a 2 righe che sembrano campi. Due righe da 28 ci stanno per intero, portano il `#` ognuna, e la riga vuota chiude il blocco. **I 2 caratteri di margine su 30 non si spendono:** proteggono da un carattere accentato, da uno zoom di sistema e dall'arrotondamento di un browser diverso.

⛔ **Il CSS non è una via d'uscita** (§2.2-bis): il contenitore è stato provato e non cede spazio. Se il testo non ci sta, si accorcia il testo.

⛔ **Il testo in inglese non lo scrive OPS.** Qui è fissata solo la funzione e la misura: le parole sono di **MUSE** (§10), e i due fatti si dividono uno per riga — riga 1 le parentesi da sostituire, riga 2 le 21 righe che restano tutte — salvo che MUSE trovi una divisione migliore dentro i 28 caratteri.

**Regola per il parser:** ogni riga che comincia con `#` si ignora, e le righe vuote pure. ⚡ **La regola era già generica, e per questo il passaggio da una riga a due non tocca il parsing:** «una riga sola» era una scelta di forma, non un vincolo tecnico. Il mittente **non è tenuto a cancellare il blocco**: se torna indietro è normale, non è un errore e non si conta da nessuna parte.

### 2.2-quinquies Perché il parsing futuro regge — verdetto

**Regge, e ne esce più forte.** La grammatica di riga non cambia: `^([A-Z_]+):[ ]?(.*)$`, 21 nomi noti, ordine fisso di §2.2. Un valore precompilato cambia **cosa** sta nel gruppo 2, mai la forma della riga. ⚡ **E non la cambia nemmeno il passaggio a più valori del 06/09/2026:** il separatore `, ` (§2.2-0) vive **dentro il gruppo 2**, quindi per il parser di riga un `CATEGORY: music, outdoors` è una riga come tutte le altre. La spaccatura sul separatore è un secondo passaggio, e riguarda due campi soli. Le righe `To:` e `Subject:` non vengono raccolte per caso, perché non sono tutte maiuscole e quindi non entrano in `[A-Z_]+`.

⚡ **Il guadagno:** oggi il parser vedrebbe due soli stati, *vuoto* o *pieno*, e non saprebbe distinguere «non ha compilato niente» da «ha compilato tutto». Con i segnaposto gli stati diventano tre — **VUOTO · SEGNAPOSTO · VALORE** — e il terzo caso, che oggi non esiste, diventa riconoscibile e rifiutabile.

⛔ **La regressione, che è il motivo per cui §2.4 è obbligatoria:** un parser scritto ingenuamente come «valore non vuoto = campo presente» adesso vede **21 campi presenti** su un modello mai toccato, e pubblicherebbe un evento fatto di segnaposto. ⛔ **Nessun parser si scrive senza aver prima implementato §2.4.** Chi costruirà la Function `POST /api/submit` o l'importatore del registro (PLAN.md, Fasi 1 e 3) lo legge qui.

### 2.3 Se manca un campo obbligatorio

Non si pubblica e non si scarta subito. Una sola mail di risposta che elenca **con precisione** quali campi mancano o sono nel formato sbagliato (mai "compila meglio", sempre il nome del campo), chiedendo di rimandare **l'intera mail corretta**, non solo il pezzo mancante — un thread con mezza informazione in un punto e mezza in un altro è quello che rompe il parsing futuro. Termine per la correzione: 48 ore (⏳ STIMA DA VALIDARE, la valida Davide dopo le prime settimane reali). Scaduto il termine senza risposta: si archivia come `NON COMPLETATO` nel log (§5), non come rifiuto — sono due esiti diversi e si contano separati.

⚠️ **Un campo lasciato col segnaposto non è un campo mancante**: stessa procedura di risposta, esito diverso nel log. Vedi §2.4.

### 2.4 Segnaposto non sostituito — il controllo nuovo

È un esito **diverso** da «campo mancante» (§2.3), e si conta a parte: un campo mancante è una persona che non aveva il dato, un segnaposto non sostituito è una persona che non ha capito il modello. Sono due difetti diversi e si riparano con due frasi diverse.

**Come si riconosce** — un valore è un segnaposto se, dopo aver tolto gli spazi ai bordi, ricade in una di queste:

| | Regola | Copre |
|---|---|---|
| **R1** | comincia con `<` **e** finisce con `>` | il caso normale: `<title>`, `<YES/NO>` |
| **R2** | contiene `<` **o** `>` in uno dei **15** campi a formato vincolato (tutti tranne i 6 a testo libero: `TITLE`, `VENUE_NAME`, `ADDRESS`, `DESCRIPTION`, `ORGANIZER_NAME`, `LANGUAGE_OTHER`) | il caso `PHOTO: LINK:<url>`, dove la parentesi sta dentro il valore e non ai bordi |
| **R3** | è identico — spazi normalizzati, maiuscole ignorate — a una stringa del registro §2.4-bis, **anche senza parentesi** | il client di posta che mangia le angolari incollando: resta `DATE_START: YYYY-MM-DD`, e va preso lo stesso |

⚠️ **R3 è quella che serve davvero**, e va spiegata: alcuni client trattano `<…>` come marcatura e la tolgono. Senza R3 un modello «pulito» dal client arriverebbe con valori nudi tipo `YYYY-MM-DD` o `email`, che nessuna delle altre due regole vede. Il costo di R3 è un falso positivo teorico — un locale che si chiama davvero `venue` — e l'esito di un falso positivo è **una domanda, mai un rifiuto**: costo accettato.

**Cosa si fa, per tipo di campo:**

- **Campo obbligatorio con segnaposto** → si tratta come §2.3 (una sola mail che nomina le righe, si chiede di rimandare tutto il messaggio), ma nel log l'esito è `SEGNAPOSTO`, non `NON COMPLETATO`.
- **Campo facoltativo con segnaposto** (gli **8** di §2.2: `DATE_END`, `TIME_END`, `MAPS_URL`, `TICKET_URL`, `DESCRIPTION`, `PHOTO`, `ORGANIZER_PHONE`, e `LANGUAGE_OTHER` quando `LANGUAGE` non contiene `OTHER`) → **si tratta come vuoto**, si pubblica lo stesso e si annota nel log. ⛔ Non si rimbalza un evento buono perché è rimasto un `<url>` in `TICKET_URL`: sarebbe sproporzionato.
- ⚠️ **`LANGUAGE_OTHER` è l'unico campo a obbligo condizionato**, e va trattato per quello che è nel momento in cui lo si legge: se `LANGUAGE` contiene `OTHER`, un `<language>` rimasto lì è un **segnaposto su campo obbligatorio** (riga sopra); se `LANGUAGE` non contiene `OTHER`, è un facoltativo e si svuota. ⛔ Non si deduce la lingua dal resto della mail (§2.2).
- **Tutti e 21 i campi sono segnaposto** → il modello è tornato intatto. Esito `MODELLO INTATTO`, **una riga di log sola e una risposta sola**. ⛔ Non si elencano 21 errori a una persona che non ha compilato niente: si spiega una volta come si compila.

**I tre divieti che chiudono il controllo:**
- ⛔ **Non si indovina mai il valore.** Un segnaposto non si sostituisce a mano con quello che sembra sensato, nemmeno se il resto della mail lo suggerisce.
- ⛔ **Non finisce mai nel registro un valore che contiene `<` o `>`.** Vale anche per i campi facoltativi: lì il segnaposto diventa cella vuota, non testo copiato.
- ⛔ **Non si aggiunge un ottavo motivo di rifiuto.** Un segnaposto è un errore di formato: se non viene corretto entro il termine di §2.3 ricade nel motivo 1 già esistente (§4). La lista dei sette resta di sette.

### 2.4-bis Registro dei segnaposto — la lista che il parser confronta

⚡ Queste sono le stringhe esatte, **senza parentesi**, che la regola R3 cerca. Sono **16 per 21 campi**, perché alcune si ripetono. ⛔ **Chi cambia il modello di §2.2-bis aggiorna questa lista nello stesso giro:** una stringa che sta nel modello e non qui è un segnaposto che nessun controllo intercetta.

`title` · `category` · `YYYY-MM-DD` · `HH:MM` · `YES/NO` · `venue` · `address` · `NNN ALL` · `url` · `text` · `ATTACHED/LINK:url/NONE` · `name` · `email` · `phone` · `EN/SQ/IT/OTHER` · `language`

⚠️ **Aggiornata il 06/09/2026, e due cose sono cambiate.** `EN/SQ/IT` **non esiste più** ed è stato sostituito da `EN/SQ/IT/OTHER`: la vecchia stringa è `SUPERATA il 06/09/2026 da OPS` e non si rimette, perché un modello che la contenesse sarebbe più vecchio della SOP. È entrata `language`, che è il segnaposto di `LANGUAGE_OTHER`. ⚡ **`url` copre tre campi** — `MAPS_URL`, `TICKET_URL` e la forma `LINK:<url>` di `PHOTO` — e per questo il campo nuovo non ha aggiunto una stringa: è la ragione per cui 21 campi stanno in 16 stringhe.

⚠️ **`YES/NO` copre `ALL_DAY`, `IS_FREE` e `CONSENT`.** Su `CONSENT` la regola non ammette deroghe: qualunque valore diverso da `YES` scritto dalla persona — segnaposto compreso — significa che il consenso non c'è. ⛔ Il consenso non si deduce mai dal contesto, dal fatto che ha mandato la mail, o dal resto dei campi compilati bene.

### 2.5 Una lista chiusa regge una misura di layout — chi la allunga la fa rimisurare

Scritta il 06/09/2026 da OPS, e la ragione per cui sta **qui** e non in una SOP nuova è nel primo paragrafo.

**Il fatto.** La griglia delle lingue di `docs/submit-evento.html` ha un **pavimento di larghezza di 152 px** per colonna (`docs/pagine.css`, `.te-choice--multi`). Il numero non è scelto a occhio: è **calcolato sulla voce più larga della lista**, che oggi è «Albanian». Formula, trascritta dal commento nel CSS:

```
zona vietata della spunta: 31 (spunta) + 8 (respiro) = 39, per due lati = 78
etichetta più larga («Albanian»)                                    = 71,4
                                                          78 + 71,4 = 149,4 → 152
```

⚡ **E si rimisura a 18 px, non a 17:** sopra i 768 px il corpo del testo sale (`--te-fs-body` 17 → 18), quindi la voce più larga cresce proprio dove le colonne sono più strette in proporzione.

⛔ **Il danno, se il pavimento non basta:** la spunta è posizionata in assoluto a sinistra dentro il bottone, quindi non spinge l'etichetta — **ci finisce sopra**. Prima del 152, fra 480 e ~560 px il bottone scendeva a 111 px e la sovrapposizione misurata su «Albanian» era di **11,2 px**. Non è un difetto estetico: è testo illeggibile su un modulo che deve essere compilato da un telefono.

**Perché la regola sta in questa SOP e non in una nuova** (`sop_governo_delle_sop.md` §7: prima di aprire una SOP si guarda se il caso è già coperto). ✅ **Verificato il 06/09/2026 in `Sistema/_CORE/sop/`: nessuna SOP copre il caso «una lista fissa scritta a mano nell'HTML che regge una misura di layout».** Prova rifacibile: `grep -rn "minmax\|auto-fit\|pavimento di larghezza" Sistema/_CORE/sop/` dà **zero**; le sette occorrenze di «lista chiusa» parlano d'altro (elenchi di valori, non di larghezze). I due parenti più vicini sono `graf_articolo_blog.md` (che ha un innesco di rimisurazione, ma per un altro materiale e un altro innesco) e `graf_pagina_web.md` §4 (pavimento tipografico, che è una soglia di leggibilità, non una larghezza derivata da un contenuto). ⛔ Non si scrive una SOP nuova per una riga: **la lista dei valori di `LANGUAGE` è di §2.2, e §2.2 è la sua fonte unica** — i bottoni nell'HTML sono una **copia** di quella lista. Quindi chi aggiunge una lingua passa comunque da qui, ed è qui che l'obbligo di rimisurare intercetta il gesto.

**La regola, in tre righe eseguibili.**
1. **Innesco, misurabile:** si aggiunge, si rinomina o si traduce una voce di una lista chiusa **disegnata come griglia** — oggi solo `LANGUAGE` (§2.2). Anche una voce sola. Anche se «è corta».
2. **Chi rimisura: LORI**, prima che la modifica vada online. È lei che ha misurato il 152 e i 30 caratteri del contenitore (§2.2-bis), e la misura si rifà con la formula qui sopra, **a 18 px**. ⛔ Non si stima a occhio e ⛔ non si guarda uno screenshot: si misura la larghezza dell'etichetta.
3. **Chi tocca il CSS: SENTINEL, sotto LORI** (ratifica #146), e il giro lo porta il PM. ⛔ **OPS non tocca il CSS** — questa SOP dice *che* va rimisurato e *da chi*, mai *quanto* deve venire.

⚠️ **Perimetro, verificato riga per riga il 06/09/2026 e non dedotto:** `.te-choice--multi` è usata **da un solo gruppo**, quello delle lingue (`submit-evento.html`, riga 243). Le **categorie** usano `.te-choice-grid`, che manda i bottoni a capo liberamente e **non ha pavimento**; i gruppi `YES/NO` e `PHOTO` usano `.te-choice`, che ha un pavimento suo di 100 px e voci corte. ⛔ Non si estende questa regola a griglie che non hanno il problema: una regola che vale ovunque smette di essere letta.

⚠️ **Il rischio che resta, dichiarato:** il 152 è un numero scritto dentro una regola CSS, **non un token del design system**, e il vincolo che lo spiega vive in un commento. Un commento non ferma nessuno. ⛔ Per questo l'obbligo è stato messo **sulla lista dei valori** (§2.2) e non sul CSS: la lista si apre per forza quando si aggiunge una lingua, il file di stile no. ⚡ E vale anche al contrario: **una voce aggiunta solo nell'HTML e non in §2.2 è invisibile a questa SOP** — sarebbe una lingua che il modulo accetta e il protocollo non conosce, cioè il difetto di cui questa revisione è la riparazione.

## 3. Lato nostro — quando arriva la mail

**Chi legge:** Davide, unico esecutore in questa fase. Non c'è ancora una casella `events@tiranatodo.com` reale — il dominio non è registrato (PLAN.md, intestazione). ⚠️ **Dichiarato, non risolto:** finché non esiste, la casella di raccolta effettiva è quella che Davide comunica di volta in volta agli organizzatori; questa SOP descrive il formato del messaggio, non l'indirizzo che lo riceve.

**Ogni quanto:** una lettura al giorno, dato il volume atteso (unità a settimana). ⏳ STIMA DA VALIDARE.

**Tempo di risposta all'organizzatore:** entro 24 ore dall'arrivo. Scelto per coincidere con la promessa già scritta per il modulo futuro (PLAN.md §5: «lo pubblichiamo entro 24 ore»), così il giorno in cui il modulo sostituisce la mail non cambia un tempo dichiarato — evita il guasto B del governo delle SOP (due promesse diverse per la stessa cosa). ⏳ STIMA DA VALIDARE sul volume reale.

## 4. Controlli prima di pubblicare, in ordine

1. **Formato.** Oggetto e corpo rispettano §2.1 e §2.2? Se no → §2.3.
1-bis. **Segnaposto non sostituito** (§2.4), e si guarda **prima** dei campi obbligatori: una riga rimasta col segnaposto sembra un campo compilato, quindi il controllo 2 la darebbe per buona. Si applicano R1, R2, R3 a tutti e 21 i valori; ⛔ nessun valore che contiene `<` o `>` passa oltre questo punto. Se sono segnaposto tutti e 21 → esito `MODELLO INTATTO`, si risponde una volta sola e ci si ferma qui.
2. **Campi obbligatori completi e validi** (data reale ed esistente, email con la forma di un'email, `LANGUAGE` con almeno un valore, `CONSENT: YES` presente — scritto dalla persona, ⛔ mai dedotto).
3. **Categorie riconosciute** (riscritto il 06/09/2026, prima leggeva «categoria» al singolare). Si spacca `CATEGORY` sul separatore `, ` (§2.2-0) e si guarda **ogni** valore: **ognuno** dev'essere una delle 11 chiavi, **al massimo tre**, e `other` non sta con nessun altro. Se una chiave non è riconosciuta: ⛔ non si assegna `other` in automatico e ⛔ non si tiene solo la parte buona buttando via il resto — si chiede conferma all'organizzatore, perché sbagliare qui sporca il filtro che userà chi legge il sito. ⚠️ Più di tre chiavi valide **non è un rifiuto**: si chiede quali tre, perché il tetto è nostro e non è colpa di chi scrive a mano.
3-bis. **Lingue** (nuovo, 06/09/2026). Si spacca `LANGUAGE` sul separatore e ogni valore dev'essere `EN`, `SQ`, `IT` o `OTHER`; nessun tetto e nessuna esclusiva. `LANGUAGE_OTHER` dev'esserci **se e solo se** `LANGUAGE` contiene `OTHER`: se contiene `OTHER` e la riga è vuota o col segnaposto → si chiede (§2.3); se **non** contiene `OTHER` e la riga è piena → ⛔ non si rifiuta e ⛔ non si aggiunge `OTHER` per far tornare i conti: si svuota la cella e si chiede conferma nella stessa risposta.
4. **Data non passata**, e coerente con `ALL_DAY`/`TIME_START`.
5. **Prezzo coerente**: se `IS_FREE: NO` deve esserci `PRICE`; se `IS_FREE: YES` non deve esserci `PRICE`.
6. **Foto conforme**, se presente: formato e peso di §2.2. Se non conforme, **non si rifiuta l'intero evento**: si pubblica senza foto (fallback colore) e si avvisa l'organizzatore.
6-bis. **Link alla mappa**, se presente (nuovo, 06/09/2026): dev'essere un URL completo (`http://` o `https://`). ⚠️ Non si controlla che l'host sia Google e non si apre il link per vedere se il posto è giusto — non si può fare a mano su ogni mail e non si finge di farlo. ⛔ Un `MAPS_URL` non conforme **non rifiuta l'evento**: si pubblica senza mappa e si avvisa l'organizzatore, esattamente come al punto 6. È il motivo per cui `ADDRESS` resta obbligatorio (§2.2).
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

Colonne: `title, category, date_start, time_start, date_end, time_end, all_day, venue_name, address, maps_url, is_free, price, ticket_url, description, photo, organizer_name, organizer_email, organizer_phone, lang, lang_other, status, source, received_at, published_at`. `status` ∈ `pending`/`published`/`rejected`/`cancelled`. `source` sempre `email` in questa fase (corrisponde al futuro `source = form`).

⚠️ **Due colonne nuove dal 06/09/2026** — `maps_url` (dopo `address`) e `lang_other` (dopo `lang`) — nella stessa posizione che i campi hanno nella mail (§2.2), così le due liste si leggono affiancate. ✅ **Nessuna migrazione da fare, verificato il 06/09/2026:** la cartella `tiranatodo/eventi/` **non esiste ancora** e non c'è nessun CSV scritto con le colonne vecchie. La regola resta scritta per il giorno in cui ce ne sarà uno: ⛔ un file già iniziato non si lascia com'è, si aggiungono le due colonne vuote all'intestazione **e a ogni riga**, perché un CSV con righe di lunghezza diversa non si importa.

⛔⛔ **Una cella a più valori sta fra virgolette doppie, sempre.** `category` e `lang` (§2.2-0) portano il separatore `, `, e nel CSV **la virgola separa già le colonne**: `music, outdoors` scritto nudo diventa **due colonne** e sposta di uno tutto quello che segue. La forma giusta è `"music, outdoors"` — virgolette doppie, che è la citazione standard del CSV (RFC 4180). ⚡ **Vale anche quando il valore è uno solo**, perché così la colonna ha sempre la stessa forma e chi la legge non deve indovinare. ⚠️ Lo stesso vale per qualunque testo libero che contenga una virgola: `title`, `venue_name`, `address`, `description`, `lang_other`.

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
- [ ] Tutti i campi obbligatori di §2.2 presenti e nel formato giusto (sono **13** dei 21: `TITLE`, `CATEGORY`, `DATE_START`, `TIME_START` salvo `ALL_DAY: YES`, `ALL_DAY`, `VENUE_NAME`, `ADDRESS`, `IS_FREE`, `PRICE` se `IS_FREE: NO`, `ORGANIZER_NAME`, `ORGANIZER_EMAIL`, `LANGUAGE`, `CONSENT` — più `LANGUAGE_OTHER`, obbligatorio solo se c'è `OTHER`).
- [ ] Data non passata, coerente con `ALL_DAY`.
- [ ] **Categorie**: da 1 a 3, ognuna fra le undici, `other` da solo (§4.3).
- [ ] **Lingue**: almeno un valore fra `EN`/`SQ`/`IT`/`OTHER`, e `LANGUAGE_OTHER` presente **se e solo se** c'è `OTHER` (§4.3-bis).
- [ ] Prezzo coerente con `IS_FREE`.
- [ ] Foto conforme o `NONE`/fallback deciso.
- [ ] `MAPS_URL`, se c'è, è un URL completo — e se non lo è si pubblica **senza mappa**, non si rifiuta (§4.6-bis).
- [ ] Nessuno dei sette motivi di rifiuto si applica.
- [ ] Riga scritta in `registro_eventi.csv` e in `log_invii.md`, **con le celle a più valori fra virgolette doppie** (§5).

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
- **DA CHIEDERE A MUSE:** il testo di testa del modello copiabile (§2.2-quater). ⏳ **Non più urgente dal 06/09/2026**: il blocco non sta più sulla pagina (§2.2-bis), quindi nessuno legge quelle due righe finché non torna. Funzione fissata qui, parole no: deve dire che tutto ciò che sta fra `<` e `>` va sostituito parentesi comprese, e che le 21 righe restano tutte anche se se ne lascia qualcuna vuota. Vincoli: **due righe**, ognuna comincia con `#` e uno spazio, **max 28 caratteri per riga** incluso `#` e spazio (misura di LORI, 05/09/2026), ⛔ nessuna parentesi angolare dentro, inglese di chi non è madrelingua inglese. Divisione suggerita: riga 1 le parentesi, riga 2 le 21 righe. Stesso lancio: se MUSE vuole allungare i segnaposto di `TITLE`, `VENUE_NAME`, `ADDRESS`, `DESCRIPTION`, `ORGANIZER_NAME` oltre la parola singola, può — dentro i divieti di §2.2-ter (⛔ mai un valore verosimile, ⛔ mai un locale o un indirizzo di Tirana che esiste) e aggiornando §2.4-bis.
- ✅ **LORI, chiuso il 05/09/2026:** contenitore misurato (30 caratteri per riga a 375 px), CSS escluso come via d'uscita, riga di corpo più lunga confermata a **31** (`PHOTO:`), che va a capo di un carattere e si accetta (§2.2-bis). ⚠️ La sua misura di 24 riguardava `ORGANIZER_EMAIL`, cioè la più lunga delle altre 18, non il massimo delle 19. Resta a LORI la verifica finale quando MUSE consegna le due righe vere. ⚠️ **Il riallineamento del blocco sulla pagina non è più dovuto**: il blocco è stato tolto il 05/09/2026 (§2.2-bis), e se torna dipende dalla riga aperta a Davide qui sopra. ⚡ **Resta invece a LORI, e da oggi è scritto:** la rimisurazione del pavimento di **152 px** ogni volta che una voce della lista lingue si allunga (**§2.5**).
- **DA CHIEDERE A DAVIDE (aperto il 06/09/2026):** il **blocco copiabile del modello e la legenda dei formati sono stati tolti dalla pagina il 05/09/2026**, il giorno stesso in cui hai deciso che «l'esempio sta dentro il blocco copiabile». Oggi la pagina porta un solo riquadro, che il questionario riempie coi valori veri. La decisione resta tua: **il blocco torna** (e allora serve il testo di MUSE qui sopra), **oppure la decisione del 05/09 decade** e §2.2-bis diventa la forma per chi scrive la mail a mano, senza copia sulla pagina. ⛔ OPS non l'ha dichiarata decaduta da sé.
- **DA CHIEDERE A LORI e MUSE (aperto il 06/09/2026):** il separatore `, ` dei campi a più valori (§2.2-0) oggi **non è insegnato da nessuna parte sulla pagina** — il questionario lo scrive da solo, quindi chi usa il modulo non ne ha bisogno, ma chi scrive la mail a mano non sa che le categorie si separano così. Serve una riga di legenda? E se sì, dove sta, ora che la legenda dei formati non c'è più? ⛔ Sono parole cliente-facing (regola 0) e posizione sulla pagina: non le decide OPS.
- **DA CHIEDERE A DAVIDE o STRATEGO (aperto il 06/09/2026, trovato e non riparato):** il questionario offre **12 categorie**, non 11. La dodicesima è `workshop` («Workshops», `docs/submit-evento.html` riga 65) e **non è fra le undici chiavi** di PLAN.md e di §2.1 di questa SOP. ⛔ Non l'ho aggiunta né tolta: la tassonomia delle categorie non è di OPS, e oggi il controllo §4.3 rimbalzerebbe un evento che la pagina permette di scegliere. La domanda secca: **`workshop` entra fra le chiavi ufficiali, o esce dalla pagina?**
- Nessun altro punto fuori perimetro trovato durante la stesura: il resto rientra nel mestiere OPS (formato, controlli, registro) o è già assegnato da PLAN.md (testi a MUSE, prezzi a STRATEGO/VAULT, sito a SENTINEL/LORI).
