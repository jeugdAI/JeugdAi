from django.contrib import admin
from .models import Zorgaanbieder, Specialisatie

# This adds a clean, searchable interface for your providers
@admin.register(Zorgaanbieder)
class ZorgaanbiederAdmin(admin.ModelAdmin):
    # This controls which columns show up in the main list view
    list_display = ('name', 'city', 'email')
    
    # This adds a search bar to search providers by name or city
    search_fields = ('name', 'city')
    
    # This makes the Many-to-Many field look like a nice side-by-side selection box
    filter_horizontal = ('specialisaties',)

# This registers the specializations table
@admin.register(Specialisatie)
class SpecialisatieAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)