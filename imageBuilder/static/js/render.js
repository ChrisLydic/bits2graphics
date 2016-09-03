//            ctx.font = '300pt Source Code Pro';
//            ctx.fillStyle = 'white';
//            //Horizontal text alignment, can be left, center, or right -- defualts to left
//            ctx.textAlign = 'left';
//            //Vertical text alignment, can be top, hanging, middle, alphabetic, ideographic, or bottom -- defaults to alphabetic
//            ctx.textBaseline = 'hanging';
//            //Write the text on screen, includes x,y position
//            ctx.fillText(chars, 0, 0);

if (window.File && window.FileReader && window.FileList && window.Blob) {
    //do your stuff!
} else {
    alert('The File APIs are not fully supported by your browser.');
}

// Draws an image on a canvas object and returns a data URL
var renderImage = {

    canvas: null,

    ctx: null,

    // Default settings
    settings: {
        font: 'source',
        charHeight: 50,
        charWidth: 34,
        charPad: 10,
        bytePad: 30,
        bytePadVertical: 30,
        canvasPad: 100,
        outlineSize: 0,
        outlineColor: 'black',
        backgroundColor: 'black',
        textColor: 'white',
        canvasHeight: 1000,
        canvasWidth: 1000,
        imageSize: 100,
        imageOpacity: 100,
        imagePosition: 'background',
    },
    
    // Setup, draw, and display the image to the users
    render: function ( data, settings ) {
        this.settings.charHeight = settings.charHeight || this.settings.charHeight;
        this.settings.backgroundColor = settings.backgroundColor || this.settings.backgroundColor;
        this.settings.textColor = settings.textColor || this.settings.textColor;
        this.settings.canvasHeight = settings.canvasHeight || this.settings.canvasHeight;
        this.settings.canvasWidth = settings.canvasWidth || this.settings.canvasWidth;
        this.settings.imageSize = settings.imageSize || this.settings.imageSize;
        this.settings.imageOpacity = settings.imageOpacity || this.settings.imageOpacity;
        this.settings.imagePosition = settings.imagePosition || this.settings.imagePosition;
        this.settings.canvasPad = settings.canvasPad || this.settings.canvasPad;
        
        this.setup();
        this.findProperSizes();
        
        if ( settings.imagePosition === 'background' ) {
            if ( settings.imageLoad ) {
                this.drawImage( gImage );
            } else if ( settings.image ) {
                this.drawImage( settings.image );
            }
        }
        
        // If dataLoad is true, use global data
        if ( settings.dataLoad ) {
            this.drawData( gBits );
        } else {
            this.drawData( data );
        }
        
        if ( settings.imagePosition === 'foreground' ) {
            if ( settings.imageLoad ) {
                this.drawImage( gImage );
            } else if ( settings.image ) {
                this.drawImage( settings.image );
            }
        }
        
        return this.canvas.toDataURL( 'image/png' );
    },
    
    // Create canvas and set colors
    setup: function () {
        this.canvas = document.createElement( 'canvas' );
        this.canvas.width = this.settings.canvasWidth;
        this.canvas.height = this.settings.canvasHeight;
        this.ctx = this.canvas.getContext( '2d' );
        this.ctx.lineWidth = this.settings.outlineSize;
        this.ctx.strokeStyle = this.settings.outlineColor;
        this.ctx.fillStyle = this.settings.backgroundColor;
        this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
        this.ctx.fillStyle = this.settings.textColor;
    },
    
    // Change character height and vertical padding so text fits correctly
    findProperSizes: function () {
        var charHeight = this.settings.charHeight;
        var width = ( this.canvas.width - ( this.settings.canvasPad * 2 ) );
        var byteWidth = Math.round( charHeight * 6.76 );
        var bytePad = Math.round( charHeight * 0.8 );
        var numBytes = 0;
        var numBytesVertical = 0;

        for ( var count = width; count > 0; ) {
            count -= byteWidth;
            if ( count > 0 ) {
                count -= bytePad;
                numBytes++;
            }
        }

        this.settings.charHeight = ( width / ( ( 6.76 * numBytes ) +
            ( 0.8 * ( numBytes - 1 ) ) ) );
        this.settings.charWidth = ( this.settings.charHeight * 0.67 );
        this.settings.charPad = ( this.settings.charHeight * 0.2 );
        this.settings.bytePad = ( this.settings.charPad * 4 );

        var height = ( this.canvas.height - ( this.settings.canvasPad * 2 ) );
        for ( var count = height; count > 0; ) {
            count -= this.settings.charHeight;
            if ( count > 0 ) {
                count -= this.settings.bytePad;
                numBytesVertical++;
            }
        }
        
        this.settings.bytePadVertical = (
            ( height - ( numBytesVertical * this.settings.charHeight ) ) /
            ( numBytesVertical - 1 ) );
    },
    
    // Draws an array of bytes
    drawData: function ( data ) {
        var x = this.settings.canvasPad;
        var y = this.settings.canvasPad;
        var byteWidth = ( ( this.settings.charWidth * 8 ) + ( this.settings.charPad * 7 ) );
        var yEnd = this.canvas.height - this.settings.canvasPad - ( this.settings.charHeight * 0.9 );
        var xEnd = this.canvas.width - this.settings.canvasPad - ( byteWidth * 0.9 );
        
        for ( var i = 0; i < data.length; i++ ) {
            switch( this.settings.font ) {
                case 'source':
                    this.drawByteSource( data[i], x, y );
                    break;
                default:
                    this.drawByteSource( data[i], x, y );
            }

            x += this.settings.bytePad;
            x += byteWidth;

            if ( x > xEnd ) {
                x = this.settings.canvasPad;
                y += this.settings.charHeight + this.settings.bytePadVertical;
            }

            if ( y > yEnd ) {
                break;
            }
        }
    },
    
    // Draws a single byte with Source Sans Pro style font
    drawByteSource: function ( byteString, x, y ) {
        for ( var i = 0; i < byteString.length; i++ ) {
            if ( byteString.charAt(i) === "1" ) {
                this.drawOne( x, y );
            } else {
                this.drawZero( x, y );
            }
            x += this.settings.charWidth + this.settings.charPad;
        }
    },
    
    drawOne: function ( x, y ) {
        var height = this.settings.charHeight;

        this.ctx.moveTo(x + (height * 0.3), y);
        this.ctx.beginPath();

        this.ctx.bezierCurveTo(x + (height * 0.3), y, x + (height * 0.22), y + (height * 0.05), x + (height * 0.06), y + (height * 0.07));

        this.ctx.lineTo(x + (height * 0.06), y + (height * 0.16));

        this.ctx.lineTo(x + (height * 0.28), y + (height * 0.16));

        this.ctx.lineTo(x + (height * 0.28), y + (height * 0.89));

        this.ctx.lineTo(x, y + (height * 0.89));

        this.ctx.lineTo(x, y + height);

        this.ctx.lineTo(x + (height * 0.67), y + height);

        this.ctx.lineTo(x + (height * 0.67), y + (height * 0.89));

        this.ctx.lineTo(x + (height * 0.41), y + (height * 0.89));

        this.ctx.lineTo(x + (height * 0.41), y);

        this.ctx.closePath();
        
        if ( this.settings.outlineSize > 0 ) {
            this.ctx.stroke();
        }
        
        this.ctx.fill();
    },

    drawZero: function ( x, y ) {
        var drawEdge = function () {
            renderImage.ctx.moveTo( x, (height * 0.5) + y );
            renderImage.ctx.bezierCurveTo( x, (height * 0.16) + y, (width * 0.2) + x, y, (width * 0.5) + x, y );

            renderImage.ctx.lineTo( (width * 0.5) + x, (height * 0.1) + y );
            renderImage.ctx.bezierCurveTo( (width * 0.3) + x, (height * 0.1) + y, (height * 0.11) + x, (height * 0.2) + y, (height * 0.11) + x, (height * 0.5) + y );
        }

        var drawInnerEdge = function () {
            renderImage.ctx.moveTo( (width * 0.5) + x, ((height * 0.5) - cHeight) + y );
            renderImage.ctx.bezierCurveTo( ((width * 0.5) + (cWidth * 0.5)) + x, ((height * 0.5) - cHeight) + y, ((width * 0.5) + cWidth) + x, ((height * 0.5) - (cHeight * 0.65)) + y, ((width * 0.5) + cWidth) + x, (height * 0.5) + y );
        }

        var height = this.settings.charHeight;
        var width = height * 0.67;

        this.ctx.moveTo(x + (height * 0.5), y);

        this.ctx.beginPath();


        drawEdge();

        this.ctx.save();

        this.ctx.translate( (width + (2 * x)) * 0.5, (height + (2 * y)) * 0.5 );
        this.ctx.rotate(Math.PI);
        this.ctx.translate( -(width + (2 * x)) * 0.5, -(height + (2 * y)) * 0.5 );

        drawEdge();

        this.ctx.restore();
        this.ctx.save();

        this.ctx.translate(width+(2*x), 0);
        this.ctx.scale(-1, 1);

        drawEdge();

        this.ctx.restore();
        this.ctx.save();

        this.ctx.translate( (width + x) * 0.5, (height + (2 * y)) * 0.5 );
        this.ctx.rotate(Math.PI);
        this.ctx.translate( -(width + x) * 0.5, -(height + (2 * y)) * 0.5 );
        this.ctx.translate(width+x, 0);
        this.ctx.scale(-1, 1);

        drawEdge();

        this.ctx.restore();

        //draw inner circle
        var cWidth = ( 0.17 * height ) * 0.5;
        var cHeight = ( 0.2 * height ) * 0.5;

        drawInnerEdge();

        this.ctx.save();

        this.ctx.translate( (width + (2 * x)) * 0.5, (height + (2 * y)) * 0.5 );
        this.ctx.rotate(Math.PI);
        this.ctx.translate( -(width + (2 * x)) * 0.5, -(height + (2 * y)) * 0.5 );

        drawInnerEdge();

        this.ctx.restore();
        this.ctx.save();

        this.ctx.translate(width+(2*x), 0);
        this.ctx.scale(-1, 1);

        drawInnerEdge();

        this.ctx.restore();
        this.ctx.save();

        this.ctx.translate( (width + x) * 0.5, (height + (2 * y)) * 0.5 );
        this.ctx.rotate(Math.PI);
        this.ctx.translate( -(width + x) * 0.5, -(height + (2 * y)) * 0.5 );
        this.ctx.translate(width+x, 0);
        this.ctx.scale(-1, 1);

        drawInnerEdge();

        this.ctx.restore();

        // fill inside of the circle
        this.ctx.lineTo( (width * 0.5) + x, ((height * 0.5) - cHeight) + y );
        this.ctx.lineTo( ((width * 0.5) - cWidth ) + x, (height * 0.5) + y );

        this.ctx.closePath();
        
        if ( this.settings.outlineSize > 0 ) {
            this.ctx.stroke();
        }
        
        this.ctx.fill();
    },
    
    drawImage: function ( image ) {
        var scale = this.canvas.height * ( this.settings.imageSize/100 );
        var scaledImage = loadImage.scale(
            image,
            {maxHeight: scale}
        );
        
        var x = ( this.canvas.width / 2 ) - ( scaledImage.width / 2 );
        var y = ( this.canvas.height / 2 ) - ( scaledImage.height / 2 );
        
        this.ctx.save();
        this.ctx.globalAlpha = ( this.settings.imageOpacity / 100 );
        this.ctx.drawImage( scaledImage, x, y );
        this.ctx.restore();
    }
}

