from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect
from .models import Image


def home( request ):
    return render( request, 'index.html' )


def createImage( request ):
    imgId = makeId()

    newImage = Image(
        id=imgId,
        # image=image,
    )
    newImage.save()

    return HttpResponseRedirect( '/img/' + imgId + '/' )


def viewImage( request, imgId ):
    imgPath = get_object_or_404( Image, imgId )
    return render( request, 'image.html', { imgPath: imgPath } )


def makeId():
    with open( 'pieces.txt' ) as file:
        newId = makeWords( 3, file )

        while len( newId ) < 40 and Image.objects.filter( id=newId ):
            newId = makeWords( 3, file )

    return newId


# generate random ids for images
def makeWords( len, file ):
    pieces = set()
    word = ''

    for line in file:
        line = line.strip()
        if line == '':
            continue
        else:
            pieces.add(line)

    while len > 0:
        word = word + pieces.pop()
        len -= 1

    return word.capitalize()