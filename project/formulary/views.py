from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *

# Create your views here.

# Index
def index(request):

    return render(request, 'formulary/index.html')

@csrf_exempt
def formula(request, name):
    math = True
    if name != "math":
        math = False
    formulas = Formula.objects.filter(math=math)
    return JsonResponse([formula.serialize() for formula in formulas], safe=False)
