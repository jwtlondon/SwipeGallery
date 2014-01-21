

/*
 *---------------------------------------------------------------
 * SwipeGallery - Component 
 * uses Swipe component as core 
 * https://github.com/bradbirdsall/Swipe/
 *---------------------------------------------------------------
 *
 */

(function ( ) {

    function SwipeGalleryDefinition($,Swipe) {

        /**
         * Contructor
         * element - container element
         * opts 
         *   autoplay - auto play carousel (default false)
         *   autoplayDelay - auto play delay (default 5000ms)
         *   controls - show controls (default true)
         *   paginator - show pagination (default true)
         *   swipeOptions  - Swipe options object (see https://github.com/bradbirdsall/Swipe/)
         */
        function SwipeGallery(element, opts) {
            this.init(element, opts);

            return this;
        }
        SwipeGallery.fn = SwipeGallery.prototype;

        // states
        SwipeGallery.IDLE_STATE = 'idle';
        SwipeGallery.AUTOPLAY_STATE = 'autoplay';

        /**
         * SwipeGallery Initialisation
         * 
         */
        SwipeGallery.fn.init = function (el, opts) {
            //Config
            this.element = el;
            this.$e = $(this.element);
            this.container = this.element.children[0];
            this.slides = this.container.children;
            this.timer;
            this.state = SwipeGallery.IDLE_STATE;
            this.options = $.extend({
                paginator    : true,
                autoplay     : false,
                autoplayDelay: 5000,
                controls     : true,
                swipeOptions : {
                    speed: 400,
                    continuous: true,
                    disableScroll: false,
                    stopPropagation: false
                }
            }, opts);

            this.initSwipe();
            this.buildContols();
            this.initControls();


            if (this.options.autoplay === true) {
                this.setTimer();
            }
            //initSwipe();
        };


        /**
         * Create controls html if enabled
         */
        SwipeGallery.fn.buildContols = function() {
            var controlsHTML;
            controlsHTML = '';

            if (this.options.paginator === true) {
                controlsHTML += '<nav class="paging">';
                $(this.slides).each(function (listIndex, listItem) {
                        controlsHTML += '<button class="pager" data-index="' + listIndex + '">' + listIndex + '</button>';
                });
                controlsHTML += '</nav>';
            }

            var controlsBtns = [];

            if (this.options.controls === true) {
                controlsBtns.push('<button class="prev changeSlide carouselControl">Previous</button>');
                controlsBtns.push('<button class="autoplay carouselControl">Play/Pause</button>');
                controlsBtns.push('<button class="next changeSlide carouselControl">Next</button>');
            }

            if (this.options.autoplay === true || this.options.controls === true) {
                controlsHTML += '<nav class="controls">'+controlsBtns.join('')+'</nav>';
            }
            
            this.$e.append(controlsHTML);
        }   

        /**
         * Initalise controls if enabled
         */
        SwipeGallery.fn.initControls = function() {
            var component = this;
            if (this.options.controls === true) {
                this.$e.find('.changeSlide').on('click',function (event) {
                    event.preventDefault();
                    component.nextPrevSlide(event.target);
                    return false;
                });

                this.$e.find('.autoplay').on('click',function (event) {
                    event.preventDefault();
                    if (component.state == SwipeGallery.AUTOPLAY_STATE) {
                        component.clearTimer();
                    } else {
                        component.setTimer();

                    }

                    return false;
                });

            }
            if (this.options.paginator === true) {
                this.pageButtons = this.$e.find('.pager');
                this.pageButtons.on('click',function (event) {
                    event.preventDefault();
                    component.changeSlide(event.target)
                    return false;
                }).eq(0).addClass('active');
            }


        }


        /**
         * Initalise swipe plugin
         */
        SwipeGallery.fn.initSwipe = function() {
            var component = this;
            this.options.swipeOptions.callback = function (index, elem) {
                $(this.slides).removeClass('current').eq(index).addClass('current');

                component.pageButtons.removeClass('active').eq(index).addClass('active');

            };
            this.options.swipeOptions.transitionEnd = function (index, elem) {
            

            };

            this.carousel = Swipe(this.element, this.options.swipeOptions);

            $(this.slides).eq(0).addClass('current');
        }


        /**
         * Change slide next / previous
         */
        SwipeGallery.fn.nextPrevSlide = function(btn) {
            var component = this;
            if (component.state == SwipeGallery.AUTOPLAY_STATE) { 
                component.setTimer();
            }

            if ($(btn).hasClass('next')) {
                this.carousel.next();   
            } else {
                this.carousel.prev();
            }
        }

        /**
         * Change slide by index
         */
        SwipeGallery.fn.changeSlide = function(btn) {
            this.carousel.slide(parseInt($(btn).data('index'), 10), this.options.swipeOptions.speed);
        }

        /**
         * Set autoplay timer
         */
        SwipeGallery.fn.setTimer = function() {
            var component = this;
            clearTimeout(this.timer);
            if (this.options.autoplay === true) {
                this.timer = setTimeout(function() { component.timerCallback() },this.options.autoplayDelay);
                this.state = SwipeGallery.AUTOPLAY_STATE;
                if (!this.$e.find('.autoplay').hasClass('playing')) this.$e.find('.autoplay').addClass('playing')
            }
        }

        /**
         * Clear autoplay timer
         */
        SwipeGallery.fn.clearTimer = function() {
            clearTimeout(this.timer);
            this.$e.find('.autoplay').removeClass('playing');
            this.state = SwipeGallery.IDLE_STATE;
        }
        
        /**
         * Timer called
         */
        SwipeGallery.fn.timerCallback = function() {
             this.carousel.next();
             this.setTimer();
        }

        /**
         * Create as jquery / Zepto plugin
         */
        if ( window.jQuery || window.Zepto ) {
          (function($) {
            $.fn.SwipeGallery = function(opts) {
              return this.each(function() {
                $(this).data('SwipeGallery', new SwipeGallery($(this)[0], opts));
              });
            }
          })( window.jQuery || window.Zepto )
        }


        return SwipeGallery;
    }


    /**
      * Define Component as AMD/REQUIREJS Module
      **/
    if ( typeof define === 'function' && define.amd ) {
      // AMD
      define( [
          'jquery',
          'swipe'
        ],
        SwipeGalleryDefinition );
    } else {
      // browser global
      window.SwipeGallery = SwipeGalleryDefinition(window.$,window.Swipe);
    }

    

})( );