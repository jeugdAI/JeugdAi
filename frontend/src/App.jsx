import { useState } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
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
  setIsAnalyzing(true);

  try {

    const response = await fetch('http://127.0.0.1:8000/api/analyze/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        beschikkingText: beschikkingText,
      }),
    });

    const data = await response.json();

    if (data.results) {
      setAnalysisResults(data.results);
    } else {
      setAnalysisResults([
        {
          type: 'error',
          message: 'Geen geldige AI response ontvangen.',
        },
      ]);
    }

  } catch (error) {

    setAnalysisResults([
      {
        type: 'error',
        message: 'Fout bij verbinden met backend of AI.',
      },
    ]);

  }

  setIsAnalyzing(false);
};
  return (
    <div className="size-full bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header with Logo and Municipality Name */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-green-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-700 rounded flex items-center justify-center text-white">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <h1 className="uppercase tracking-wide text-green-700 mb-0">Gemeente</h1>
              <h2 className="uppercase tracking-wide text-green-700 mt-0">Capelle aan den IJssel</h2>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="uppercase tracking-wider text-green-700">Beschikking Jeugdzorg</h1>
          <p className="text-gray-600 mt-2">Vul onderstaande velden in voor de beschikking</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          {/* Algemene informatie */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="mb-4 text-green-700">Algemene informatie</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Datum beschikking *</label>
                <input
                  type="date"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Kenmerk/Referentienummer</label>
                <input
                  type="text"
                  value={kenmerk}
                  onChange={(e) => setKenmerk(e.target.value)}
                  placeholder="JZ-2026-"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
            </div>
          </div>

          {/* Cliënt informatie */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="mb-4 text-green-700">Cliënt informatie</h3>
            <div>
              <label className="block text-sm mb-2 text-gray-700">Naam cliënt/betrokkene *</label>
              <input
                type="text"
                value={naamClient}
                onChange={(e) => setNaamClient(e.target.value)}
                placeholder="Voor- en achternaam"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
          </div>

          {/* Behandelaar informatie */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="mb-4 text-green-700">Behandelaar</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Behandelend ambtenaar</label>
                <input
                  type="text"
                  value={behandelaar}
                  onChange={(e) => setBehandelaar(e.target.value)}
                  placeholder="Naam ambtenaar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Doorkiesnummer</label>
                <input
                  type="tel"
                  value={telefoon}
                  onChange={(e) => setTelefoon(e.target.value)}
                  placeholder="010-"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
            </div>
          </div>

          {/* Zorg en besluit */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="mb-4 text-green-700">Zorg en besluit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Type zorg *</label>
                <select
                  value={typeZorg}
                  onChange={(e) => setTypeZorg(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
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

              <div>
                <label className="block text-sm mb-2 text-gray-700">Besluit *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="besluit"
                      value="toekennen"
                      checked={besluit === 'toekennen'}
                      onChange={(e) => setBesluit(e.target.value)}
                      className="text-green-700 focus:ring-green-700"
                    />
                    <span>Toekennen</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="besluit"
                      value="afwijzen"
                      checked={besluit === 'afwijzen'}
                      onChange={(e) => setBesluit(e.target.value)}
                      className="text-green-700 focus:ring-green-700"
                    />
                    <span>Afwijzen</span>
                  </label>
                </div>
              </div>

              {besluit === 'toekennen' && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Ingangsdatum</label>
                    <input
                      type="date"
                      value={ingangsdatum}
                      onChange={(e) => setIngangsdatum(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Duur van zorg</label>
                    <input
                      type="text"
                      value={duurZorg}
                      onChange={(e) => setDuurZorg(e.target.value)}
                      placeholder="bijv. 6 maanden"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Text Area for content */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-700">
            Inhoud beschikking (motivering, overwegingen, rechtsmiddelen) *
          </label>
          <textarea
            value={beschikkingText}
            onChange={(e) => setBeschikkingText(e.target.value)}
            rows={15}
            placeholder="Geachte heer/mevrouw [naam],

Op [datum] hebben wij uw aanvraag voor jeugdzorg ontvangen...

Motivering en overwegingen:
[Beschrijf hier waarom het besluit genomen wordt, op basis van welke criteria, etc.]

Besluit:
Wij kennen toe/wijzen af...

Rechtsmiddelen:
Tegen deze beschikking kunt u binnen 6 weken bezwaar maken bij het college van B&W van de gemeente Capelle aan den IJssel...

Met vriendelijke groet,
[naam behandelaar]"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 resize-y text-sm leading-relaxed"
          />
        </div>

        {/* Analyze Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={analyzeBeschikking}
            disabled={isAnalyzing}
            className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyseren...</span>
              </>
            ) : (
              <span>Analyseer beschikking</span>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysisResults.length > 0 && (
          <div className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-xl mb-4 text-gray-900">Analyse resultaten</h2>
            <div className="space-y-3">
              {analysisResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex gap-3 p-4 rounded-lg ${
                    result.type === 'error'
                      ? 'bg-red-50 border border-red-200'
                      : result.type === 'warning'
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {result.type === 'error' ? (
                      <AlertCircle className="size-5 text-red-600" />
                    ) : result.type === 'warning' ? (
                      <Info className="size-5 text-yellow-600" />
                    ) : (
                      <CheckCircle className="size-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        result.type === 'error'
                          ? 'text-red-900'
                          : result.type === 'warning'
                          ? 'text-yellow-900'
                          : 'text-green-900'
                      }`}
                    >
                      {result.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}