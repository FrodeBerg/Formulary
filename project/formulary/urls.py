from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # API routes
    path("math", views.math, name="math"),
    path("physics", views.physics, name="physics")
]