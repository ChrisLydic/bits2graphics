from django.contrib import admin
from .models import Image

class ImageAdmin(admin.ModelAdmin):
    list_display = ( 'id', 'reports', 'reportType', 'dateCreated', )
    readonly_fields = ( 'dateCreated', )

admin.site.register( Image, ImageAdmin )