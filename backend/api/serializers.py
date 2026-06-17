from rest_framework import serializers
from .models import Zorgaanbieder, Problematiek, Product

class ProblematiekSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problematiek
        fields = ["id", "name"]

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "code"]

class ZorgaanbiederSerializer(serializers.ModelSerializer):
    problematieken = ProblematiekSerializer(many=True, read_only=True)
    producten = ProductSerializer(many=True, read_only=True)
    class Meta:
        model = Zorgaanbieder
        fields = [
            "id",
            "name",
            "address",
            "email",
            "phone_number_1",
            "phone_number_2",
            "phone_number_3",
            "postcode",
            "city",
            "problematieken",
            "producten",
            "regio_indeling"
        ]