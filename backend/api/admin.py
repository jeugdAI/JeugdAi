from django.contrib import admin
from .models import Zorgaanbieder, Problematiek, Product

@admin.register(Zorgaanbieder)
class ZorgaanbiederAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'email')
    search_fields = ('name', 'city')
    filter_horizontal = ('problematieken',)

@admin.register(Problematiek)
class ProblematiekAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')