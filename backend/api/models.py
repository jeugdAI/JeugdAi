from django.db import models

class Problematiek(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'problematieken'
        verbose_name = 'Problematiek'
        verbose_name_plural = 'Problematieken'

    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255)

    class Meta:
        db_table = 'producten'
        verbose_name = 'Product'
        verbose_name_plural = 'Producten'

    def __str__(self):
        return f"{self.name} ({self.code})"

class Zorgaanbieder(models.Model):
    REGION_CHOICES = [
        ("lokaal", "Lokaal"),
        ("regionaal", "Regionaal"),
    ]
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, blank=True, null=True)
    
    phone_number_1 = models.CharField(max_length=20, blank=True, null=True)
    phone_number_2 = models.CharField(max_length=20, blank=True, null=True)
    phone_number_3 = models.CharField(max_length=20, blank=True, null=True)
    
    postcode = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    regio_indeling = models.CharField(max_length=20, choices=REGION_CHOICES)
    
    wachtrij_opmerking = models.TextField(blank=True, null=True)
    wachtrij_laatst_aangepast = models.DateField(blank=True, null=True)

    # Hier zetten we de connectie van zorgaanbieders naar problematieken.
    # Een zorgaanbieder kan meerdere problematieken behandelen, en een problematiek kan 
    # door meerdere zorgaanbieders worden behandeld.
    problematieken = models.ManyToManyField(
        Problematiek, 
        blank=True,
        db_table='zorgaanbieder_problematieken' 
    )
    
    # Many-to-many relatie met producten
    producten = models.ManyToManyField(
        Product,
        blank=True,
        db_table='zorgaanbieder_producten'
    )
    
    class Meta:
        db_table = 'zorgaanbieders'
        verbose_name = 'Zorgaanbieder'
        verbose_name_plural = 'Zorgaanbieders'

    def __str__(self):
        return self.name

class Opmerking(models.Model):
    provider = models.ForeignKey(
        Zorgaanbieder, 
        on_delete=models.CASCADE, 
        related_name='notes'
    )
    
    # De velden van de opmerking zelf
    text = models.TextField()
    owner = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True) 

    class Meta:
        db_table = 'opmerkingen' 
        verbose_name = 'Opmerking'
        verbose_name_plural = 'Opmerkingen'

    def __str__(self):
        return f"Note from {self.owner} for {self.provider.name}"