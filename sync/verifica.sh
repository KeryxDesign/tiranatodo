#!/bin/bash
# Dice se il repo e il progetto Claude Design sono la stessa cosa.
# TiranaToDo: copia di uncaged/sync/verifica.sh, stessa logica e stessi esiti.
# ⛔ DIVERGENZA DICHIARATA, 07/09/2026: l'esito 7 (ALLINEATI PER ETAG, SOP §4.1,
# ratifica #165) e' stato messo QUI e NON su uncaged/sync/verifica.sh, per
# decisione di Davide del 07/09/2026 (uncaged non aveva un verdetto di
# allineamento in quella sessione e aprirlo costava 290 KB di letture). §16 riga
# k chiede i due file nella stessa passata: la riga resta aperta per uncaged.
# ⚡ La divergenza sbaglia dalla parte sicura: uncaged resta col controllo piu'
# severo, cioe' F1 completa sempre. ⛔ Non e' una svista e non si "ripara" qui.
#
# I file di Claude Design NON si scaricano da qui: si leggono dentro una
# sessione, con list_files e read_file del suo MCP, e si salvano su disco.
# Questo script riceve quello che e' sceso e da' il verdetto, file per file.
#
#   bash sync/verifica.sh <cartella>   cartella con i file scesi da Claude Design.
#                                      Lo script cerca prima il nome "repo" della
#                                      voce (con il suo docs/...), poi il nome
#                                      "design": una cartella piatta coi nomi di
#                                      Claude Design basta, ed e' la forma comoda.
#   bash sync/verifica.sh <file>       un file solo: vale come il file sorgente
#                                      dichiarato in stato.json, campo
#                                      "file_sorgente" (NON "quello con la
#                                      patch"): gli altri restano NON CONTROLLATI
#   bash sync/verifica.sh              senza argomento: meta' del controllo,
#                                      guarda solo il lato repo
#
# Nella cartella puo' stare anche un file _etag.json, {"<nome design>": "<etag>"},
# trascritto verbatim da list_files dal PM dentro la sessione. Se non c'e', lo
# script si comporta esattamente come prima della #165. Se c'e', una voce puo'
# valere controllata SENZA essere stata riscaricata, e allora esce 7. Vale solo
# se passa tutti i vincoli di SOP §4.1.3, che qui sono codice e non commento:
#   C1  mai il file_sorgente, mai una voce con patch: quelli scendono sempre
#   C2  il lato repo dev'essere fermo (repo_sha256 registrato == sha di adesso)
#   C3  l'etag registrato dev'essere nato da una lettura: serve il campo
#       "etag_provato_il" nella voce, e un design_sha256 non nullo
#   C4  etag condiviso da voci con "design" diverso = una scrittura, non un
#       file: o valgono tutte, provate nella stessa F1, o nessuna
#   C5  controprova a ogni corsa sul file_sorgente, che scende comunque: se per
#       lui etag uguale e contenuto diverso, l'ipotesi dell'etag e' falsa, la
#       scorciatoia si spegne e la cosa va a Davide in una riga
# ⛔ L'etag e' opaco: non e' un hash del contenuto e non si ricalcola. La fiducia
# e' una sola: non resta uguale quando il file cambia (if_match di write_files).
#
# Quali file si guardano lo dice sync/stato.json, elenco "file". I percorsi
# "repo" partono dalla radice del repo, quindi cominciano per docs/.
# ZERO file con patch e' lecito, ed e' il caso normale di un repo che pubblica
# l'artefatto tal quale: allora si controlla tutto byte per byte. Al massimo uno
# puo' averla: per lui si controlla che baseline + patch dia ancora il file
# pubblicato. Piu' di uno oggi si ferma, e non perche' sia sbagliato: perche'
# nessuno ha ancora deciso cosa voglia dire (SOP §2.1, §9.3, §14 buco 4-bis).
# Tutti gli altri devono essere uguali byte per byte al file di
# Claude Design. Un design_sha256 a null vuol dire "mai letto dal progetto":
# quel file e' NON CONTROLLATO, mai allineato, e ⛔ non e' mai eleggibile per etag.
#
# Due voci possono avere lo stesso "design": docs/index.html e
# docs/lista-eventi.html sono lo stesso file di Claude Design con due nomi nel
# repo. F1 scende quel file una volta sola, con il suo nome di Claude Design.
#
# Il verdetto si legge a schermo. I codici di uscita sono uno per esito:
#   0  ALLINEATI        tutti i file guardati sul contenuto, nessuno mosso
#   1  ERRORE           argomento non trovato, stato.json incoerente,
#                       file del repo mancante, ricostruzione che non torna,
#                       piu' di un file con patch (limite, SOP §14 buco 4-bis),
#                       _etag.json illeggibile
#   2  REPO AVANTI      il repo ha modifiche che in Claude Design non ci sono
#   3  BIFORCATI        mossi tutti e due, o la patch non si applica piu'.
#                       Si ferma e decide una persona
#   4  DESIGN AVANTI    Claude Design ha cose che il repo non ha
#   5  NON CONTROLLATO  almeno un file non guardato lato design (nessun
#                       argomento, file solo, cartella incompleta, sha null)
#   6  DA RIARMARE      allineati di fatto, ma stato.json registra sha vecchi
#   7  ALLINEATI PER ETAG  tutti fermi, ma almeno uno l'ha detto il suo etag e
#                       non il suo contenuto. Apre il lavoro come lo 0 (SOP
#                       §4.1.4), coi due divieti d'uso di §4.1.3: un file che la
#                       sessione vuole modificare scende comunque, e un esito
#                       diverso da 0 o 7 azzera l'eleggibilita' del repo.
# Precedenza del verdetto complessivo: 1, 3, 2, 4, 5, 6, 7, e 0 solo se OGNI
# voce e' stata guardata sul contenuto.
#
# Solo bash e python3 di sistema.

