import json
from unittest.mock import patch

from django.test import RequestFactory, TestCase

from .views import (
    _build_prompt,
    _extract_control_points,
    _normalize_analysis_payload,
    _read_process_document,
    analyze_beschikking,
)


class PromptBuilderTests(TestCase):
    def test_prompt_includes_full_process_document_and_explicit_missing_item_instruction(self):
        proces_document = _read_process_document()
        control_points = _extract_control_points(proces_document)
        prompt = _build_prompt(
            "Beschikking met ontbrekende onderdelen.",
            proces_document,
            control_points,
        )

        self.assertIn("Procesdocument:", prompt)
        self.assertIn("# Procesdocument Beschikkingen CJG", prompt)
        self.assertIn("Geef voor elk controlepunt alle ontbrekende onderdelen expliciet", prompt)
        self.assertIn("Noem geen algemene opmerkingen", prompt)


class AnalysisNormalizationTests(TestCase):
    def test_normalize_analysis_payload_replaces_unknown_status_with_default(self):
        payload = _normalize_analysis_payload(
            {
                "results": [{"type": "unknown", "title": "Aanleiding", "status": "Onbekend", "advies": "Controleer"}],
                "summary": {"score": 40, "conclusion": "Nog niet compleet"},
            },
            "raw",
        )

        self.assertEqual(payload["results"][0]["type"], "warning")
        self.assertEqual(payload["results"][0]["status"], "Ontbreekt")
        self.assertEqual(payload["summary"]["conclusion"], "Nog niet compleet")

    def test_analyze_beschikking_returns_validation_error_for_empty_text(self):
        request = RequestFactory().post(
            "/api/analyze/",
            data=json.dumps({"beschikkingText": "   "}),
            content_type="application/json",
        )

        response = analyze_beschikking(request)

        self.assertEqual(response.status_code, 400)
        body = json.loads(response.content)
        self.assertIn("Vul de inhoud", body["error"])

    @patch("ai_analysis.views._call_ollama")
    def test_analyze_beschikking_returns_normalized_payload_for_valid_ai_response(self, mock_call):
        mock_call.return_value = (
            "ok",
            '{"results": [{"type": "success", "title": "Aanleiding", "status": "Aanwezig", "advies": "Goede opname"}], "summary": {"score": 80, "conclusion": "Goede beschikking"}}',
        )
        request = RequestFactory().post(
            "/api/analyze/",
            data=json.dumps({"beschikkingText": "Beschikking met voldoende informatie"}),
            content_type="application/json",
        )

        response = analyze_beschikking(request)

        self.assertEqual(response.status_code, 200)
        body = json.loads(response.content)
        self.assertEqual(body["results"][0]["title"], "Aanleiding")
        self.assertEqual(body["summary"]["score"], 80)

    @patch("ai_analysis.views._call_ollama")
    def test_analyze_beschikking_handles_malformed_ai_response(self, mock_call):
        mock_call.return_value = ("bad", "not-json")
        request = RequestFactory().post(
            "/api/analyze/",
            data=json.dumps({"beschikkingText": "Beschikking met onvoldoende informatie"}),
            content_type="application/json",
        )

        response = analyze_beschikking(request)

        self.assertEqual(response.status_code, 200)
        body = json.loads(response.content)
        self.assertEqual(body["summary"]["conclusion"], "Geen geldige AI-respons ontvangen; de beschikking is niet geanalyseerd.")
