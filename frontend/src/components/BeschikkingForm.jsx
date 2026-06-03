import { useState } from 'react';
import './BeschikkingForm.css';

export default function BeschikkingForm() {
  const [datum, setDatum] = useState('');
  const [kenmerk, setKenmerk] = useState('');
  const [naamClient, setNaamClient] = useState('');
  const [behandelaar, setBehandelaar] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [typeZorg, setTypeZorg] = useState('');
  const [besluit, setBesluit] = useState('');
  const [ingangsdatum, setIngangsdatum] = useState('');
  const [duurZorg, setDuurZorg] = useState('');
  const [beschikkingText, setBeschikkingText] = useState('');
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeBeschikking = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const results = [];
      const text = beschikkingText.toLowerCase();

      if (!datum) {
        results.push({ type: 'error', message: 'Ontbrekend: Datum van de beschikking is niet ingevuld.' });
      }

      if (!kenmerk) {
        results.push({ type: 'warning', message: 'Ontbrekend: Referentienummer/kenmerk voor administratieve verwerking.' });
      }

      if (!naamClient) {
        results.push({ type: 'error', message: 'Ontbrekend: Naam van de cliënt/betrokkene is niet ingevuld.' });
      }

      if (!behandelaar) {
        results.push({ type: 'warning', message: 'Ontbrekend: Naam behandelend ambtenaar is niet ingevuld.' });
      }

      if (!typeZorg) {
        results.push({ type: 'error', message: 'Ontbrekend: Type zorg is niet ingevuld.' });
      }

      if (!besluit) {
        results.push({ type: 'error', message: 'Ontbrekend: Besluit (toekennen/afwijzen) is niet geselecteerd.' });
      }

      if (besluit === 'toekennen') {
        if (!ingangsdatum) {
          results.push({ type: 'warning', message: 'Ontbrekend: Bij toekenning moet de ingangsdatum worden ingevuld.' });
        }
        if (!duurZorg) {
          results.push({ type: 'warning', message: 'Ontbrekend: Duur van de toegekende zorg is niet ingevuld.' });
        }
      }

      if (!beschikkingText.trim()) {
        results.push({ type: 'error', message: 'Ontbrekend: De inhoud van de beschikking is leeg. Vul de motivering, overwegingen en het besluit in.' });
      }

      if (beschikkingText.trim() && !text.includes('motivering') && !text.includes('overweging') && !text.includes('omdat')) {
        results.push({ type: 'error', message: 'Ontbrekend: Motivering of overwegingen voor het besluit ontbreken. Een beschikking moet gemotiveerd zijn.' });
      }

      if (!text.includes('bezwaar') && !text.includes('rechtsmiddel')) {
        results.push({ type: 'warning', message: 'Ontbrekend: Informatie over bezwaarmogelijkheden (rechtsmiddelen) ontbreekt. Dit is wettelijk verplicht.' });
      }

      if (besluit === 'afwijzen' && !text.includes('jeugdwet') && !text.includes('artikel')) {
        results.push({ type: 'error', message: 'Fout: Bij afwijzing moet verwezen worden naar de wettelijke grondslag (bijv. Jeugdwet).' });
      }

      if (beschikkingText.includes('XXX') || beschikkingText.includes('[')) {
        results.push({ type: 'error', message: 'Fout: Er staan nog placeholders in de tekst (XXX, [ ]).' });
      }

      if (beschikkingText.length < 200) {
        results.push({ type: 'warning', message: 'Waarschuwing: De beschikking lijkt erg kort. Controleer of alle vereiste informatie aanwezig is.' });
      }

      if (results.length === 0) {
        results.push({ type: 'success', message: 'De beschikking bevat alle essentiële elementen. Controleer nog wel de inhoudelijke juistheid en spelling.' });
      }

      setAnalysisResults(results);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="beschikking-wrapper">
      <div className="beschikking-container">
        <div className="beschikking-header">
          <div className="beschikking-header-inner">
            <div className="beschikking-logo">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </div>
            <div className="beschikking-gemeente-naam">
              <h1>Gemeente</h1>
              <h2>Capelle aan den IJssel</h2>
            </div>
          </div>
        </div>

        <div className="beschikking-title-section">
          <h1>Beschikking Jeugdzorg</h1>
          <p>Vul onderstaande velden in voor de beschikking</p>
        </div>

        <div className="form-sections">
          <div className="form-section">
            <h3>Algemene informatie</h3>
            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="datum">Datum beschikking *</label>
                <input
                  id="datum"
                  type="date"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="kenmerk">Kenmerk/Referentienummer</label>
                <input
                  id="kenmerk"
                  type="text"
                  value={kenmerk}
                  onChange={(e) => setKenmerk(e.target.value)}
                  placeholder="JZ-2026-"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Cliënt informatie</h3>
            <div className="form-field">
              <label htmlFor="naamClient">Naam cliënt/betrokkene *</label>
              <input
                id="naamClient"
                type="text"
                value={naamClient}
                onChange={(e) => setNaamClient(e.target.value)}
                placeholder="Voor- en achternaam"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Behandelaar</h3>
            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="behandelaar">Behandelend ambtenaar</label>
                <input
                  id="behandelaar"
                  type="text"
                  value={behandelaar}
                  onChange={(e) => setBehandelaar(e.target.value)}
                  placeholder="Naam ambtenaar"
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="telefoon">Doorkiesnummer</label>
                <input
                  id="telefoon"
                  type="tel"
                  value={telefoon}
                  onChange={(e) => setTelefoon(e.target.value)}
                  placeholder="010-"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Zorg en besluit</h3>
            <div className="form-stack">
              <div className="form-field">
                <label htmlFor="typeZorg">Type zorg *</label>
                <select
                  id="typeZorg"
                  value={typeZorg}
                  onChange={(e) => setTypeZorg(e.target.value)}
                  className="form-input form-input--select"
                >
                  <option value="">Selecteer type zorg</option>
                  <option value="ambulant">Ambulante jeugdzorg</option>
                  <option value="dagbehandeling">Dagbehandeling</option>
                  <option value="verblijf-kort">Verblijf kort (tot 6 maanden)</option>
                  <option value="verblijf-lang">Verblijf lang (langer dan 6 maanden)</option>
                  <option value="pleegzorg">Pleegzorg</option>
                  <option value="anders">Anders</option>
                </select>
              </div>

              <div className="form-field">
                <label>Besluit *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="besluit"
                      value="toekennen"
                      checked={besluit === 'toekennen'}
                      onChange={(e) => setBesluit(e.target.value)}
                    />
                    Toekennen
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="besluit"
                      value="afwijzen"
                      checked={besluit === 'afwijzen'}
                      onChange={(e) => setBesluit(e.target.value)}
                    />
                    Afwijzen
                  </label>
                </div>
              </div>

              {besluit === 'toekennen' && (
                <div className="form-grid-2 form-stack-padded">
                  <div className="form-field">
                    <label htmlFor="ingangsdatum">Ingangsdatum</label>
                    <input
                      id="ingangsdatum"
                      type="date"
                      value={ingangsdatum}
                      onChange={(e) => setIngangsdatum(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="duurZorg">Duur van zorg</label>
                    <input
                      id="duurZorg"
                      type="text"
                      value={duurZorg}
                      onChange={(e) => setDuurZorg(e.target.value)}
                      placeholder="bijv. 6 maanden"
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="beschikking-textarea-section">
          <label className="beschikking-textarea-label" htmlFor="beschikkingText">
            Inhoud beschikking (motivering, overwegingen, rechtsmiddelen) *
          </label>
          <textarea
            id="beschikkingText"
            value={beschikkingText}
            onChange={(e) => setBeschikkingText(e.target.value)}
            rows={15}
            className="beschikking-textarea"
            placeholder={`Geachte heer/mevrouw [naam],\n\nOp [datum] hebben wij uw aanvraag voor jeugdzorg ontvangen...\n\nMotivering en overwegingen:\n[Beschrijf hier waarom het besluit genomen wordt, op basis van welke criteria, etc.]\n\nBesluit:\nWij kennen toe/wijzen af...\n\nRechtsmiddelen:\nTegen deze beschikking kunt u binnen 6 weken bezwaar maken bij het college van B&W van de gemeente Capelle aan den IJssel...\n\nMet vriendelijke groet,\n[naam behandelaar]`}
          />
        </div>

        <div className="analyse-button-row">
          <button
            onClick={analyzeBeschikking}
            disabled={isAnalyzing}
            className="analyse-button"
          >
            {isAnalyzing ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Analyseren...</span>
              </>
            ) : (
              <span>Analyseer beschikking</span>
            )}
          </button>
        </div>

        {analysisResults.length > 0 && (
          <div className="analyse-results-section">
            <h2>Analyse resultaten</h2>
            <div className="analyse-results-list">
              {analysisResults.map((result, index) => (
                <div
                  key={index}
                  className={`analyse-result-item analyse-result-item--${result.type}`}
                >
                  <div className={`analyse-result-icon analyse-result-icon--${result.type}`}>
                    <span className="analyse-result-symbol">•</span>
                  </div>
                  <p className={`analyse-result-text analyse-result-text--${result.type}`}>
                    {result.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
