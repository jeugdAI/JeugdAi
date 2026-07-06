import unittest

try:
    from ollama import chat
except ImportError:  # pragma: no cover - dependency is optional in CI
    chat = None


class OllamaSmokeTests(unittest.TestCase):
    def test_chat_smoke(self):
        if chat is None:
            self.skipTest("ollama package is not installed")

        try:
            response = chat(
                model="mistral:7b",
                messages=[{"role": "user", "content": "Reageer alleen met OK"}],
            )
        except Exception as exc:  # pragma: no cover - environment-dependent
            self.skipTest(f"Ollama service is not available: {exc}")

        self.assertIn("message", response)
