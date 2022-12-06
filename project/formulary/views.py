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


    # Goes through every path until it finds result 
    def findResult(variables, formula_list):
        if not formula_list:
            formula_list = [] 
        for formula in Formula.objects.all():
            formula_using = [variable.variable for variable in formula.using.all()]
            formula_result = [variable.variable for variable in formula.product.all()]
            if formula_using == None or formula_result == None:
                continue         
            # Check if formula can be made  
            if all(varaible in variables for varaible in formula_using):
                # Check if formula is necessary
                tmpVariables = []
                necessary = False
                for variable in formula_result:
                    if not variable in variables:
                        tmpVariables.append(variable) 
                        necessary = True
                if not necessary:
                    continue
                # If end result is met
                if all(res in formula_result for res in result):
                    if len(formula_list) < 1:
                        return None
                    # If previous formula is usefull                        
                    usefull = True
                    previous = formula_using
                    for form in formula_list[-1::-1]:
                        if not "".join([variable.variable for variable in form.product.all()]) in previous:
                            usefull = False
                            break
                        previous = [variable.variable for variable in form.using.all()]
                    if usefull:                                           
                        formula_list.append(formula)
                        # Formulas requierd
                        combinedFormula["formulas"].append([form.serialize() for form in formula_list[::-1]])
                        # Combined formula
                        combinedFormula["isCombined"] = True
                        combined = None 
                        for form in formula_list[::-1]:
                            form = form.formula                              
                            if not combined:
                                combined = form
                                continue 
                            combined = combined.replace(" " + form[2:form.find("=")].replace(" ", "") + " ", "(" + form[form.find("=") + 1:-2] + ")")
                        combinedFormula["combinedFormula"].append(combined)

                    continue

                # Recursive function
                findResult(variables + tmpVariables, formula_list + [formula])
        return None


    formulas = previous_result & previous_using

    math = True
    if name != "math":
        math = False
    formulas = formulas.filter(math=math) 

    combinedFormula = { 
        "isCombined": False,
        "combinedFormula": [],
        "formulas": [formula.serialize() for formula in formulas]                    
    }      
    # Try and create combined formulas    
    if not formulas.exists():
        findResult(using, None)

    return JsonResponse(combinedFormula, safe=False)