// Show image returned by RenderImage.render
var showImage = function ( image ) {
    var genImageView = document.getElementById( 'genImageWrapper' );
    var imageView = document.getElementById( 'genImage' );
    var imageData = document.getElementById( 'id_imageData' );

    loadImage(
        image,
        function( imageSmall ) {
            imageView.src = imageSmall.toDataURL( 'image/png' );
        },
        {
            canvas: true,
            maxWidth: 2000,
            pixelRatio: window.devicePixelRatio,
        }
    );

    var head = 'data:image/png;base64,';
    var imgFileSize = Math.round( ( image.length - head.length ) * 3/4 );

    if ( imgFileSize > 60000000 ) {
        document.getElementById( 'viewImage' ).style.display = 'none';
        document.getElementById( 'downloadImage' ).style.display = 'block';
        document.getElementById( 'downloadImage' ).href = image;
    } else {
        document.getElementById( 'viewImage' ).style.display = 'block';
        document.getElementById( 'downloadImage' ).style.display = 'none';
    }

    imageData.value = image;
    genImageView.style.display = 'table';
}

// Initialize and display settings to user
var showSettings = function () {
    document.getElementById( 'charHeight' ).value = '36';
    document.getElementById( 'fontSizeDisplay' ).innerHTML = '36';

    document.getElementById( 'canvasPad' ).value = '72';
    document.getElementById( 'canvasPadDisplay' ).innerHTML = '72';
    
    document.getElementById( 'textColor' ).value = '#FFFFFF';
    document.getElementById( 'textColorView' )
        .style.backgroundColor = '#FFFFFF';
    
    document.getElementById( 'backgroundColor' ).value = '#000000';
    document.getElementById( 'backgroundColorView' )
        .style.backgroundColor = '#000000';
    
    document.getElementById( 'canvasSize' ).value = '1:1S';
    document.getElementById( 'canvasOrientation' ).value = 'landscape';
    // document.getElementById( 'font' ).value = 'source';

    // hide image options and show image button because image is reset
    document.getElementById( 'imageFileWrapper' ).style.display = 'block';
    document.getElementById( 'imageSettings' ).style.display = 'none';
    
    document.getElementById( 'settingsWrapper' ).style.display = 'flex';
    document.getElementById( 'updateSettings' ).style.display = 'inline-block';
};

