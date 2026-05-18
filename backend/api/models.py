from django.db import models

class Specialisatie(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'specialisaties'
        verbose_name = 'Specialisatie'
        verbose_name_plural = 'Specialisaties'

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

    # THIS CONNECTS THEM:
    # We place it here so you can select specializations when editing a provider.
    # blank=True means a provider doesn't *have* to have any specializations.
    specialisaties = models.ManyToManyField(
        Specialisatie, 
        blank=True,
        db_table='zorgaanbieder_specialisaties' # Custom clean name for the join table
    )

    class Meta:
        db_table = 'zorgaanbieders'
        verbose_name = 'Zorgaanbieder'
        verbose_name_plural = 'Zorgaanbieders'

    def __str__(self):
        return self.name