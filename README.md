# TiranaToDo

Portale eventi di Tirana per expat e turisti: filtri per data e categoria, ricerca, card che si aprono su una pagina dettaglio, modulo con cui chiunque manda un evento, voto «Mi interessa». Mobile-first.

Il progetto è di Davide Filippini. Questo repo nasce il 2026-09-04 con il solo piano di lavoro: il codice arriva per fasi, come descritto in `PLAN.md`.

## Da dove si parte

1. Leggi `PLAN.md` per intero prima di scrivere codice. Le fasi si fanno in ordine, una per sessione.
2. Il visivo viene dal design system in Claude Design («Tirana Events Design System»): si importano i token, non si inventano colori o misure.
3. Nessun segreto nel codice o nel repo: chiavi Supabase, Turnstile e Resend stanno nei secret di Cloudflare Pages e in `.dev.vars` locale, che è ignorato da git.

## Stack

Astro + Tailwind (output ibrido) · Cloudflare Pages + Pages Functions · Supabase (Postgres, Storage, Auth) · Cloudflare Turnstile · Resend · Cloudflare Web Analytics.

## Dominio

`tiranatodo.com` (principale) e `tiranatodo.al` (redirect). Registrazione dopo la verifica marchio.
