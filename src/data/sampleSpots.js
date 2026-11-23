// Beispiel-Spots rund um Münster.
// Diese Liste ist identisch mit supabase/seed.sql und wird als Fallback
// ("Demo-Modus") genutzt, solange keine Supabase-Keys in der .env stehen.
// Koordinaten sind Näherungswerte – bitte vor Ort prüfen und ggf. anpassen.
export const SAMPLE_SPOTS = [
  {
    id: 'demo-aasee',
    name: 'Aasee – Aaseeterrassen',
    type: 'see',
    suitability: 'both',
    description:
      'Klassiker in Münster: Weite Wasserfläche, Spiegelungen und freier Blick über den See. Abends Richtung Westen, morgens Richtung Osten über das Wasser.',
    lat: 51.9555,
    lng: 7.6152,
    photo_url: null,
  },
  {
    id: 'demo-hafen',
    name: 'Stadthafen / Kreativkai',
    type: 'skyline',
    suitability: 'sunset',
    description:
      'Hafenbecken mit Industrie-Charme, Silos und Bars. Die untergehende Sonne taucht die Speicher in warmes Licht – ideal mit einem Getränk am Kai.',
    lat: 51.9476,
    lng: 7.6405,
    photo_url: null,
  },
  {
    id: 'demo-rieselfelder',
    name: 'Rieselfelder Münster',
    type: 'see',
    suitability: 'sunrise',
    description:
      'Vogelschutzgebiet mit flachen Teichen und Beobachtungsständen. Morgens oft Nebel über dem Wasser – magisch zum Sonnenaufgang.',
    lat: 52.0305,
    lng: 7.6455,
    photo_url: null,
  },
  {
    id: 'demo-longinusturm',
    name: 'Longinusturm (Baumberge)',
    type: 'berg',
    suitability: 'both',
    description:
      'Aussichtsturm auf dem Westerberg, einem der höchsten Punkte des Münsterlands. Rundumblick – bei klarer Sicht bis weit ins Land.',
    lat: 51.9707,
    lng: 7.4011,
    photo_url: null,
  },
  {
    id: 'demo-emsauen',
    name: 'Emsstrand bei Gelmer',
    type: 'strand',
    suitability: 'sunrise',
    description:
      'Sandige Ufer an der renaturierten Ems. Ruhiger Ort mit freiem Blick nach Osten über die Auenlandschaft.',
    lat: 52.0130,
    lng: 7.6960,
    photo_url: null,
  },
  {
    id: 'demo-hiltruper-see',
    name: 'Hiltruper See',
    type: 'see',
    suitability: 'sunset',
    description:
      'Kleiner Waldsee im Süden von Münster mit Strandbad. Vom Ostufer aus schöner Blick auf die Sonne, die hinter den Bäumen versinkt.',
    lat: 51.8995,
    lng: 7.6395,
    photo_url: null,
  },
  {
    id: 'demo-dach-hafen',
    name: 'Parkdeck am Hafen (Dach)',
    type: 'dach',
    suitability: 'sunset',
    description:
      'Oberstes Parkdeck mit Blick über die Dächer Richtung Innenstadt und Dom. Beispiel-Spot – Zugang vorher prüfen.',
    lat: 51.9488,
    lng: 7.6362,
    photo_url: null,
  },
  {
    id: 'demo-halterner-stausee',
    name: 'Halterner Stausee – Seestern',
    type: 'strand',
    suitability: 'both',
    description:
      'Großer Sandstrand am Stausee, gut 40 km südwestlich von Münster. Abends spektakulär über dem Wasser, morgens ruhig und menschenleer.',
    lat: 51.7445,
    lng: 7.2030,
    photo_url: null,
  },
]
