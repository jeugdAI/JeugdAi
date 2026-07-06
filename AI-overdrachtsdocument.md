# Technisch overdrachtsdocument – AI-functionaliteit voor beschikkinganalyse

Dit document beschrijft uitsluitend het AI-gedeelte dat in dit project is geïmplementeerd voor de analyse van CJG-beschikkingen. Het is bedoeld voor een toekomstige ontwikkelaar die deze functionaliteit zelfstandig kan installeren, configureren, onderhouden en gebruiken.

---

## 1. Overzicht AI-functionaliteit

### Wat doet deze AI-functionaliteit?

De AI-functionaliteit analyseert de tekst van een beschikking en vergelijkt die met een vooraf gedefinieerd procesdocument. De output bestaat uit een lijst met controlepunten en een samenvatting.

### Welk probleem lost dit op?

De functionaliteit helpt bij het controleren of een beschikking voldoet aan de CJG-vereisten zoals die zijn vastgelegd in het procesdocument. De AI moet expliciet aangeven welke onderdelen aanwezig zijn en welke ontbreken.

### Hoe verloopt de analyse van een beschikking?

1. De React-pagina verzamelt de beschikkingstekst.
2. De frontend stuurt de tekst naar de Django-backend op de endpoint /api/analyze/.
3. De backend leest het Markdown-procesdocument.
4. De backend bouwt een prompt op op basis van:
   - het procesdocument
   - de controlepunten uit dat document
   - de tekst van de beschikking
5. De backend stuurt die prompt naar Ollama.
6. Ollama geeft een antwoord terug.
7. De backend parseert de respons en normaliseert deze naar een vaste JSON-structuur.
8. De frontend toont de resultaten aan de gebruiker.

### Welke rol speelt Ollama?

Ollama is de lokale LLM-runtime die de prompt ontvangt en een antwoord teruggeeft. In dit project wordt Ollama aangeroepen via HTTP op:

- http://127.0.0.1:11434/api/chat

### Welke rol speelt Mistral?

De backend roept het model met de naam `mistral:7b` aan. Dit is de modelnaam die in de huidige implementatie wordt gebruikt.

### Welke rol speelt het Markdown-procesdocument?

Het bestand backend/ai_analysis/proces_document.md is de bron van waarheid voor de analyse. De backend leest dit bestand en gebruikt het als basis voor de prompt aan Ollama. De AI mag uitsluitend op basis van dit document beoordelen.

### Welke rol speelt de Django backend?

De Django-backend is het orchestratiepunt van de AI-functionaliteit. Het:

- ontvangt de aanvraag
- leest het procesdocument
- extraheert controlepunten
- bouwt de prompt
- roept Ollama aan
- parseert en normaliseert de respons
- retourneert JSON aan de frontend

### Welke rol speelt de React-pagina voor de AI?

De React-pagina in frontend/src/components/BeschikkingForm.jsx is de gebruikersinterface. Hier kan een gebruiker de beschikking invoeren en de analyse starten. De frontend stuurt de tekst naar de backend en laat de resultaten zien.

---

## 2. Welke bestanden behoren tot dit AI-gedeelte?

### Backend

- backend/ai_analysis/views.py
  - Bevat de volledige AI-logica: lezen van het procesdocument, opbouwen van prompts, aanroepen van Ollama, parsen van de respons en normaliseren van de output.

- backend/ai_analysis/urls.py
  - Definieert de endpoint /api/analyze/.

- backend/ai_analysis/proces_document.md
  - Het procesdocument dat als bron van waarheid dient.

- backend/ai_analysis/tests.py
  - Bevat regressietesten voor de prompt-opbouw en de analyse-logica.

- backend/ai_analysis/mistral_installatie.md
  - Bevat installatie-informatie voor de AI-omgeving.

- backend/ai_analysis/views_openai_backup.py
  - Backupversie van een eerdere AI-implementatie. Niet nodig voor de huidige werking.

### Backend-configuratie

- backend/requirements.txt
  - Bevat de Python-afhankelijkheden voor de backend, inclusief Django en coverage.

