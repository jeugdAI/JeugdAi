from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

def api_root(request):
    return JsonResponse({
        'message': 'Document Checker API',
        'endpoints': {
            'check_document': '/api/check-document/'
        },
        'status': 'running'
    })

@csrf_exempt
@require_http_methods(["POST"])
def check_document(request):
    try:
        data = json.loads(request.body)
        # Here you can add actual document validation logic
        # For now, we'll just return success
        return JsonResponse({
            'status': 'success',
            'message': 'document correct'
        })
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