// Happens when a user switches data source type (file upload, file url, etc.)
var hideSettings = function () {
    // hide image options because image is reset
    document.getElementById( 'imageSettings' ).style.display = 'none';
    
    document.getElementById( 'settingsWrapper' ).style.display = 'none';
    document.getElementById( 'updateSettings' ).style.display = 'none';
    
    document.getElementById( 'genImage' ).src = '';
    document.getElementById( 'genImageWrapper' ).style.display = 'none';
};

// Hiding is done in hideSettings
var showImageSettings = function () {
    document.getElementById( 'imageSize' ).value = '100';
    document.getElementById( 'imageSizeDisplay' ).innerHTML = '100';
    
    document.getElementById( 'imageOpacity' ).value = '100';
    document.getElementById( 'imageOpacityDisplay' ).innerHTML = '100';
    
    document.getElementById( 'imagePosition' ).value = 'background';
    
    document.getElementById( 'imageSettings' ).style.display = 'flex';
};

var settingsUpdate = function () {
    var settings = getSettings();
    
    settings.dataLoad = true;
    
    if ( gImage ) {
        settings.imageLoad = true;
    }
    
    showImage( renderImage.render( '', settings ) );
};

var getSettings = function () {
    var settings = {};
    
    if ( document.getElementById( 'font' ) ) {
        settings.font = document.getElementById( 'font' ).value;
    }
    
    if ( document.getElementById( 'charHeight' ) ) {
        settings.charHeight = document.getElementById( 'charHeight' ).value;
    }

    if ( document.getElementById( 'canvasPad' ) ) {
        settings.canvasPad = parseInt( document.getElementById( 'canvasPad' ).value );
    }
    
    if ( document.getElementById( 'textColor' ) ) {
        settings.textColor = document.getElementById( 'textColor' ).value;
        
        if ( settings.textColor.charAt(0) !== '#' ) {
            settings.textColor = '#' + settings.textColor;
        }
        
        var textLength = settings.textColor.length;
        if ( !( textLength === 4 || textLength === 7 ) ) {
            alert( 'Invalid text color, please use format #FFF or #FFFFFF.' );
            settings.textColor = '#FFF';
        }
    }
    
    if ( document.getElementById( 'backgroundColor' ) ) {
        settings.backgroundColor = document
            .getElementById( 'backgroundColor' ).value;
        
        if ( settings.backgroundColor.charAt(0) !== '#' ) {
            settings.backgroundColor = '#' + settings.backgroundColor;
        }
        
        var backgroundLength = settings.backgroundColor.length;
        if ( !( backgroundLength === 4 || backgroundLength === 7 ) ) {
            alert( 'Invalid background color, please use format ' +
                  '#FFF or #FFFFFF.' );
            settings.backgroundColor = '#000';
        }
    }
    
    if ( document.getElementById( 'canvasSize' ) ) {
        switch ( document.getElementById( 'canvasSize' ).value ) {
            case '1:1S':
                settings.canvasHeight = 2400;
                settings.canvasWidth = 2400;
                break;
            case '1:1L':
                settings.canvasHeight = 4800;
                settings.canvasWidth = 4800;
                break;
            case '5:4S':
                settings.canvasHeight = 2400;
                settings.canvasWidth = 3000;
                break;
            case '5:4L':
                settings.canvasHeight = 4800;
                settings.canvasWidth = 6000;
                break; 
            case '3:2S':
                settings.canvasHeight = 2400;
                settings.canvasWidth = 3600;
                break;
            case '3:2L':
                settings.canvasHeight = 4000;
                settings.canvasWidth = 6000;
                break;
            case '2:1S':
                settings.canvasHeight = 1500;
                settings.canvasWidth = 3000;
                break;
            case '2:1L':
                settings.canvasHeight = 3000;
                settings.canvasWidth = 6000;
                break;
        }

        if ( document.getElementById( 'canvasOrientation' ) ) {
            if ( document.getElementById( 'canvasOrientation' )
                    .value === 'portrait' ) {
                var tempHeight = settings.canvasHeight;
                settings.canvasHeight = settings.canvasWidth;
                settings.canvasWidth = tempHeight;
            }
        }
    }

    // Image settings, only used if the image exists
    if ( document.getElementById( 'imageSize' ) ) {
        settings.imageSize = document.getElementById( 'imageSize' ).value;
    }
    
    if ( document.getElementById( 'imageOpacity' ) ) {
        settings.imageOpacity = document.getElementById( 'imageOpacity' ).value;
    }
    
    if ( document.getElementById( 'imagePosition' ) ) {
        settings.imagePosition = document.getElementById( 'imagePosition' ).value;
    }
    
    return settings;
}