- backend/config/settings.py
  - Bevat de AI-gerelateerde configuratie voor INSTALLED_APPS, CORS, database, en omgevingvariabelen.

- backend/config/urls.py
  - Verbindt de AI-endpoint in het API-routingsysteem.

### Frontend

- frontend/src/components/BeschikkingForm.jsx
  - React-component voor het invoeren van de beschikking en het starten van de analyse.

- frontend/package.json
  - Bevat de frontend-scriptjes en dependencies voor de AI-pagina.

- frontend/vite.config.js
  - Bevat de Vite-proxy voor /api naar de Django-backend.

### Test- en CI-gerelateerd

- backend/.coveragerc
  - Configuratie voor coverage.

- backend/test_ollama.py
  - Smoke-test voor de Ollama-integratie.

- .github/workflows/python-tests.yml
  - GitHub Actions-pipeline voor tests en coverage.

---

## 3. Software die vooraf geïnstalleerd moet worden

### Python

- Officiële download: https://www.python.org/downloads/
- Aanbevolen versie: Python 3.13, omdat de GitHub Actions-workflow dit gebruikt.
- Minimale versie: in dit project is 3.13 expliciet gebruikt in de CI-opstelling.
- Waarom nodig: de Django-backend en de tests draaien met Python.

### Node.js

- Officiële download: https://nodejs.org/
- Aanbevolen versie: recente LTS-versie.
- Minimale versie: niet expliciet vastgelegd in het project; een recente Node-versie is nodig voor Vite 8 en React 19.
- Waarom nodig: de frontend-pagina wordt met Vite en React uitgevoerd.

### npm

- Officieel onderdeel van Node.js.
- Waarom nodig: voor het installeren van frontend-dependencies en het starten van de ontwikkelserver.

### Git

- Officiële download: https://git-scm.com/downloads
- Waarom nodig: voor ophalen en onderhouden van de repository.

### Visual Studio Code

- Officiële download: https://code.visualstudio.com/
- Waarom nodig: ontwikkelomgeving voor het project.

### Ollama

- Officiële download: https://ollama.com/download
- Waarom nodig: lokale LLM-runtime voor de AI-analyse.

### Mistral-model

- Het project verwacht het model `mistral:7b`.
- Waarom nodig: dit is het model dat de backend aanroept.

### Extra software

- Geen aparte database-service is nodig voor de AI-functionaliteit zelf. De configuratie valt terug op SQLite als er geen PostgreSQL-variabelen zijn ingesteld.

---

## 4. Visual Studio Code

De volgende extensies zijn nuttig voor dit AI-gedeelte:

- Python
  - Noodzakelijk voor Django en Python-ontwikkeling.

- Pylance
  - Aanbevolen voor Python-ondersteuning en type-informatie.

- GitHub Copilot
  - Aanbevolen voor ontwikkelondersteuning.

- ESLint
  - Nuttig voor de React-frontend.

Er is geen aparte VS Code-configuratie in het project opgenomen voor de AI-functionaliteit.

---

## 5. Repository ophalen

### Optie 1: Git clone

1. Open een terminal.
2. Ga naar de gewenste locatie op de computer.
3. Clone de repository.

Voorbeeld:

```bash
git clone <repository-url>
cd <repository-map>
```

### Optie 2: ZIP downloaden

1. Download de repository als ZIP.
2. Pak de inhoud uit.
3. Open de map in Visual Studio Code.

---

## 6. Backend installeren

### 6.1 Virtuele omgeving maken

Ga naar de repository-root en maak een virtuele omgeving aan:

```bash
python -m venv .venv
```

### 6.2 Virtuele omgeving activeren

Op Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Op Windows Command Prompt:

```bat
.venv\Scripts\activate.bat
```

### 6.3 Dependencies installeren

Ga naar de backend-map en installeer de requirements:

