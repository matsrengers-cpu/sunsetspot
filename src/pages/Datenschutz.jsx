import LegalLayout from './LegalLayout'

// HINWEIS: Platzhalter (hervorgehoben) durch echte Angaben ersetzen und den Text
// an deine tatsächliche Konfiguration (Hosting, Supabase-Region, Plausible) anpassen.
// Dies ist keine Rechtsberatung.
const P = ({ children }) => <span className="placeholder">{children}</span>
const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

export default function Datenschutz() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <p className="text-sm text-white/50">Stand: <P>November 2026</P></p>

      <h2>1. Verantwortlicher</h2>
      <p>
        <P>Vorname Nachname</P>, <P>Straße Hausnummer</P>, <P>PLZ Ort</P>
        <br />
        E-Mail: <P>datenschutz@deine-domain.de</P>
      </p>

      <h2>2. Überblick</h2>
      <p>
        SunsetSpots kommt ohne Benutzerkonto aus und setzt keine Werbe- oder Tracking-Cookies. Wir verarbeiten nur die Daten,
        die nötig sind, um die Karte, die Sonnenzeiten, die Wetterprognose und die gemeinsame Spot-Datenbank bereitzustellen.
      </p>

      <h2>3. Hosting und Server-Logfiles</h2>
      <p>
        Diese Website wird gehostet bei <P>Name des Hosters, Anschrift</P>. Beim Aufruf werden technisch notwendige Daten
        verarbeitet (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser-Typ, Referrer). Rechtsgrundlage ist Art. 6
        Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren und stabilen Betrieb). Die Logfiles werden nach{' '}
        <P>7 Tagen</P> gelöscht. Mit dem Hoster besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO).
      </p>

      <h2>4. Speicherung auf deinem Gerät (localStorage)</h2>
      <p>
        Wir speichern lokal in deinem Browser: deine Favoriten, die gewählte Ansicht (Auf-/Untergang), den Radius und deine
        Auswahl im Einwilligungsbanner. Außerdem legt der Service Worker einen Offline-Cache an (App-Dateien, Kartenkacheln,
        Wetterdaten). Diese Daten verlassen dein Gerät nicht. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG (unbedingt
        erforderlich für den von dir gewünschten Dienst). Du kannst die Daten jederzeit über die Browser-Einstellungen löschen.
      </p>

      <h2>5. Standort (Geolocation)</h2>
      <p>
        Wenn du es im Browser erlaubst, nutzen wir deinen Standort, um die Karte auf deine Umgebung zu zentrieren und
        Entfernungen zu berechnen. Der Standort wird nur in deinem Browser verarbeitet und nicht auf unseren Servern
        gespeichert. Für die Wetterprognose wird eine auf ca. 1 km gerundete Koordinate an Open-Meteo übermittelt (siehe 7).
        Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über die Browser-Abfrage), jederzeit widerrufbar.
      </p>

      <h2>6. Karte und Ortssuche (OpenStreetMap)</h2>
      <p>
        Kartenkacheln werden von den Servern der OpenStreetMap Foundation (St John’s Innovation Centre, Cowley Road, Cambridge,
        CB4 0WS, Vereinigtes Königreich) geladen. Die Ortssuche nutzt den Dienst Nominatim derselben Stiftung. Dabei wird deine
        IP-Adresse und ggf. dein Suchbegriff übermittelt. Für das Vereinigte Königreich besteht ein Angemessenheitsbeschluss der
        EU-Kommission. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Mehr:{' '}
        <A href="https://osmfoundation.org/wiki/Privacy_Policy">osmfoundation.org/wiki/Privacy_Policy</A>
      </p>

      <h2>7. Wetterdaten (Open-Meteo)</h2>
      <p>
        Für die Prognose rufen wir Bewölkungsdaten bei Open-Meteo (Patrick Zippenfenig, Schweiz) ab. Übermittelt werden die
        gerundeten Koordinaten des angezeigten Ortes und der Spots sowie deine IP-Adresse. Für die Schweiz besteht ein
        Angemessenheitsbeschluss. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Mehr:{' '}
        <A href="https://open-meteo.com/en/terms">open-meteo.com/en/terms</A>
      </p>

      <h2>8. Spot-Datenbank und Fotos (Supabase)</h2>
      <p>
        Spots und Fotos werden bei Supabase Inc. (970 Toa Payoh North #07-04, Singapur) gespeichert; die Datenbank liegt in der
        Region <P>EU Central (Frankfurt)</P>. Wenn du einen Spot hinzufügst, speichern wir Name, Typ, Eignung, Beschreibung,
        Position, Foto und Zeitpunkt. Diese Inhalte sind für alle Besucher öffentlich sichtbar. Wir speichern keine
        personenbezogenen Angaben zu deiner Person; beim Abruf wird technisch deine IP-Adresse verarbeitet. Bitte lade keine Fotos
        hoch, auf denen Personen erkennbar sind oder an denen du keine Rechte hast. Mit Supabase besteht ein Vertrag zur
        Auftragsverarbeitung; für eventuelle Übermittlungen in Drittländer gelten die EU-Standardvertragsklauseln.
        Rechtsgrundlage: Art. 6 Abs. 1 lit. b und f DSGVO. Löschwünsche an <P>datenschutz@deine-domain.de</P>.
      </p>

      <h2>9. Besucherstatistik (Plausible Analytics)</h2>
      <p>
        Nur wenn du im Banner zustimmst, nutzen wir Plausible Analytics (Plausible Insights OÜ, Västriku tn 2, 50403 Tartu,
        Estland). Plausible setzt keine Cookies und speichert keine IP-Adressen; Besuche werden über einen täglich wechselnden,
        anonymisierten Hash gezählt. Erfasst werden u.a. aufgerufene Seiten, Referrer, Land, Gerätetyp und Browser. Die Daten
        werden in der EU verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO; du kannst deine Einwilligung jederzeit über
        „Cookie-Einstellungen“ im Footer widerrufen. Mehr: <A href="https://plausible.io/data-policy">plausible.io/data-policy</A>
      </p>

      <h2>10. Deine Rechte</h2>
      <ul>
        <li>Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18)</li>
        <li>Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21)</li>
        <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3)</li>
        <li>
          Beschwerde bei einer Aufsichtsbehörde (Art. 77), z.B. bei der für uns zuständigen Behörde:{' '}
          <P>Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen</P>
        </li>
      </ul>

      <h2>11. Änderungen</h2>
      <p>Wir passen diese Datenschutzerklärung an, wenn sich die Website oder die Rechtslage ändert.</p>
    </LegalLayout>
  )
}
