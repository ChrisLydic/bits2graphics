from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect
from random import randint
from os.path import abspath
from django.core.files.base import ContentFile
from .models import Image
from .forms import ImageForm, ReportForm
# for decoding data uri to image
import re
import base64
dataUrlPattern = re.compile('data:image/(png);base64,(.*)$')


def home( request ):
    form = ImageForm( data=request.POST or None )
    
    if form.is_valid():
        imageData = request.POST.get( 'imageData' )
        print(len(imageData))
        imageData = dataUrlPattern.match( imageData ).group(2)

        if imageData != None and len( imageData ) != 0:
            imageData = base64.urlsafe_b64decode(imageData + '=' * (4 - len(imageData) % 4))
            image = ContentFile( imageData )

            imageId = makeId()

            newImage = Image(
                id=imageId
            )

            newImage.image.save( 'image_' + imageId + '.png', image )
            newImage.save()

            return HttpResponseRedirect( '/image/' + imageId + '/' )

    return render( request, 'imageBuilder/index.html', { 'form': form } )


def terms( request ):
    return render( request, 'imageBuilder/terms.html' )


def reportImage( request, imageId ):
    form = ReportForm( data=request.POST or None )
    
    if form.is_valid():
        reportType = request.POST.get( 'reportType' )

        imageModel = get_object_or_404( Image, id=imageId )
        imageModel.reports += 1

        if imageModel.reportType != '':
            imageModel.reportType += ', '
        
        if len( imageModel.reportType ) + len( reportType ) <= 200:
            imageModel.reportType += reportType

        imageModel.save()
        
        return HttpResponseRedirect( '/image/' + imageId + '/' )

    return render( request, 'imageBuilder/report.html', { 'form': form } )
    

def viewImage( request, imageId ):
    imageModel = get_object_or_404( Image, id=imageId )
    return render( request, 'imageBuilder/image.html', { 'image': imageModel } )


def makeId():
    with open( abspath( 'imageBuilder/pieces.txt' ) ) as file:
        pieces = list()

        for line in file:
            line = line.strip()
            if line == '':
                continue
            else:
                pieces.append( line )

        newId = makeWords( randint( 2, 5 ), pieces )

        while len( newId ) <= 30 and Image.objects.filter( id=newId ):
            newId = makeWords( randint( 2, 10 ), pieces )

    return newId


# generate random ids for images
def makeWords( length, pieces ):
    word = ''
    part = ''

    while length > 0:
        part = pieces[ randint( 0, len( pieces ) - 1 ) ]
        word = word + part
        length -= 1

    return word.lower()