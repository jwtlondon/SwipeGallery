require.config({
    paths: {
        'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
        'swipe': 'http://cdnjs.cloudflare.com/ajax/libs/swipe/2.0/swipe.min',
        'swipeGallery': '/src/js/swipeGallery'
    },
    shim: {
        'swipe': {
            exports: 'Swipe'
        }
    }
});
define(['swipeGallery'], function() {
    'use strict';
	
    $('.carousel').SwipeGallery({
        callback:function(index, elem) {
            console.log('slide changeing to '+this);
        },
        transitionEnd:function(index, elem) {
            console.log('slide changed to '+this);
        }

    });
   
});