```bash
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 6.4 Controle van de instelling

Run de Django check:

```bash
python manage.py check
```

### 6.5 Migraties

Er zijn geen AI-specifieke migraties nodig voor deze functionaliteit. De backend kan worden getest zonder extra database-migraties voor het AI-gedeelte. Indien de volledige Django-applicatie wordt opgestart in een schone omgeving, is de standaard Django-opdracht:

```bash
python manage.py migrate
```

### 6.6 Backend starten

Start de backend met:

```bash
python manage.py runserver 127.0.0.1:8000
```

De AI-endpoint is dan beschikbaar op:

- http://127.0.0.1:8000/api/analyze/

---

## 7. Frontend AI-pagina starten

### 7.1 Frontend-installatie

Ga naar de frontend-map:

```bash
cd frontend
npm install
```

### 7.2 Frontend starten

Start de ontwikkelserver:

```bash
npm run dev
```

### 7.3 Poort

De frontend zal standaard via Vite beschikbaar zijn op:

- http://localhost:5173/

### 7.4 Belangrijke frontend-configuratie

De Vite-configuratie proxy-t /api naar de Django-backend op:

- http://127.0.0.1:8000

---

## 8. Ollama installeren

### 8.1 Ollama downloaden en installeren

Volg de officiële installatie-instructies van Ollama via:

- https://ollama.com/download

### 8.2 Ollama starten

Start de lokale service:

```bash
ollama serve
```

Controleer of Ollama bereikbaar is via:

- http://127.0.0.1:11434

### 8.3 Model downloaden

De backend verwacht het model `mistral:7b`.
Download dit model met:

```bash
ollama pull mistral:7b
```

### 8.4 Controle van geïnstalleerde modellen

```bash
ollama list
```

### 8.5 Model opnieuw downloaden

```bash
ollama pull mistral:7b
```

### 8.6 Model verwijderen

```bash
ollama rm mistral:7b
```

### 8.7 Model wijzigen

De modelnaam is momenteel hardcoded in backend/ai_analysis/views.py op de regel waarin `_call_ollama` het model `mistral:7b` aanroept. Als een andere modelnaam gewenst is, moet deze in die code worden aangepast.

---

## 9. Markdown procesdocument

### Locatie

Het procesdocument staat hier:

- backend/ai_analysis/proces_document.md

### Hoe de backend het gebruikt

De backend leest dit bestand via de functie `_read_process_document()` in backend/ai_analysis/views.py. Het wordt gebruikt als bron van waarheid voor de prompt aan Ollama.

### Hoe het aangepast kan worden

Een nieuwe ontwikkelaar kan het document aanpassen door de inhoud van backend/ai_analysis/proces_document.md te wijzigen.

### Welke invloed wijzigingen hebben

Wijzigingen in dit bestand veranderen direct wat de AI als bron van waarheid ziet. Daardoor verandert ook de analyse van beschikkingen.

### Waar op gelet moet worden

- De parser in views.py verwacht dat de controlepunten onder het kopje `# Controlepunten` staan.
- De controlepunten moeten in de vorm `## 1. Titel` of vergelijkbaar worden beschreven.
- Als het bestand wordt verplaatst of hernoemd, zal de backend het niet meer vinden.

---

## 10. AI-analyse starten

### Stap 1 – Start Ollama

```bash
ollama serve
```

### Stap 2 – Activeer virtuele omgeving

```bash
.\.venv\Scripts\Activate.ps1
```

### Stap 3 – Start Django backend

```bash
cd backend
python manage.py runserver 127.0.0.1:8000
```

### Stap 4 – Start React frontend

```bash
cd frontend
npm install
npm run dev
```

### Stap 5 – Open de AI-pagina

Open in de browser:

- http://localhost:5173/

### Stap 6 – Voer een beschikking in

Gebruik het tekstveld in de React-pagina. De frontend verstuurt de tekst naar de backend.

### Stap 7 – Analyse uitvoeren

Klik op de knop om de beschikking te analyseren.

### Stap 8 – Resultaat controleren

De backend retourneert JSON met:

- results
- summary

De React-pagina toont deze resultaten in de interface.

---

## 11. Omgevingsinstellingen

### .env

Er is momenteel geen .env-bestand in de repository aanwezig.

### settings.py

De relevante AI-omgeving is in backend/config/settings.py opgenomen. Belangrijke punten:

