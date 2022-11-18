from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Formula_Math)
admin.site.register(Variable_Math)
admin.site.register(Category_Math)

admin.site.register(Formula_Phy)
admin.site.register(Variable_Phy)
admin.site.register(Category_Phy)