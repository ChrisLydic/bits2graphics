"""
imageBuilder URL Configuration
"""
from django.conf.urls import url
from . import views

urlpatterns = [
    url( r'^new_image/$', views.createImage, name='createImage' ),
    url( r'^(\d+)/$', views.viewImage, name='viewImage' ),
]