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

  const analyzeBeschikking = async () => {
    if (!beschikkingText.trim()) {
      setAnalysisResults([
        {
          type: 'error',
          message: 'Vul de inhoud van de beschikking in voordat u analyseert.'
        }
      ]);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults([]);

    try {
      const response = await fetch('/api/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          beschikkingText,
          datum,
          kenmerk,
          naamClient,
          behandelaar,
          telefoon,
          typeZorg,
          besluit,
          ingangsdatum,
          duurZorg
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Analyse mislukt: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[analysis] Backend response', data);
      const results = (Array.isArray(data.results) ? data.results : []).map((item) => {
        const title = item.title ? `${item.title}: ` : '';
        const details = item.message || item.advies || '';
        const message = details.startsWith(item.title) ? details : `${title}${details}`.trim();
        return { ...item, message };
      });

      if (results.length === 0) {
        const fallbackMessage = data?.summary?.conclusion || data?.error || data?.raw || 'Geen analyse-resultaten ontvangen. Controleer het procesdocument en de backend.';
        setAnalysisResults([
          {
            type: 'warning',
            message: fallbackMessage
          }
        ]);
      } else {
        setAnalysisResults(results);
      }
    } catch (error) {
      console.error('[analysis] Frontend error', error);
      setAnalysisResults([
        {
          type: 'error',
          message: error.message || 'Er is een fout opgetreden tijdens de analyse.'
        }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
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
            placeholder="Typ hier de inhoud van de beschikking die moet worden geanalyseerd."
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
