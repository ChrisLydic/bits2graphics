"""
imageBuilder URL Configuration
"""
from django.conf.urls import url
from . import views

urlpatterns = [
    url( r'^(\w+)/$', views.viewImage, name='viewImage' ),
    url( r'^(\w+)/report/$', views.reportImage, name='reportImage' ),
]