// Takes an array of 8-bit unsigned integers and returns an array of bytes
var toBitView = function ( Uint8View ) {
    bitStrings = [];

    for ( var i = 0; i < Uint8View.length; i++ ) {
        bitStrings.push( decToBin( Uint8View[i] ) );
    }

    return bitStrings;
};

// Binary base conversion algorithm that returns a string representation of a byte
var decToBin = function ( number ) {
    var bitString = '';

    while ( number > 0 ) {
        bitString = ( number % 2 ) + bitString;
        number = Math.floor( number / 2 );
    }

    if ( bitString.length < 8 ) {
        for ( var i = bitString.length; i < 8; i++ ) {
            bitString = '0' + bitString;
        }
    } else if ( bitString.length > 8 ) {
        throw Error( 'number exceeds unsigned 8-bit int size' );
    }

    return bitString;
};

// Gets a file as an array of strings that represent bytes
var readFile = function ( event ) {
    //Retrieve the first (and only!) File from the FileList object
    var file = event.target.files[0]; 

    if ( event ) {
        resetRender();
        
        var reader = new FileReader();

        reader.onload = function( evt ) { 
            var contents = evt.target.result;
            var bits = toBitView( new Uint8Array(contents) );
            
            // Store data as global value to use when
            // re-rendering after users change settings
            gBits = bits;
            
            showSettings();
            showImage( renderImage.render( bits, getSettings() ) );
        }

        reader.readAsArrayBuffer(file);

    } else { 
        alert('Failed to load file');
    }
};