- `ALLOWED_HOSTS` bevat localhost en 127.0.0.1
- `CORS_ALLOWED_ORIGINS` bevat http://localhost:5173 en http://127.0.0.1:5173
- de AI-app is opgenomen in `INSTALLED_APPS`
- de backend gebruikt standaard een SQLite-database tenzij PostgreSQL-variabelen zijn ingesteld

### Lokale poorten

- Django backend: http://127.0.0.1:8000
- Ollama: http://127.0.0.1:11434
- Vite frontend: http://localhost:5173

### AI-configuratie en paden

- Het procesdocument wordt gelezen via backend/ai_analysis/proces_document.md
- Ollama wordt aangeroepen op http://127.0.0.1:11434/api/chat
- Het gebruikte model is `mistral:7b`

---

## 12. Testen

### Unit tests

Run de Django-tests vanaf de backend-map:

```bash
cd backend
python manage.py test
```

### Coverage

Run coverage voor de relevante apps:

```bash
cd backend
coverage run --source=ai_analysis,api manage.py test
coverage report --fail-under=70
```

### Coverage met detailweergave

```bash
cd backend
coverage report -m
```

### GitHub Actions pipeline

De workflow staat in:

- .github/workflows/python-tests.yml

Deze workflow:

- installeert Python
- installeert dependencies
- voert Django checks uit
- runt tests
- runt coverage

---

## 13. Troubleshooting

### 1. Python niet gevonden

- Oorzaak: Python is niet geïnstalleerd of niet toegevoegd aan PATH.
- Oplossing: installeer Python en voeg de map toe aan PATH.
- Controle: run `python --version`.

### 2. `pip` werkt niet

- Oorzaak: virtuele omgeving is niet geactiveerd of pip is niet bijgewerkt.
- Oplossing: activeer de virtuele omgeving en run `python -m pip install --upgrade pip`.
- Controle: run `python -m pip --version`.

### 3. Dependencies kunnen niet worden geïnstalleerd

- Oorzaak: verkeerde map of ontbrekende virtuele omgeving.
- Oplossing: ga naar backend en run `python -m pip install -r requirements.txt`.
- Controle: controleer of requirements.txt aanwezig is.

### 4. Backend start niet

- Oorzaak: Django-afhankelijkheden zijn niet geïnstalleerd of er is een configuratieprobleem.
- Oplossing: run `python manage.py check`.
- Controle: lees de traceback en controleer of de virtuele omgeving actief is.

### 5. Frontend start niet

- Oorzaak: Node.js of npm is niet geïnstalleerd of de dependencies zijn niet geïnstalleerd.
- Oplossing: run `npm install` in de frontend-map.
- Controle: run `npm run dev`.

### 6. Ollama draait niet

- Oorzaak: de service is niet gestart.
- Oplossing: run `ollama serve`.
- Controle: open http://127.0.0.1:11434.

### 7. Mistral-model ontbreekt

- Oorzaak: het model `mistral:7b` is niet lokaal geïnstalleerd.
- Oplossing: run `ollama pull mistral:7b`.
- Controle: run `ollama list`.

### 8. AI reageert niet of geeft geen JSON

- Oorzaak: Ollama is niet beschikbaar, het model is niet aanwezig, of de backend kan de respons niet parsen.
- Oplossing: controleer Ollama, controleer het model, en kijk naar de backend-logboeken.
- Controle: kijk naar de output van de backend in de terminal.

### 9. Markdown-procesdocument wordt niet gevonden

- Oorzaak: het bestand is verplaatst of hernoemd.
- Oplossing: controleer of backend/ai_analysis/proces_document.md bestaat.
- Controle: open het bestand en controleer of de naam exact overeenkomt.

### 10. CORS-fouten in de browser

- Oorzaak: de frontend-origin is niet toegestaan in settings.py.
- Oplossing: controleer `CORS_ALLOWED_ORIGINS` in backend/config/settings.py.
- Controle: de frontend moet draaien op http://localhost:5173 of http://127.0.0.1:5173.

### 11. Backend kan de frontend niet bereiken

