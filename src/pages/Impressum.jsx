import LegalLayout from './LegalLayout'

// HINWEIS: Alle Texte in <span className="placeholder"> durch deine echten Angaben ersetzen.
// Dies ist keine Rechtsberatung – lass das Impressum im Zweifel prüfen.
const P = ({ children }) => <span className="placeholder">{children}</span>

export default function Impressum() {
  return (
    <LegalLayout title="Impressum">
      <p className="text-sm text-white/50">Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</p>

      <h2>Anbieter</h2>
      <p>
        <P>Vorname Nachname</P>
        <br />
        <P>Straße Hausnummer</P>
        <br />
        <P>PLZ Ort</P>
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <P>kontakt@deine-domain.de</P>
        <br />
        Telefon: <P>+49 (0) 123 456789</P> <span className="text-white/40">(optional, aber empfohlen)</span>
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: <P>DE123456789</P>
        <br />
        <span className="text-white/40">(nur angeben, falls vorhanden – sonst diesen Abschnitt löschen)</span>
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        <P>Vorname Nachname</P>
        <br />
        <P>Anschrift wie oben</P>
      </p>

      <h2>Nutzerinhalte</h2>
      <p>
        Spots und Fotos können von Nutzerinnen und Nutzern anonym hinzugefügt werden. Wir machen uns diese Inhalte nicht zu
        eigen. Wenn dir ein rechtswidriger Inhalt auffällt, schreib uns bitte an <P>kontakt@deine-domain.de</P> – wir entfernen
        ihn nach Prüfung umgehend.
      </p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität –
        insbesondere der Wetterprognosen und der Angaben zu Spots – übernehmen wir keine Gewähr. Bitte beachte beim Besuch von
        Spots die örtlichen Gegebenheiten, Zugangsregeln und deine eigene Sicherheit.
      </p>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte
        der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Quellen</h2>
      <ul>
        <li>
          Kartendaten: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>-Mitwirkende (ODbL)
        </li>
        <li>
          Wetterdaten: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo.com</a> (CC BY 4.0)
        </li>
        <li>Sonnenstand: SunCalc (Vladimir Agafonkin, BSD-Lizenz)</li>
      </ul>
    </LegalLayout>
  )
}
