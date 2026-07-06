import json
import logging
import os
import re
import urllib.error
import urllib.request

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)


def _log(message):
    try:
        print(message, flush=True)
    except UnicodeEncodeError:
        safe_message = message.encode("ascii", "replace").decode("ascii")
        print(safe_message, flush=True)


def _read_process_document():
    process_document_path = os.path.join(os.path.dirname(__file__), "proces_document.md")
    if not os.path.exists(process_document_path):
        raise FileNotFoundError("Procesdocument niet gevonden. Voeg backend/ai_analysis/proces_document.md toe.")

    with open(process_document_path, "r", encoding="utf-8") as handle:
        return handle.read()


def _extract_control_points(markdown_text):
    control_points = []
    in_control_points = False
    current_title = None
    current_checks = []

    for raw_line in markdown_text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        if line == "# Controlepunten":
            in_control_points = True
            continue

        if not in_control_points:
            continue

        if line.startswith("# "):
            break

        match = re.match(r"^##\s+\d+\.\s+(.+)$", line)
        if match:
            if current_title:
                control_points.append({"title": current_title, "checks": current_checks})
            current_title = match.group(1).strip()
            current_checks = []
            continue

        if current_title and (line.startswith("- ") or line.startswith("* ")):
            item = line[2:].strip()
            if item and item not in current_checks:
                current_checks.append(item)

    if current_title:
        control_points.append({"title": current_title, "checks": current_checks})

    return control_points


def _build_prompt(beschikking_text, proces_document, control_points):
    compact_points = []
    for index, point in enumerate(control_points, start=1):
        checks = point.get("checks", [])[:4]
        if checks:
            compact_points.append(f"{index}. {point['title']}: {', '.join(checks)}")
        else:
            compact_points.append(f"{index}. {point['title']}")

    control_points_text = "\n".join(compact_points)
    return f"""
Jij bent een CJG-analist voor CJG-beschikkingen.
Lees de beschikking en vergelijk deze uitsluitend met het procesdocument hieronder.
Gebruik alleen het procesdocument als bron van waarheid.
Beantwoord alleen met een compact JSON-object met deze structuur:
{{"results": [{{"type": "success|warning|error", "title": "...", "status": "Aanwezig|Ontbreekt|Onvoldoende", "advies": "..."}}], "summary": {{"score": 0, "conclusion": "..."}}}}

Geef voor elk controlepunt precies één resultaatobject.
- Status moet zijn Aanwezig, Ontbreekt of Onvoldoende.
- Advies moet een korte, concrete formulering zijn.
- Geef voor elk controlepunt alle ontbrekende onderdelen expliciet.
- Als meerdere onderdelen ontbreken, vermeld ze allemaal in het advies, gescheiden door ';'.
- Noem geen algemene opmerkingen.
- Noem geen extra controlepunten.
- Beoordeel uitsluitend de tekst van de aangeleverde beschikking.
- Gebruik het procesdocument letterlijk; doe geen algemene documentcontrole.

Procesdocument:
{proces_document}

Controlepunten:
{control_points_text}

Beschikking:
{beschikking_text}
""".strip()


def _call_ollama(prompt, json_schema=None):
    payload = {
        "model": "mistral:7b",
        "messages": [{"role": "user", "content": prompt}],
        "format": json_schema if json_schema else "json",
        "options": {"temperature": 0.0, "seed": 42, "num_predict": 900},
        "stream": False,
    }

    request = urllib.request.Request(
        "http://127.0.0.1:11434/api/chat",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=300) as response:
        body = response.read().decode("utf-8")
        try:
            response_payload = json.loads(body)
            message = response_payload.get("message", {})
            content = message.get("content", "") if isinstance(message, dict) else str(message)
        except json.JSONDecodeError:
            content = body

        return body, content


def _empty_payload(conclusion, raw_response=""):
    payload = {
        "results": [],
        "summary": {
            "score": 0,
            "conclusion": conclusion or "Geen geldige AI-respons ontvangen."
        }
    }
    if raw_response:
        payload["raw"] = raw_response
    return payload


def _normalize_analysis_payload(parsed, ai_response):
    if not isinstance(parsed, dict):
        return {
            "results": [],
            "summary": {
                "score": 0,
                "conclusion": "Model returned invalid JSON. Raw output included for debugging."
            },
            "raw": ai_response
        }

    results = parsed.get("results", [])
    if not isinstance(results, list):
        results = []

    normalized_results = []
    for item in results:
        if not isinstance(item, dict):
            continue
        status = item.get("status", "Ontbreekt")
        if status not in {"Aanwezig", "Ontbreekt", "Onvoldoende"}:
            status = "Ontbreekt"
        title = str(item.get("title") or item.get("controlepunt") or "Controlepunt")
        advies = item.get("advies") or item.get("message") or "Controleer dit onderdeel in het procesdocument."
        message = item.get("message") or f"{title}: {advies}"
        normalized_results.append({
            "type": item.get("type", "warning") if item.get("type") in {"success", "warning", "error"} else "warning",
            "title": title,
            "status": status,
            "advies": advies,
            "message": message
        })

    summary = parsed.get("summary") if isinstance(parsed.get("summary"), dict) else None
    if not summary:
        summary = {
            "score": parsed.get("score", 0),
            "conclusion": parsed.get("conclusion", "Geen geldige conclusie beschikbaar.")
        }

    return {
        "results": normalized_results,
        "summary": {
            "score": int(summary.get("score", 0)) if isinstance(summary.get("score"), (int, float)) else 0,
            "conclusion": str(summary.get("conclusion") or "Geen conclusie beschikbaar.")
        }
    }