set -u
cd "$(dirname "$0")/.." || exit 1
[ -f sync/stato.json ] || { echo "manca sync/stato.json"; exit 1; }
python3 - "$@" <<'PY'
import json, os, sys, hashlib, shutil, subprocess, tempfile

ARG = sys.argv[1] if len(sys.argv) > 1 else None
if ARG and not os.path.exists(ARG):
    print("non trovato: " + ARG); sys.exit(1)
DIR = ARG if ARG and os.path.isdir(ARG) else None
FILE = ARG if ARG and os.path.isfile(ARG) else None

def sha(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 16), b""): h.update(b)
    return h.hexdigest()

try:
    stato = json.load(open("sync/stato.json"))
    elenco = stato["file"]
except Exception as e:
    print("sync/stato.json illeggibile: %s" % e); sys.exit(1)

# Quante voci hanno una patch. ZERO E' LECITO, ed e' il caso normale di un repo
# che pubblica l'artefatto tal quale e non ha niente da riparare (SOP §2.1,
# §9.3, ratifica #166): allora il ramo della patch non si apre e tutte
# le voci si controllano byte per byte.
# ⛔ Piu' di una NON e' un errore di scrittura di stato.json: e' un limite di
# questo script, e nessuno ha ancora deciso cosa voglia dire (SOP §14, buco
# 4-bis). Sono due cose diverse e hanno due messaggi diversi apposta.
con_patch = [v for v in elenco if v.get("patch")]
if len(con_patch) > 1:
    print("LIMITE NON ANCORA DECISO: questo script regge al massimo un file con patch, nell'elenco ce ne sono %d" % len(con_patch))
    print("  (%s)" % ", ".join(v["repo"] for v in con_patch))
    print("Non e' stato.json scritto male: e' il buco 4-bis di §14 della SOP, aperto e non deciso. Cosa voglia dire piu' di una patch lo decide una persona. Ci si ferma.")
    sys.exit(1)

# Chi e' il sorgente lo dice stato.json col campo "file_sorgente", NON la
# presenza di una patch: la patch e' una conseguenza frequente, non l'identita'
# (SOP §2.1). Serve alla modalita' "un file solo" e ai vincoli C1 e C5.
SORGENTE = stato.get("file_sorgente")
voci_sorgente = [v for v in elenco if v.get("design") == SORGENTE]
VOCE_SORGENTE = voci_sorgente[0] if len(voci_sorgente) == 1 else None
if FILE and VOCE_SORGENTE is None:
    if not voci_sorgente:
        print("stato.json incoerente: file_sorgente %r non combacia con il campo design di nessuna voce dell'elenco." % SORGENTE)
    else:
        print("stato.json incoerente: file_sorgente %r combacia con %d voci dell'elenco (%s)." % (SORGENTE, len(voci_sorgente), ", ".join(v["repo"] for v in voci_sorgente)))
    print("Con un file solo non si sa a quale voce vale: ci si ferma. Passa la cartella intera, o ripara file_sorgente.")
    sys.exit(1)

