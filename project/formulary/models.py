from django.db import models

# Create your models here.

# Variables
class Variable(models.Model):
    variable = models.CharField(max_length=5)
    description = models.CharField(max_length=50, blank=True)

# Formulas
class Formula(models.Model):
    formula = models.CharField(max_length=20)
    using = models.ManyToManyField(Variable, related_name="using", blank=True)
    product = models.ManyToManyField(Variable, related_name="product", blank=True)
    math = models.BooleanField(default=True)






