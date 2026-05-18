from rest_framework import serializers
from .models import Zorgaanbieder, Specialisatie

class SpecialisatieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialisatie
        fields = ["id", "name"]


class ZorgaanbiederSerializer(serializers.ModelSerializer):
    specialisaties = SpecialisatieSerializer(many=True, read_only=True)

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
            "specialisaties",
        ]