from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Zorgaanbieder, Behandeling, Product
from .serializers import ZorgaanbiederSerializer, BehandelingSerializer, ProductSerializer


# --------------------------------------------
# API ROOT
# --------------------------------------------
def api_root(request):
    return JsonResponse({
        "message": "Zorg Dashboard API",
        "endpoints": {
            "zorgaanbieders": "/api/zorgaanbieders/",
            "behandelingen": "/api/behandelingen/",
            "producten": "/api/producten/",
        },
        "status": "running"
    })


# --------------------------------------------
# ZORGAANBIEDERS + BACKEND FILTEREN
# --------------------------------------------
@csrf_exempt
@require_http_methods(["GET"])
def zorgaanbieders_list(request):

    queryset = Zorgaanbieder.objects.prefetch_related("behandelingen", "producten").all()

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
    # FILTER: Behandeling (M2M)
    # ----------------------------------------
    behandeling = request.GET.get("behandeling")
    if behandeling:
        queryset = queryset.filter(
            behandelingen__name=behandeling
        ).distinct()

    # ----------------------------------------
    # FILTER: Product (M2M)
    # ----------------------------------------
    product = request.GET.get("product")
    if product:
        queryset = queryset.filter(
            producten__name=product
        ).distinct()

    serializer = ZorgaanbiederSerializer(queryset, many=True)

    return JsonResponse(serializer.data, safe=False)


# --------------------------------------------
# Behandelingen komt hier
# --------------------------------------------
@csrf_exempt
@require_http_methods(["GET"])
def behandelingen_list(request):

    behandelingen = Behandeling.objects.all()
    serializer = BehandelingSerializer(behandelingen, many=True)

    return JsonResponse(serializer.data, safe=False)


# --------------------------------------------
# Producten komt hier
# --------------------------------------------
@csrf_exempt
@require_http_methods(["GET"])
def producten_list(request):

    producten = Product.objects.all()
    serializer = ProductSerializer(producten, many=True)

    return JsonResponse(serializer.data, safe=False)