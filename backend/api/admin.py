from django.contrib import admin
from .models import Zorgaanbieder, Problematiek, Product, Opmerking

class OpmerkingInline(admin.TabularInline):
    model = Opmerking
    readonly_fields = ('created_at',)
    extra = 0

@admin.register(Zorgaanbieder)
class ZorgaanbiederAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'email')
    search_fields = ('name', 'city')
    # filter_horizontal = ('problematieken',)
    inlines= [OpmerkingInline]

@admin.register(Problematiek)
class ProblematiekAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

@admin.register(Opmerking)
class OpmerkingAdmin(admin.ModelAdmin):
    list_display = ('provider', 'owner', 'created_at')
    search_fields = ('text', 'owner')