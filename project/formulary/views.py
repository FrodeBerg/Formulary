from django.shortcuts import render
from .models import *

# Create your views here.
from django.http import HttpResponse


def index(request):
    category_math = Category_Math.objects.all()
    category_phy = Category_Phy.objects.all()

    return render(request, 'formulary/index.html', {
        "maths" : category_math,
        "physics": category_phy
    })