@csrf_exempt
def analyze_beschikking(request):
    print("=== ANALYSE START ===", flush=True)
    _log("[ai-analysis] Request ontvangen")
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        body = json.loads(request.body)
        _log(f"[ai-analysis] POST-data: {json.dumps(body, ensure_ascii=False)}")
        beschikking_text = body.get("beschikkingText", "")
        _log(f"[ai-analysis] Ontvangen beschikking: {beschikking_text}")
        _log("[ai-analysis] Markdown laden")
        proces_document = _read_process_document()
        control_points = _extract_control_points(proces_document)
        _log(f"[ai-analysis] Controlepunten gevonden: {len(control_points)}")

        json_schema = {
            "type": "object",
            "required": ["results", "summary"],
            "properties": {
                "results": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": ["type", "title", "status", "advies"],
                        "properties": {
                            "type": {"type": "string", "enum": ["success", "warning", "error"]},
                            "title": {"type": "string"},
                            "status": {"type": "string", "enum": ["Aanwezig", "Ontbreekt", "Onvoldoende"]},
                            "advies": {"type": "string"}
                        },
                        "additionalProperties": False
                    }
                },
                "summary": {
                    "type": "object",
                    "required": ["score", "conclusion"],
                    "properties": {
                        "score": {"type": "integer", "minimum": 0, "maximum": 100},
                        "conclusion": {"type": "string"}
                    },
                    "additionalProperties": False
                }
            },
            "additionalProperties": False
        }

        if not beschikking_text.strip():
            return JsonResponse({
                "error": "Vul de inhoud van de beschikking in voordat u analyseert.",
                "results": [],
                "summary": {
                    "score": 0,
                    "conclusion": "Geen beschikkingstekst ontvangen voor analyse."
                }
            }, status=400)

        prompt = _build_prompt(beschikking_text, proces_document, control_points)
        _log("[ai-analysis] Prompt opgebouwd")
        _log(f"[ai-analysis] Prompt lengte: {len(prompt)} tekens")
        _log(f"[ai-analysis] Prompt inhoud:\n{prompt}")

        _log("[ai-analysis] Ollama request gestart")
        ai_raw_body = ""
        ai_response = ""
        try:
            ai_raw_body, ai_response = _call_ollama(prompt, json_schema)
            _log("[ai-analysis] Ollama raw body ontvangen")
            _log(f"[ai-analysis] Ollama raw body:\n{ai_raw_body}")
            _log("[ai-analysis] Ollama content opgehaald")
            _log(f"[ai-analysis] AI-response content:\n{ai_response}")
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError) as exc:
            logger.exception("Ollama request failed")
            ai_raw_body = ""
            ai_response = ""
            _log(f"[ai-analysis] Ollama request gefaald: {exc}")

        parsed = None
        _log("[ai-analysis] JSON parsing gestart")
        if ai_response:
            try:
                _log("[ai-analysis] Probeer AI-response direct als JSON te parsen")
                parsed = json.loads(ai_response)
                _log("[ai-analysis] JSON parsing succesvol")
            except Exception as exc:
                _log(f"[ai-analysis] Directe JSON parsing mislukt: {exc}")
                match = re.search(r"\{[\s\S]*\}\s*$", ai_response)
                if match:
                    try:
                        _log("[ai-analysis] Probeer JSON te parsen uit laatste objectblok")
                        parsed = json.loads(match.group(0))
                        _log("[ai-analysis] JSON parsing uit objectblok succesvol")
                    except Exception as inner_exc:
                        _log(f"[ai-analysis] JSON parsing uit objectblok mislukt: {inner_exc}")
                        parsed = None
                else:
                    parsed = None
        else:
            _log("[ai-analysis] Geen AI-response ontvangen voor parsing")

        if parsed is None:
            raw_response = ai_response or ai_raw_body or ""
            _log(f"[ai-analysis] Parsing mislukt, ruwe AI-response: {raw_response}")
            payload = _empty_payload(
                "Geen geldige AI-respons ontvangen; de beschikking is niet geanalyseerd.",
                raw_response,
            )
            if raw_response:
                payload["error_detail"] = raw_response
        else:
            payload = _normalize_analysis_payload(parsed, ai_response)

        _log(f"[ai-analysis] JSON response:\n{json.dumps(payload, ensure_ascii=False)}")
        _log("[ai-analysis] JSON response teruggestuurd")
        return JsonResponse(payload)

    except Exception as exc:
        logger.exception("AI analyse failed")
        return JsonResponse({"error": str(exc)}, status=500)

