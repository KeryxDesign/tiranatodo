# TiranaToDo

Portale eventi di Tirana per expat e turisti: filtri per data e categoria, ricerca, card che si aprono su una pagina dettaglio, modulo con cui chiunque manda un evento, voto «Mi interessa». Mobile-first.

Il progetto è di Davide Filippini. Questo repo nasce il 2026-09-04 con il solo piano di lavoro: il codice arriva per fasi, come descritto in `PLAN.md`.

## Da dove si parte

1. Leggi `PLAN.md` per intero prima di scrivere codice. Le fasi si fanno in ordine, una per sessione.
2. Il visivo viene dal design system in Claude Design («Tirana Events Design System»): si importano i token, non si inventano colori o misure. ⚡ **E il verso è uno solo**: si modifica lì e si ricopia qui, mai il contrario — vedi «Claude Design e questo repo» più sotto.
3. Nessun segreto nel codice o nel repo: chiavi Supabase, Turnstile e Resend stanno nei secret di Cloudflare Pages e in `.dev.vars` locale, che è ignorato da git.

## Claude Design e questo repo — il verso, e cosa si fa quando il codice cambia qui

Scritto da OPS il 06/09/2026, dentro la ratifica **#163**. Procedura completa: `Sistema/_CORE/sop/operations/sop_allineamento_claude_design_repo.md`.

**Questo repo rientra nel perimetro della #163.** La SOP vale quando un repo pubblica l'HTML di Claude Design **tal quale** (GitHub Pages o simili), ed è esattamente cosa fa `docs/`. ⚠️ È il caso che `sop_claude_design.md` §4.3 lascia **fuori** dal suo perimetro, per decisione di Davide: quindi non è coperto da nessun'altra parte.

**Il verso è uno solo: Claude Design → repo.** ⛔ **La risalita repo → Claude Design non è ammessa, e non è una preferenza: è impossibile con gli strumenti che ci sono.** `write_files` accetta solo dati inline e `local_path` risponde *not implemented* (fatto M7 della SOP). Non c'è procedura da scrivere: non esiste un comando che faccia risalire un file. ⚡ E il file scende **solo dentro una sessione** che ha i tool `mcp__claude-design__*`: non si automatizza.

**⚠️ Stato di oggi, dichiarato e non riparato.** Il 06/09/2026 il questionario è stato modificato **dentro il repo** (`docs/submit-evento.html`, `docs/submit-evento.js`, `docs/pagine.css`): scelte multiple, orari a quarti, link Maps, lingue con «Other». `docs/README.md` riga 5 dice da sempre che «si modifica in Claude Design e si ricopia, non si modifica in questa cartella»: **la regola è stata rotta e le due copie oggi divergono.** Il repo è avanti.

**Cosa si fa quando il codice cambia qui — due casi, e il discrimine è uno solo: la modifica ha senso anche dentro Claude Design?**
1. **Sì — è una decisione di forma o di contenuto** (un campo nuovo, una lista di scelte, una misura del design): ⛔ non risale. **Si rifà a mano dentro Claude Design**, poi il file **riscende** nel repo (passo 1 della SOP §6) e si **riarma `sync/stato.json`**. Il caso del 06/09/2026 è questo.
2. **No — è un adattamento che vive solo qui** (percorsi, build, deploy, cose che dentro Claude Design non avrebbero senso): resta nella **patch registrata** `sync/riparazioni-<nome>.patch` e non risale mai. È il meccanismo per cui la SOP non chiede «sono uguali?» ma «**il repo si ricostruisce dal file di Claude Design applicando la patch registrata?**».

⛔ **Quello che non si fa: lasciare le due copie diverse senza dichiararlo.** È lo stato **BIFORCATI** (codice 3), e ⛔ solo `ALLINEATI` (codice 0) apre il lavoro.

**✅ `sync/` esiste dal 06/09/2026, e il primo verdetto è `ALLINEATI` (codice 0), 9 file su 9.** La riga **0-zero-bis** del `CLAUDE.md` scatta su `test -f <repo>/sync/stato.json`: da oggi scatta. I quattro file sono `sync/_design-al-2026-09-06.css`, `sync/riparazioni-commenti.patch`, `sync/stato.json` (elenco a 9 voci), `sync/verifica.sh` (copia di quello di UNCAGED, scritta da SENTINEL).

**Com'è stato armato, e cosa è costato.** Il 06/09/2026 il questionario `/submit` era stato costruito **dentro il repo**: sei file divergenti, dove la struttura di `stato.json` ne regge **uno solo** con differenze registrate. Su decisione di Davide il contenuto è stato **riportato dentro Claude Design** (SOP §8, seconda riga), non registrato come patch. Sette file su otto sono tornati identici byte per byte.

⚠️ **L'unica differenza dichiarata è `docs/_ds/styles.css`**, 27 byte su 33.297: **quattro righe di commento decorativo**, dove le sequenze lunghe di caratteri di riquadro escono con un conteggio diverso a ogni scrittura dentro Claude Design. Zero token, zero selettori, zero regole, nessun effetto a schermo. Sta in `sync/riparazioni-commenti.patch` e la ricostruzione è provata: baseline + patch dà lo sha del file pubblicato.

⚠️ **Due cose restano aperte, e non si chiudono qui.**
1. **Lo script pretende esattamente un file con patch**: zero lo fa uscire in errore, due pure [MISURA, SENTINEL, 06/09/2026, tre corse]. Oggi ne abbiamo esattamente uno e il controllo regge, ma il giorno in cui quello scarto sparisce il controllo esce **1**. `DA CHIEDERE A OPS`: zero differenze è un errore, o è il caso normale di un repo pulito? È il buco **4-bis** di §14 della SOP.
2. **`_cal.css` (185 byte)** è nel progetto Claude Design ma non nel repo: un banco di prova nato durante la bonifica. È dichiarato fra i file da ignorare; **va tolto a mano dall'editor**.

## Stack

Astro + Tailwind (output ibrido) · Cloudflare Pages + Pages Functions · Supabase (Postgres, Storage, Auth) · Cloudflare Turnstile · Resend · Cloudflare Web Analytics.

## Dominio

`tiranatodo.com` (principale) e `tiranatodo.al` (redirect). Registrazione dopo la verifica marchio.