// var readUrl = function () {
//     resetRender();
    
//     // Store data as global value to use when
//     // re-rendering after users change settings
//     gBits = bits;

//     showSettings();
//     showImage( renderImage.render( bits, getSettings() ) );
// };

var readAscii = function () {
    resetRender();
    
    // Used to fix problem with String.length caused by astral symbols
    // https://mathiasbynens.be/notes/javascript-unicode#accounting-for-astral-symbols
    var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    
    var textString = document.getElementById( 'asciiData' ).value
            .replace(regexAstralSymbols, '�');
    var uintBits = [];
    
    // Returns an array of character codes for a string of text
    for ( var i = 0; i < textString.length; i++ ) {
        var charCode = textString.charCodeAt(i);
        
        if ( charCode > 127 ) {
            alert( 'Non-ascii character: ' + textString.charAt(i) );
        } else {
            uintBits.push( charCode );
        }
    }
    
    var bits = toBitView( uintBits )
    
    // Store data as global value to use when
    // re-rendering after users change settings
    gBits = bits;
    
    showSettings();
    showImage( renderImage.render( bits, getSettings() ) );
};

var readBinary = function () {
    resetRender();
    
    var textString = document.getElementById( 'binaryData' ).value;
    var bits = [];
    var byteString = '';
    var byteIncrement = 0;
    
    // Returns an array of character codes for a string of text
    for ( var i = 0; i < textString.length; i++ ) {
        var charBit = textString.charAt(i)
        
        if ( charBit !== '0' && charBit !== '1' ) {
            continue;
        }
        
        byteString += charBit;
        byteIncrement++;
        
        if ( byteIncrement % 8 === 0 ) {
            bits.push( byteString );
            byteString = '';
        }
    }
    
    // Store data as global value to use when
    // re-rendering after users change settings
    gBits = bits;
    
    showSettings();
    showImage( renderImage.render( bits, getSettings() ) );
};

