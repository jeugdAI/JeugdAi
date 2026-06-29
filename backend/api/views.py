from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from .models import Zorgaanbieder, Problematiek, Product, Opmerking 
from .serializers import ZorgaanbiederSerializer, ProblematiekSerializer, ProductSerializer, OpmerkingSerializer


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
            "opmerkingen": "/api/opmerkingen/",
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
# Problematiek komt hier
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

@csrf_exempt
@require_http_methods(["GET", "POST"])
def opmerkingen_list(request):
    if request.method == "GET":
        opmerkingen = Opmerking.objects.all()
        serializer = OpmerkingSerializer(opmerkingen, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            serializer = OpmerkingSerializer(data=data)            
            if serializer.is_valid():
                new_note = serializer.save()                
                return JsonResponse(serializer.data, status=201)
            else:
                return JsonResponse(serializer.errors, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Ongeldige JSON data meegegeven."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
# --------------------------------------------
# ZORGAANBIEDER WAHCRIJ OPMERKING (Voor PATCH/Wachtrij)
# --------------------------------------------
@csrf_exempt
@require_http_methods(["GET", "PATCH"])
def zorgaanbieder_wachtrij_opmerking(request, pk):
    # Probeer eerst de specifieke zorgaanbieder op te halen
    try:
        zorgaanbieder = Zorgaanbieder.objects.get(pk=pk)
    except Zorgaanbieder.DoesNotExist:
        return JsonResponse({"error": "Zorgaanbieder niet gevonden."}, status=404)

    if request.method == "GET":
        serializer = ZorgaanbiederSerializer(zorgaanbieder)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "PATCH":
        try:
            data = json.loads(request.body)
            
            serializer = ZorgaanbiederSerializer(zorgaanbieder, data=data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            else:
                return JsonResponse(serializer.errors, status=400)
                
        except json.JSONDecodeError:
            return JsonResponse({"error": "Ongeldige JSON data meegegeven."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)