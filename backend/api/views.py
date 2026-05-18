from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Zorgaanbieder, Specialisatie
from .serializers import ZorgaanbiederSerializer, SpecialisatieSerializer


# --------------------------------------------
# API ROOT
# --------------------------------------------
def api_root(request):
    return JsonResponse({
        "message": "Zorg Dashboard API",
        "endpoints": {
            "zorgaanbieders": "/api/zorgaanbieders/",
            "specialisaties": "/api/specialisaties/",
        },
        "status": "running"
    })


# --------------------------------------------
# ZORGAANBIEDERS + BACKEND FILTEREN
# --------------------------------------------
@csrf_exempt
@require_http_methods(["GET"])
def zorgaanbieders_list(request):

    queryset = Zorgaanbieder.objects.prefetch_related("specialisaties").all()

    # ----------------------------------------
    # FILTER: stad
    # ----------------------------------------
    stad = request.GET.get("stad")
    if stad:
        queryset = queryset.filter(city=stad)

    # ----------------------------------------
    # FILTER: search (naam)
    # ----------------------------------------
    search = request.GET.get("search")
    if search:
        queryset = queryset.filter(name__icontains=search)

    # ----------------------------------------
    # FILTER: specialisatie (M2M)
    # ----------------------------------------
    specialisatie = request.GET.get("specialisatie")
    if specialisatie:
        queryset = queryset.filter(
            specialisaties__name=specialisatie
        ).distinct()

    serializer = ZorgaanbiederSerializer(queryset, many=True)

    return JsonResponse(serializer.data, safe=False)


# --------------------------------------------
# Specialaisatie komt hier
# --------------------------------------------
@csrf_exempt
@require_http_methods(["GET"])
def specialisaties_list(request):

    specialisaties = Specialisatie.objects.all()
    serializer = SpecialisatieSerializer(specialisaties, many=True)

    return JsonResponse(serializer.data, safe=False)