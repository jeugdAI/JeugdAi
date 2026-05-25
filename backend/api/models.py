from django.db import models

class Behandeling(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'behandelingen'
        verbose_name = 'Behandeling'
        verbose_name_plural = 'Behandelingen'

    def __str__(self):
        return self.name


class Zorgaanbieder(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, blank=True, null=True)
    
    phone_number_1 = models.BigIntegerField(blank=True, null=True)
    phone_number_2 = models.BigIntegerField(blank=True, null=True)
    phone_number_3 = models.BigIntegerField(blank=True, null=True)
    
    postcode = models.CharField(max_length=20)
    city = models.CharField(max_length=100)

    # hier zetten we de connectie van zorgaanbieders naar behandelingen, een zorgaanbieder kan meerdere behandelingen aanbieden, 
    # en een behandeling kan door meerdere zorgaanbieders worden aangeboden. Daarom gebruiken we een ManyToManyField.
    # blank=True means a provider doesn't *have* to have any Behandeling.
    behandelingen = models.ManyToManyField(
        Behandeling, 
        blank=True,
        db_table='zorgaanbieder_behandelingen' # Custom clean name for the join table
    )

    class Meta:
        db_table = 'zorgaanbieders'
        verbose_name = 'Zorgaanbieder'
        verbose_name_plural = 'Zorgaanbieders'

    def __str__(self):
        return self.name