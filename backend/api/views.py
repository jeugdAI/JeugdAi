from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Zorgaanbieder, Problematiek, Product
from .serializers import ZorgaanbiederSerializer, ProblematiekSerializer, ProductSerializer


# --------------------------------------------
# API ROOT
# --------------------------------------------
def api_root(request):
    return JsonResponse({
        "message": "Zorg Dashboard API",
        "endpoints": {
            "zorgaanbieders": "/api/zorgaanbieders/",
            "problematieken": "/api/problematieken/",
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

    queryset = Zorgaanbieder.objects.prefetch_related("problematieken", "producten").all()

    # ----------------------------------------
    # FILTER: stad
    # ----------------------------------------
    stad = request.GET.get("stad")
    if stad:
        queryset = queryset.filter(city=stad)

    # ----------------------------------------
    # FILTER: regio
    # ----------------------------------------
    regio = request.GET.getlist("regio_indeling")
    if regio:
        queryset = queryset.filter(regio_indeling__in=regio)

    # ----------------------------------------
    # FILTER: search (naam)
    # ----------------------------------------
    search = request.GET.get("search")
    if search:
        queryset = queryset.filter(name__icontains=search)

    # ----------------------------------------
    # FILTER: Problematiek (M2M)
    # ----------------------------------------
    problematiek = request.GET.get("problematiek")
    if problematiek:
        queryset = queryset.filter(
            problematieken__name=problematiek
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
def problematieken_list(request):

    problematieken = Problematiek.objects.all()
    serializer = ProblematiekSerializer(problematieken, many=True)

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