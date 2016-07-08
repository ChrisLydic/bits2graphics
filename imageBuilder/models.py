from django.db import models

class Image( models.Model ):
    id = models.CharField( max_length=50, primary_key=True )
    dateCreated = models.DateField( auto_now_add=True )
    image = models.ImageField( upload_to='images/' )