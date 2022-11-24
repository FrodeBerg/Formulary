from django.db import models

# Create your models here.
# Categories

# All physics formulas and variables
class Variable_Phy(models.Model):
    description = models.CharField(blank=True, max_length=100)
    variable = models.CharField(max_length=5)
    def __str__(self):
        return self.variable
class Formula_Phy(models.Model):
    formula = models.CharField(max_length=20)
    result = models.ManyToManyField(Variable_Phy ,related_name="product")
    using = models.ManyToManyField(Variable_Phy ,related_name="requierd")
    def __str__(self):
        return self.formula

# All math formulas and variables
class Variable_Math(models.Model):
    description = models.CharField(max_length=100, blank=True)
    variable = models.CharField(max_length=5)
    def __str__(self):
        return self.variable
class Formula_Math(models.Model):
    formula = models.CharField(max_length=20)
    result = models.ManyToManyField(Variable_Math ,related_name="product")
    using = models.ManyToManyField(Variable_Math, related_name="requierd")
    def __str__(self):
        return self.formula



