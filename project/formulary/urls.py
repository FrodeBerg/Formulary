from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # Api route
    path('formula/<str:name>/', views.formula, name="formula")
]