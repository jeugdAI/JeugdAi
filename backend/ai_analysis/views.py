import json
import os

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@csrf_exempt
def analyze_beschikking(request):

    if request.method == "POST":

        try:
            body = json.loads(request.body)

            beschikking_text = body.get("beschikkingText", "")

            proces_document = """
            Hier plak je straks het echte beschikkingsproces document van CJG.
            """

            prompt = f"""
            Jij bent een juridisch controleur voor CJG Capelle.

            Vergelijk onderstaande beschikking met het procesdocument.

            Controleer:
            - ontbrekende onderdelen
            - ontbrekende motivering
            - juridische fouten
            - ontbrekende bezwaarclausule
            - onduidelijke formuleringen

            Geef antwoord ALLEEN in JSON formaat:

            {{
              "results": [
                {{
                  "type": "warning",
                  "message": "..."
                }}
              ]
            }}

            Procesdocument:
            {proces_document}

            Beschikking:
            {beschikking_text}
            """

            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
            )

            ai_response = response.choices[0].message.content

            return JsonResponse(json.loads(ai_response))

        except Exception as e:
            return JsonResponse({
                "error": str(e)
            }, status=500)

    return JsonResponse({
        "error": "Invalid request"
    }, status=400)