- Oorzaak: de Vite-proxy is niet correct geconfigureerd of de backend draait niet.
- Oplossing: controleer `frontend/vite.config.js` en start zowel backend als frontend.
- Controle: kijk of /api naar http://127.0.0.1:8000 wordt gepraat.

### 12. Lege tekst wordt ingevoerd

- Oorzaak: de gebruiker heeft geen inhoud ingevoerd.
- Oplossing: de frontend en backend geven dan een duidelijke foutmelding. Voer tekst in.
- Controle: controleer het tekstveld in de React-pagina.

---

## 14. Onderhoud

### Dependencies updaten

Update de versies in backend/requirements.txt en installeer ze opnieuw.

### Ollama updaten

Gebruik de installatieprocedure van Ollama en start de service opnieuw.

### Mistral vervangen

De modelnaam staat hardcoded in backend/ai_analysis/views.py. Als een ander model gewenst is, pas deze waarde aan.

### Markdown-procesdocument aanpassen

Bewerk backend/ai_analysis/proces_document.md. Let op dat de parser en de prompt hierop zijn gebaseerd.

### AI-prompts wijzigen

De prompt wordt gebouwd in backend/ai_analysis/views.py in de functie `_build_prompt`.

### Nieuwe tests toevoegen

Voeg tests toe aan backend/ai_analysis/tests.py en run vervolgens:

```bash
cd backend
python manage.py test
```

### Coverage controleren

```bash
cd backend
coverage run --source=ai_analysis,api manage.py test
coverage report -m
```

### GitHub Actions aanpassen

Pas .github/workflows/python-tests.yml aan als er nieuwe test- of coverage-stappen moeten worden toegevoegd.

---

## 15. Projectstructuur AI-gedeelte

### backend/ai_analysis/

Bevat de volledige AI-implementatie voor de analyse van beschikkingen.

### backend/config/

Bevat de Django-configuratie voor de AI-endpoint, CORS en omgeving.

### frontend/src/components/

Bevat de React-pagina voor de AI-functionaliteit.

### backend/requirements.txt

Bevat de Python-afhankelijkheden voor de backend.

### backend/.coveragerc

Bevat de coverage-configuratie.

### .github/workflows/

Bevat de CI-pipeline voor tests en coverage.

---

## 16. Privacy en veiligheid

### Waarom draait Ollama lokaal?

Ollama draait lokaal op de machine. Daardoor gaat de tekst van de beschikking niet naar een externe externe service.

### Welke privacyvoordelen biedt dit?

- De invoer blijft lokaal.
- Er is geen externe API-vereiste voor de AI-analyse.
- De verwerking is beter controleerbaar binnen de eigen omgeving.

### Hoe blijven persoonsgegevens beschermd?

- Gebruik de functionaliteit alleen binnen een beveiligde lokale omgeving.
- Deel logs niet zonder controle.
- Behandel de ingevoerde beschikkingstekst als potentiële gevoelige informatie.

### Welke bestanden niet gedeeld mogen worden

- Ingevoerde beschikkingsteksten kunnen gevoelige informatie bevatten.
- Logs kunnen tekst van beschikkingen bevatten.
- Lokale virtuele omgevingen en gegenereerde bestanden moeten niet zonder controle worden gedeeld.

---

## 17. Eindcontrole

Een nieuwe ontwikkelaar kan deze AI-functionaliteit alleen volledig overnemen als hij of zij de volgende stappen heeft doorlopen:

1. Python installeren.
2. Node.js en npm installeren.
3. Git installeren.
4. VS Code installeren.
5. Ollama installeren.
6. Het model `mistral:7b` downloaden.
7. Een virtuele Python-omgeving aanmaken.
8. De backend-dependencies installeren.
9. De frontend-dependencies installeren.
10. De Django-backend starten.
11. De React-frontend starten.
12. De AI-pagina openen.
13. Een beschikking invoeren.
14. De analyse uitvoeren.
15. De resultaten controleren.
16. Tests en coverage uitvoeren.

Als een stap ontbreekt, werkt de AI-functionaliteit niet volledig of niet betrouwbaar.
