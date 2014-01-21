require.config({
    paths: {
        'jquery': '/src/js/third_party/jquery/jquery',
        'swipe': '/src/js/third_party/Swipe/swipe',
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
	
    $('.carousel').SwipeGallery();
   
});