// Gets a file as an array of strings that represent bytes
var readImage = function ( event ) {
    //Retrieve the first (and only!) File from the FileList object
    var file = event.target.files[0];

    if ( event ) {
        var reader = new FileReader();

        reader.onload = function( evt ) { 
            var contents = evt.target.result;
            
            loadImage(
                contents,
                function( image ) {
                    showImageSettings();
                    var settings = getSettings();
                    settings.dataLoad = true;
                    
                    settings.image = image;
                    gImage = settings.image;
                    
                    showImage( renderImage.render( '', settings ) );
                },
                {
                    canvas: true,
                    pixelRatio: window.devicePixelRatio,
                }
            );
        }

        reader.readAsDataURL( file );

    } else { 
        alert('Failed to load image');
    }
};

var resetRender = function () {
    gBits = null;
    gImage = null;

    // hide recaptcha
    document.getElementById( 'imageForm' ).style.display = 'none';

    // Replace the image file upload button with a copy, this is to stop the
    // change event listener from ignoring a file being uploaded twice in a row
    var imageNode = document.getElementById( 'imageFileInput' ).cloneNode(true);
    document.getElementById( 'imageFileInput' ).parentNode
            .removeChild( document.getElementById( 'imageFileInput' ) );
    document.getElementById( 'imageFileCont' ).appendChild( imageNode );
    document.getElementById( 'imageFileInput' ).addEventListener( 'change', readImage );
};

var showFile = function ( tagName ) {
    hideSettings();
    hideInputs();
    document.getElementById( 'fileInput' ).parentNode.style.display = 'inline';
    showSelected( 'uploadFile' );
};

