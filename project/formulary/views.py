from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from .models import *

# Create your views here.
from django.http import HttpResponse

# Global variables
categories = None
variables = None
# Index
def index(request):

    return render(request, 'formulary/index.html', {
        "categories" : categories, 
        "variables": variables
    })
    
# Physics
def physics(request):
    global categories
    global variables
    variables = Variable_Phy.objects.all() 

# Math
def math(request):
    global categories
    global variables
    variables = Variable_Math.objects.all() 
