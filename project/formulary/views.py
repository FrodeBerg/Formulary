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
    # Get get requests
    result = request.GET.getlist("r", "")
    using = request.GET.getlist("u", "")
    variable_res = Variable.objects.filter(variable__in=result[0].split())
    variable_use = Variable.objects.filter(variable__in=using[0].split())
    # Get Formulas connected to variable
    previous_res = Formula.objects.none()
    for var in variable_res:
        previous_res = previous_res | var.products.all()
    previous_use = Formula.objects.none()
    for var in variable_use:
        previous_use = previous_use | var.uses.all()
    # If empty use all values
    if not previous_use.exists():
        previous_use = Formula.objects.all()
    if not previous_res.exists():
        previous_res = Formula.objects.all()
    formulas = previous_res & previous_use


    math = True
    if name != "math":
        math = False
    formulas = formulas.filter(math=math)

    return JsonResponse([formula.serialize() for formula in formulas], safe=False)