def lato_design(v):
    """percorso del file sceso da Claude Design, o None se non c'e'"""
    if DIR:
        for nome in (v["repo"], v.get("design", v["repo"])):
            p = os.path.join(DIR, nome)
            if os.path.isfile(p): return p
        return None
    if FILE and v is VOCE_SORGENTE:
        return FILE
    return None

# ---------------------------------------------------------------------------
# La scorciatoia dell'etag (SOP §4.1, ratifica #165 del 06/09/2026).
# Senza _etag.json non cambia niente: ELEGGIBILI resta vuoto e lo script si
# comporta come prima.
# ---------------------------------------------------------------------------
ETAG = None          # {"<nome design>": "<etag>"}
ELEGGIBILI = set()   # id() delle voci che valgono controllate senza discesa
SPENTA = None        # perche' la scorciatoia non si applica in questa corsa
NOTE_ETAG = []

if DIR:
    p_etag = os.path.join(DIR, "_etag.json")
    if os.path.isfile(p_etag):
        try:
            ETAG = json.load(open(p_etag))
            if not isinstance(ETAG, dict) or not all(isinstance(k, str) and isinstance(x, str) for k, x in ETAG.items()):
                raise ValueError('non e\' un oggetto {"<nome design>": "<etag>"} di sole stringhe')
        except Exception as e:
            print("%s illeggibile: %s" % (p_etag, e))
            print("Gli etag si trascrivono verbatim dal listing di list_files, dentro una sessione. Ci si ferma.")
            sys.exit(1)

def eleggibile(v):
    """C1, C2, C3: quando una voce vale controllata senza riscaricarla."""
    if ETAG is None: return False
    if v.get("patch"): return False                                  # C1
    if v.get("design") == SORGENTE: return False                     # C1
    if lato_design(v) is not None: return False                      # e' sceso: vince il contenuto
    if not os.path.isfile(v["repo"]): return False
    if v.get("design_sha256") is None: return False                  # mai letto dal progetto (§2.1)
    if v.get("repo_sha256") != sha(v["repo"]): return False          # C2
    e = v.get("design_etag")
    if not e or ETAG.get(v.get("design")) != e: return False         # etag live == registrato
    if not v.get("etag_provato_il"): return False                    # C3
    return True

if ETAG is not None:
    candidate = {id(v) for v in elenco if eleggibile(v)}

    # C4: un etag condiviso da voci con "design" diverso descrive la SCRITTURA
    # che le ha prodotte insieme, non un file. O valgono tutte, e provate nella
    # stessa F1, o nessuna.
    gruppi = {}
    for v in elenco:
        if v.get("design_etag"): gruppi.setdefault(v["design_etag"], []).append(v)
    for et, voci in gruppi.items():
        if len({v.get("design") for v in voci}) < 2: continue   # stesso file con due nomi nel repo: non e' un gruppo
        prove = {v.get("etag_provato_il") for v in voci}
        if not all(id(v) in candidate for v in voci) or len(prove) != 1 or None in prove:
            if any(id(v) in candidate for v in voci):
                NOTE_ETAG.append("C4: l'etag %s e' condiviso da %s: non tutte eleggibili o provate nella stessa F1, quindi nessuna vale per etag" % (et, ", ".join(v["repo"] for v in voci)))
            for v in voci: candidate.discard(id(v))

    # C1 e C5: il file_sorgente non e' mai eleggibile e scende SEMPRE; se non e'
    # sceso non c'e' controprova, e senza controprova la scorciatoia non vale.
    d_sorg = lato_design(VOCE_SORGENTE) if VOCE_SORGENTE is not None else None
    if VOCE_SORGENTE is None:
        SPENTA = "stato.json non identifica una sola voce col file_sorgente %r: senza sorgente non c'e' controprova (C1, C5)" % SORGENTE
    elif d_sorg is None:
        SPENTA = "il file_sorgente (%s) non e' nella cartella: scende SEMPRE ed e' la controprova di ogni corsa (C1, C5)" % SORGENTE
    elif ETAG.get(SORGENTE) == VOCE_SORGENTE.get("design_etag") and sha(d_sorg) != VOCE_SORGENTE.get("design_sha256"):
        SPENTA = ("CONTROPROVA FALLITA (C5) sul file_sorgente %s: etag uguale a quello registrato, contenuto DIVERSO.\n"
                  "                    L'ipotesi dell'etag e' falsa. La scorciatoia si spegne su TUTTI i repo lo stesso giorno,\n"
                  "                    §4.1 va marcata SUPERATA e la cosa va a Davide in una riga (SOP §15-bis, soglia una volta sola)." % SORGENTE)
    if SPENTA is None:
        ELEGGIBILI = candidate

