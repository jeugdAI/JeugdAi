from rest_framework import serializers
from .models import Zorgaanbieder, Behandeling, Product

class BehandelingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Behandeling
        fields = ["id", "name"]

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "code"]

class ZorgaanbiederSerializer(serializers.ModelSerializer):
    behandelingen = BehandelingSerializer(many=True, read_only=True)
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
            "behandelingen",
            "producten",
            "notes",
            "notes_owner",
            "notes_created_at",
            "regio_indeling"
        ]