// var showUrl = function ( tagName ) {
//     hideSettings();
//     hideInputs();
//     document.getElementById( 'urlInput' ).parentNode.style.display = 'block';
//     showSelected( 'uploadUrl' );
// };

var showAscii = function ( tagName ) {
    hideSettings();
    hideInputs();
    document.getElementById( 'asciiInput' ).parentNode.style.display = 'block';
    showSelected( 'uploadAscii' );
};

var showBinary = function ( tagName ) {
    hideSettings();
    hideInputs();
    document.getElementById( 'binaryInput' ).parentNode.style.display = 'block';
    showSelected( 'uploadBinary' );
};

var showSelected = function ( tagName ) {
    document.getElementById( 'uploadFile' ).className = '';
//    document.getElementById( 'uploadUrl' ).className = '';
    document.getElementById( 'uploadAscii' ).className = '';
    document.getElementById( 'uploadBinary' ).className = '';
    
    document.getElementById( tagName ).className = 'selected';
};

var hideInputs = function () {
    document.getElementById( 'fileInput' ).parentNode.style.display = 'none';
    document.getElementById( 'urlInput' ).parentNode.style.display = 'none';
    document.getElementById( 'asciiInput' ).parentNode.style.display = 'none';
    document.getElementById( 'binaryInput' ).parentNode.style.display = 'none';
}

// Add functionality to form inputs
var charHeightRange = document.getElementById( 'charHeight' );
charHeightRange.addEventListener( 'input', function () {
    document.getElementById( 'fontSizeDisplay' )
        .innerHTML = charHeightRange.value;
}, false );

var canvasPadRange = document.getElementById( 'canvasPad' );
canvasPadRange.addEventListener( 'input', function () {
    document.getElementById( 'canvasPadDisplay' )
        .innerHTML = canvasPadRange.value;
}, false );

var textColorText = document.getElementById( 'textColor' );
textColorText.addEventListener( 'input', function () {
    document.getElementById( 'textColorView' )
        .style.backgroundColor = textColorText.value;
}, false );

var backgroundColorText = document.getElementById( 'backgroundColor' );
backgroundColorText.addEventListener( 'input', function () {
    document.getElementById( 'backgroundColorView' )
        .style.backgroundColor = backgroundColorText.value;
}, false );

var imageSizeRange = document.getElementById( 'imageSize' );
imageSizeRange.addEventListener( 'input', function () {
    document.getElementById( 'imageSizeDisplay' )
        .innerHTML = imageSizeRange.value;
}, false );

var imageOpacityRange = document.getElementById( 'imageOpacity' );
imageOpacityRange.addEventListener( 'input', function () {
    document.getElementById( 'imageOpacityDisplay' )
        .innerHTML = imageOpacityRange.value;
}, false );

// toggle the recaptcha when the view full image button is clicked
function toggleCaptcha () {
    if ( document.getElementById( 'imageForm' ).style.display === 'none' ) {
        document.getElementById( 'imageForm' ).style.display = 'block';
    } else {
        document.getElementById( 'imageForm' ).style.display = 'none';
    }

    return false;
}

// Buttons for updating settings and uploading image files
document.getElementById( 'updateSettings' )
    .addEventListener( 'click', settingsUpdate );
document.getElementById( 'imageFileInput' )
    .addEventListener( 'change', readImage );

// Buttons for submitting data
document.getElementById( 'fileInput' )
    .addEventListener( 'change', readFile );
// document.getElementById( 'urlInput' )
//     .addEventListener( 'click', readUrl );
document.getElementById( 'asciiInput' )
    .addEventListener( 'click', readAscii );
document.getElementById( 'binaryInput' )
    .addEventListener( 'click', readBinary );

// Buttons for switching between data types
document.getElementById( 'uploadFile' )
    .addEventListener( 'click', showFile );
//document.getElementById( 'uploadUrl' )
//    .addEventListener( 'click', showUrl );
document.getElementById( 'uploadAscii' )
    .addEventListener( 'click', showAscii );
document.getElementById( 'uploadBinary' )
    .addEventListener( 'click', showBinary );