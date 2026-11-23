-- =====================================================================
-- SunsetSpots – Beispiel-Spots rund um Münster
-- Nach schema.sql im SQL Editor ausführen. Koordinaten sind Näherungswerte.
-- =====================================================================
insert into public.spots (name, type, suitability, description, lat, lng, photo_url) values
  ('Aasee – Aaseeterrassen', 'see', 'both',
   'Klassiker in Münster: Weite Wasserfläche, Spiegelungen und freier Blick über den See. Abends Richtung Westen, morgens Richtung Osten über das Wasser.',
   51.9555, 7.6152, null),
  ('Stadthafen / Kreativkai', 'skyline', 'sunset',
   'Hafenbecken mit Industrie-Charme, Silos und Bars. Die untergehende Sonne taucht die Speicher in warmes Licht – ideal mit einem Getränk am Kai.',
   51.9476, 7.6405, null),
  ('Rieselfelder Münster', 'see', 'sunrise',
   'Vogelschutzgebiet mit flachen Teichen und Beobachtungsständen. Morgens oft Nebel über dem Wasser – magisch zum Sonnenaufgang.',
   52.0305, 7.6455, null),
  ('Longinusturm (Baumberge)', 'berg', 'both',
   'Aussichtsturm auf dem Westerberg, einem der höchsten Punkte des Münsterlands. Rundumblick – bei klarer Sicht bis weit ins Land.',
   51.9707, 7.4011, null),
  ('Emsstrand bei Gelmer', 'strand', 'sunrise',
   'Sandige Ufer an der renaturierten Ems. Ruhiger Ort mit freiem Blick nach Osten über die Auenlandschaft.',
   52.013, 7.696, null),
  ('Hiltruper See', 'see', 'sunset',
   'Kleiner Waldsee im Süden von Münster mit Strandbad. Vom Ostufer aus schöner Blick auf die Sonne, die hinter den Bäumen versinkt.',
   51.8995, 7.6395, null),
  ('Parkdeck am Hafen (Dach)', 'dach', 'sunset',
   'Oberstes Parkdeck mit Blick über die Dächer Richtung Innenstadt und Dom. Beispiel-Spot – Zugang vorher prüfen.',
   51.9488, 7.6362, null),
  ('Halterner Stausee – Seestern', 'strand', 'both',
   'Großer Sandstrand am Stausee, gut 40 km südwestlich von Münster. Abends spektakulär über dem Wasser, morgens ruhig und menschenleer.',
   51.7445, 7.203, null);
