# Immagini dimostrative — TiranaToDo

Sei foto **generate con AI** (Freepik, 04/09/2026), non fotografie reali.
Servono a far vedere le pagine piene. **Non sono eventi veri e non sono luoghi veri.**

Brief: LORI, giro «segnaposto e brief immagini» del 04/09/2026.
Esecuzione: PM (LORI non ha i tool di immagine).

## I file

| File | Categoria | Cosa si vede |
|---|---|---|
| `music.jpg` | music | Chitarra e microfono su un palco piccolo, pubblico di spalle |
| `food.jpg` | food | Tavolo condiviso, mani che passano una teglia |
| `art.jpg` | art | Sala espositiva, tele astratte, due visitatori di spalle |
| `outdoors.jpg` | outdoors | Sentiero di montagna all'alba, camminatori di spalle |
| `meetups.jpg` | meetups | Terrazza all'ora blu, gruppo in cerchio di spalle |
| `cinema.jpg` | cinema | Cinema all'aperto, sedie vuote e telo bianco |

## Formato

1400 × 875 px (16:10), JPG, tutti sotto 300 KB.

⚠️ Il brief chiedeva 16:10 e il generatore non ha quel rapporto: generate a 16:9 e
ritagliate al centro sui lati. Le pagine usano `object-fit: cover`, quindi il layout
non cambia.

## Prima di pubblicare

⛔ **Gate disclosure AI.** Sono immagini generate: la disclosure va risolta prima
che una di queste finisca su una pagina pubblica.
⛔ **Sono provvisorie.** Le foto vere le caricano gli organizzatori dal form.
Lo stato «evento senza foto» non è risolto da queste: è risolto dal segnaposto
disegnato `.te-media-empty` nel progetto Claude Design.

## Scarto dichiarato

La prima `meetups` è stata buttata: volti a fuoco e riconoscibili, e uno skyline che
somigliava a New York. Rifatta con il gruppo di spalle e tetti bassi anonimi.
Restano volti piccoli e sfocati sullo sfondo — persone che non esistono, non ritratti.

## Cartella `web/`

Stesse sei immagini, ridotte a **700×438** e ricompresse (qualità 58) per il mockup in Claude Design.
La testata a 1280px ne mostra 660, quindi 700 basta e avanza.
Servono a essere richiamate da un indirizzo pubblico, perché le pagine del mockup non hanno un posto dove caricare un file.

⛔ **Non sono i file di produzione.** In produzione si usano gli originali 1400×875 di questa cartella, e il sito li serve nei formati e nelle misure che decide la build.
