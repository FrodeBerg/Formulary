from django.db import models

# Create your models here.

# Variables
class Variable(models.Model):
    variable = models.CharField(max_length=5)
    description = models.CharField(max_length=50, blank=True)
    def serialize(self):
        return {
            "id": self.id,
            "variable": self.variable,
            "description": self.description
        }
    def __str__(self):
        return self.variable
        
# Categories
class Category(models.Model):
    name = models.CharField(max_length=50)
    tag = models.CharField(max_length=10, blank=True)
    def serialize(self):
        return {
            "name" : self.name
        }
    def __str__(self):
        return self.name

# Formulas
class Formula(models.Model):
    formula = models.CharField(max_length=50)
    using = models.ManyToManyField(Variable, related_name="uses", blank=True)
    product = models.ManyToManyField(Variable, related_name="products", blank=True)
    math = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.CharField(max_length=100, blank=True)
    def serialize(self):
        return {
            "id": self.id,
            "formula": self.formula,
            "using": [variable.variable for variable in self.using.all()],
            "product": [variable.variable for variable in self.product.all()],
            "math": self.math,
            "category": self.category.name,
            "tag": self.category.tag,
            "description": self.description,
        }
    def __str__(self):
        return self.formula

     