NOMI = {0:"ALLINEATO", 1:"ERRORE", 2:"REPO AVANTI", 3:"BIFORCATI",
        4:"DESIGN AVANTI", 5:"NON CONTROLLATO", 6:"DA RIARMARE",
        7:"ALLINEATO PER ETAG"}
esiti = []   # (codice, file, spiegazione)

def esito(c, v, msg):
    esiti.append((c, v["repo"], msg))
    print("  %-18s %s\n%s%s" % (NOMI[c], v["repo"], " " * 21, msg))

print("stato registrato: allineamento del %s, etag %s" % (stato.get("ultimo_allineamento"), stato.get("design_etag")))
print("lato design     : %s" % (DIR and "cartella " + DIR or FILE and "solo il sorgente, " + FILE or "NON FORNITO, meta' del controllo"))
print("etag live       : %s" % ("non forniti (_etag.json assente): F1 completa, come prima della #165" if ETAG is None
                                else "_etag.json, %d voci. Eleggibili senza discesa: %d" % (len(ETAG), len(ELEGGIBILI))))
for n in NOTE_ETAG: print("                  " + n)
if SPENTA: print("  SCORCIATOIA SPENTA  " + SPENTA)
print()

for v in elenco:
    R, D = v.get("repo_sha256"), v.get("design_sha256")
    if not os.path.isfile(v["repo"]):
        esito(1, v, "il file non c'e' nel repo, ma stato.json lo registra"); continue
    r = sha(v["repo"])
    repo_mosso = (r != R)
    d_path = lato_design(v)
    d = sha(d_path) if d_path else None

    if id(v) in ELEGGIBILI:
        esito(7, v, "non riscaricato: etag live uguale a quello registrato e provato da una discesa il %s, repo fermo (SOP §4.1)" % v.get("etag_provato_il")); continue

    if v.get("patch"):
        # coerenza dello stato: baseline == sha design registrato, baseline + patch == sha repo registrato
        base, patch = v["baseline"], v["patch"]
        if not (os.path.isfile(base) and os.path.isfile(patch)):
            esito(1, v, "manca %s o %s: senza, il controllo non esiste" % (base, patch)); continue
        if sha(base) != D:
            esito(1, v, "stato.json incoerente: la baseline %s non ha lo sha design registrato" % base); continue
        t = tempfile.mkdtemp(); tb = os.path.join(t, "ricostruito.html"); shutil.copy(base, tb)
        ok = subprocess.run(["patch", "-s", tb], stdin=open(patch, "rb"), capture_output=True).returncode == 0
        ric = sha(tb) if ok else None; shutil.rmtree(t, ignore_errors=True)
        if ric != R:
            esito(1, v, "la ricostruzione baseline + patch NON da' lo sha repo registrato: sync/ e' corrotta, ci si ferma"); continue
        if d is None:
            manca = "non c'e' nella cartella, ne' come %s ne' come %s. " % (v["repo"], v.get("design")) if DIR else ""
            esito(2 if repo_mosso else 5, v, manca + ((v["repo"] + " e' cambiato dopo l'ultimo allineamento: le modifiche vanno nella patch, o dentro Claude Design") if repo_mosso
                  else "ricostruzione ok, repo fermo. Il lato Claude Design non e' stato guardato")); continue
        design_mosso = (d != D)
        if repo_mosso and design_mosso:
            esito(3, v, "si sono mossi tutti e due. FERMARSI e decidere quale vince, riparazione per riparazione"); continue
        if repo_mosso:
            esito(2, v, "il repo ha modifiche che in Claude Design non ci sono"); continue
        if not design_mosso:
            esito(0, v, "ricostruzione ok, stesso sorgente"); continue
        # solo il design si e' mosso: si prova a riapplicare la patch sul file nuovo
        t = tempfile.mkdtemp(); tn = os.path.join(t, os.path.basename(v["repo"])); shutil.copy(d_path, tn)
        ok = subprocess.run(["patch", "-s", tn], stdin=open(patch, "rb"), capture_output=True).returncode == 0
        if ok:
            esito(4, v, "il sorgente e' cambiato e le riparazioni si applicano ancora. Nuovo %s in: %s\n%sControllalo APRENDOLO, poi copialo su %s e riarma sync/ (copia nuova, patch nuova, stato.json)" % (v["repo"], tn, " " * 21, v["repo"]))
        else:
            shutil.rmtree(t, ignore_errors=True)
            esito(3, v, "il sorgente e' cambiato e le riparazioni NON si applicano piu': il design ha toccato le stesse righe. Si riapplicano a mano, una per una, da %s" % patch)
        continue

    # file senza patch: deve essere identico byte per byte al file di Claude Design
    if d is None:
        manca = "non c'e' nella cartella. " if DIR else ""
        if D is None:
            esito(5, v, manca + "sha design mai letto dal progetto (null) e file non fornito: nessuno l'ha guardato"); continue
        if repo_mosso:
            esito(2, v, manca + "cambiato nel repo dopo l'ultimo allineamento"); continue
        if R != D:
            esito(4, v, manca + "gia' all'ultimo allineamento repo e design non erano identici (%d/%d byte). Scendi il file e copialo sul repo" % (v.get("repo_byte", 0), v.get("design_byte", 0))); continue
        esito(5, v, manca + "repo fermo. Il lato Claude Design non e' stato guardato"); continue
    if r == d:
        if D == d:
            esito(0, v, "identico byte per byte"); continue
        esito(6, v, "identico byte per byte, ma stato.json registra uno sha %s: riarmare (§7), o il controllo dopo mente" % ("null" if D is None else "vecchio")); continue
    design_mosso = (D is not None and d != D)
    if repo_mosso and (design_mosso or D is None):
        esito(3, v, "diversi, e si sono mossi tutti e due (o il lato design non era mai stato registrato). Decide una persona"); continue
    if repo_mosso:
        esito(2, v, "diversi: e' il repo che e' cambiato"); continue
    esito(4, v, "diversi: Claude Design ha byte che il repo non ha (%d byte repo, %d design). Copia il file del design sul repo e riarma" % (os.path.getsize(v["repo"]), os.path.getsize(d_path)))

