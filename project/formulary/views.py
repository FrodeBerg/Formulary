from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse, HttpResponse
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
    result = request.GET.getlist("r", "")[0].split()
    using = request.GET.getlist("u", "")[0].split()
    variable_result = Variable.objects.filter(variable__in=result)
    variable_using = Variable.objects.filter(variable__in=using)
    # Get Formulas connected to variable
    previous_result = Formula.objects.all()
    for variable in variable_result:
        previous_result = previous_result & variable.products.all()
    previous_using = Formula.objects.all()
    for variable in variable_using:
        previous_using = previous_using & variable.uses.all()

    # Try and create combined formulas
    formulas = previous_result & previous_using
    previous = None
    if not formulas.exists():
        if  not result:
            return HttpResponse("No formulas found!")
        while previous != using:  
            tmpVariables = Variable.objects.filter(variable__in=using)
            tmpFormulas = Formula.objects.none()
            for variable in tmpVariables:
                for formula in variable.uses.all():
                    print([var.variable for var in formula.using.all()])
                    if all(variables in using for variables in [var.variable for var in formula.using.all()]) and not all(variables in using for variables in [var.variable for var in formula.product.all()]):
                        for value in formula.product.all():
                            using.append(value.variable)
                        tmpFormulas = tmpFormulas | Formula.objects.filter(pk=formula.pk)
            print(tmpFormulas)
            print (using)
            if previous == using:
                break
            previous = using 

    math = True
    if name != "math":
        math = False
    formulas = formulas.filter(math=math)

    return JsonResponse([formula.serialize() for formula in formulas], safe=False)
