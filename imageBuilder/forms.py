from django import forms

"""
Image
"""
class ImageForm( forms.Form ):
    # Textarea is used to avoid character limits on text input enforced by some browsers
    imageData = forms.CharField( label='Image', required=True, widget=forms.Textarea )

"""
Form for reporting inappropriate content
"""
class ReportForm( forms.Form ):
    reportLabels = (
        ( 'spam', 'Spam' ),
        ( 'copyright', 'Copyright Infringement' ),
        ( 'fotomoto', 'Violation of FotoMoto Terms' ),
        ( 'other', 'Other' )
    )
    reportType = forms.ChoiceField( label='What is the image being reported for?', choices=reportLabels, initial='Spam', required=True )