# Precedenza (SOP §4.1.4): 1, 3, 2, 4, 5, 6, 7, e 0 solo se ogni voce e' stata
# guardata sul contenuto. ⛔ Un solo NON CONTROLLATO o DA RIARMARE si mangia il 7.
codici = {c for c, _, _ in esiti}
if 1 in codici: finale = 1
elif 3 in codici or (2 in codici and 4 in codici): finale = 3
elif 2 in codici: finale = 2
elif 4 in codici: finale = 4
elif 5 in codici: finale = 5
elif 6 in codici: finale = 6
elif 7 in codici: finale = 7
else: finale = 0
NOMI[0] = "ALLINEATI"; NOMI[7] = "ALLINEATI PER ETAG"
print()
n = len(esiti); nc = sum(1 for c, _, _ in esiti if c == 5); ne = sum(1 for c, _, _ in esiti if c == 7)
if finale == 0:
    print("VERDETTO: ALLINEATI - %d file su %d controllati e fermi. Si lavora." % (n, n))
elif finale == 7:
    print("VERDETTO: ALLINEATI PER ETAG - %d file su %d fermi, di cui %d creduti fermi sul loro etag e non riscaricati. Si lavora." % (n, n, ne))
    print("          ⛔ Un file che questa sessione vuole modificare scende comunque, e un esito diverso da 0 o 7 azzera l'eleggibilita' del repo (SOP §4.1.3).")
elif finale == 3 and 3 not in codici:
    print("VERDETTO: BIFORCATI - un file e' avanti nel repo e un altro in Claude Design: si sono mossi tutti e due. Decide una persona.")
else:
    print("VERDETTO: %s%s" % (NOMI[finale], " - %d file su %d NON CONTROLLATI: il verdetto non e' completo" % (nc, n) if nc and finale != 5 else
                              " - %d file su %d non guardati lato design. Non vale come allineati." % (nc, n) if finale == 5 else ""))
print("exit %d" % finale)
sys.exit(finale)
PY
