# ☀️ SunsetSpots

Finde im Umkreis die besten Orte für **Sonnenuntergänge und Sonnenaufgänge** und sieh sofort, ob der nächste gut wird.

- Vollbild-Karte (Leaflet + OpenStreetMap), zentriert auf deinen Standort (Fallback: Münster)
- Umschalter Sonnenaufgang / Sonnenuntergang, Ortssuche (Nominatim) und Radius 1–50 km
- Zeiten, Golden Hour, Blue Hour und Himmelsrichtung (SunCalc, offline)
- Qualitäts-Score 0–100 aus der Bewölkung (Open-Meteo): farbig auf der Karte und pro Spot
- Filter nach Eignung (Auf-/Untergang) und Spot-Typ, Favoriten pro Gerät
- Eigene Spots mit Foto hinzufügen (Supabase), anonym
- PWA: installierbar, Offline-Cache für App, Karte, Wetter und Fotos
- Impressum, Datenschutzerklärung, Einwilligungsbanner, cookielose Statistik (Plausible, optional)

## Schnellstart

```bash
npm install
npm run dev
```

Dann <http://localhost:5173> öffnen. **Ohne Supabase-Keys läuft die Seite im Demo-Modus:** Die 8 Beispiel-Spots aus
`src/data/sampleSpots.js` werden angezeigt, neue Spots nur lokal im Browser gespeichert.

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktions-Build nach `dist/` |
| `npm run preview` | Build lokal testen (auch PWA/Offline) |
| `npm run icons` | PNG-Icons aus `public/icons/icon.svg` neu erzeugen |

## Supabase einrichten (Schritt für Schritt)

1. **Konto anlegen:** <https://supabase.com> → „Start your project“ → mit GitHub oder E-Mail registrieren.
2. **Projekt erstellen:** „New project“ → Name z.B. `sunsetspots`, sicheres Datenbank-Passwort vergeben (gut aufheben),
   **Region: „Central EU (Frankfurt)“** wählen (wichtig für DSGVO) → „Create new project“. Ein paar Minuten warten.
3. **Schema anlegen:** Links „SQL Editor“ → „New query“ → kompletten Inhalt von `supabase/schema.sql` einfügen → „Run“.
   Das legt die Tabelle `spots`, die Zugriffsregeln (RLS) und den Foto-Bucket `spot-photos` an.
4. **Beispiel-Spots einfügen:** Neue Query → Inhalt von `supabase/seed.sql` einfügen → „Run“.
   Kontrolle: Links „Table Editor“ → `spots` → 8 Einträge.
5. **Keys holen:** Links unten „Project Settings“ (Zahnrad) → „API“ (bzw. „Data API“ / „API Keys“). Du brauchst:
   - **Project URL**, z.B. `https://abcdefghijkl.supabase.co`
   - **anon / public key** (langer Schlüssel, beginnt mit `eyJ…`, oder in neueren Projekten der „publishable key“ `sb_publishable_…`)
   - ⚠️ **Niemals** den `service_role`- bzw. „secret“-Key verwenden – der gehört nicht in den Browser.
6. **`.env` anlegen:** Im Projektordner `.env.example` nach `.env` kopieren und ausfüllen:
   ```env
   VITE_SUPABASE_URL=https://abcdefghijkl.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
7. **Dev-Server neu starten** (`Strg+C`, dann `npm run dev`). Der Hinweis „Demo-Modus“ verschwindet, Spots kommen jetzt aus Supabase.

Der anon-Key darf öffentlich im Browser stehen: Die RLS-Regeln erlauben nur Lesen und Anlegen – Ändern und Löschen geht
ausschließlich über das Supabase-Dashboard. Unerwünschte Spots löschst du im „Table Editor“, Fotos unter „Storage“ → `spot-photos`.

## Statistik (Plausible, optional)

1. Konto bei <https://plausible.io> anlegen und deine Domain hinzufügen.
2. In `.env`: `VITE_PLAUSIBLE_DOMAIN=deine-domain.de`
3. Das Skript wird nur geladen, wenn die Domain gesetzt ist **und** der Besucher im Banner der Statistik zugestimmt hat.
   Eigene Events: `track('Name')` aus `src/lib/analytics.js`.

## Rechtliches

- `src/pages/Impressum.jsx` und `src/pages/Datenschutz.jsx` enthalten **orange markierte Platzhalter** – durch echte
  Angaben ersetzen (Name, Anschrift, E-Mail, Hoster, Supabase-Region). Keine Rechtsberatung; im Zweifel prüfen lassen.
- Das Banner (`src/components/ConsentBanner.jsx`) speichert die Auswahl lokal; im Footer lässt es sich über
  „Cookie-Einstellungen“ erneut öffnen.

## Veröffentlichen

Jeder statische Hoster funktioniert (z.B. Netlify, Vercel, Cloudflare Pages, Uberspace). Build-Befehl `npm run build`,
Ausgabeordner `dist`. Die `.env`-Werte als Umgebungsvariablen beim Hoster eintragen. Für React Router muss der Hoster
alle Pfade auf `index.html` umleiten (Netlify: `public/_redirects` mit `/* /index.html 200`; Vercel macht das für Vite-Projekte meist automatisch).
Für Geolocation und Service Worker ist **HTTPS** nötig (localhost ist ausgenommen).

## Wie der Score berechnet wird

`src/lib/weather.js → computeScore()`:

- **Mittlere + hohe Wolken** (hohe stärker gewichtet) sind die „Leinwand“: ideal 30–70 % → volle Punkte.
  Wolkenlos ergibt ca. 40 Punkte (schön, aber unspektakulär), geschlossene Decke deutlich weniger.
- **Tiefe Wolken** verdecken die Sonne am Horizont: bis 10 % egal, darüber sinkt der Score stark.
- Werte werden zwischen den Stunden auf den exakten Zeitpunkt des Auf-/Untergangs interpoliert.
- Farben: grün ≥ 65, orange 25–64, rot < 25.

## Projektstruktur

```
src/
  pages/        Home (Karte), Impressum, Datenschutz
  components/   MapView, ModeToggle, SearchBar, FilterBar, SunInfo, SpotDetail, AddSpotForm, ConsentBanner …
  lib/          sun.js (SunCalc), weather.js (Open-Meteo + Score), spots.js (Supabase), geo.js, favorites.js, analytics.js
  data/         sampleSpots.js (Demo-Daten = seed.sql)
supabase/       schema.sql, seed.sql
```

## TODO

- Push-Benachrichtigungen bei guten Bedingungen (siehe Kommentar in `src/pages/Home.jsx`)
- Moderation neuer Spots (siehe Kommentar in `supabase/schema.sql`)
