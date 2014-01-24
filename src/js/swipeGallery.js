

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

         // states
        var states = {
            IDLE_STATE       : 'idle',
            AUTOPLAY_STATE   : 'autoplay'
        },
        defaultOptions = {
                paginator    : true,
                autoplay     : false,
                autoplayDelay: 5000,
                controls     : true,
                controlsTemplate: '<nav class="controls"><button class="prev carouselControl">Previous</button><button class="autoplay carouselControl">Play/Pause</button><button class="next carouselControl">Next</button></nav>',
                pagerTemplate: '<nav class="paging">{%forloop%}<button class="pager" data-index="{{index}}">{{index}}</button>{%endforloop%}</nav>',
                swipeOptions : {
                    speed           : 400,
                    continuous      : true,
                    disableScroll   : false,
                    stopPropagation : false
                }
            };

          
         var uniqueId = (function() {
            var id = 0;
            return function() {
                return id++;
            };
        })();

        function getQuerystring(url, key, default_) {
            if (default_==null) default_="";
            key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
            var qs = regex.exec(url);
            if(qs == null)
            return default_;
            else
            return qs[1];
        }



        /**
          * debouncedresize
          **/
        function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100)};return c};

        /**
          * Get youtube api
          **/
        function getVimeoApi() {
            
            if (typeof($f) == 'undefined' && window.loadingVimeoAPI==undefined) {
              window.loadingVimeoAPI = true;
              $.getScript('http://a.vimeocdn.com/js/froogaloop2.min.js').done(vimeoApiReady);
            } 

        }

        /**
          * initalise all vimeo players
          **/
        function vimeoApiReady() {
            window.loadingVimeoAPI = undefined;
            $('iframe').each(function(index,element) {
                var iframe, player;

                iframe = $(element);
                if (iframe.attr('data-type')==='vimeo') {
                    
                     $f(element).addEvent('ready', function(player_id) {

                        player = $f(element);
                        iframe.parent().data('player',player);
                     });
                    
                }

            })

        }
        /**
          * Get youtube api
          **/
        function getYoutubeApi() {
            
            if ((typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') && window.loadingYTAPI==undefined) {
             
              window.loadingYTAPI = true;
              window.onYouTubeIframeAPIReady = ytApiReady;
              $.getScript('https://www.youtube.com/iframe_api');

              

            } 

        }

        /**
          * initalise all youtube players
          **/
        function ytApiReady() {
          window.loadingYTAPI = undefined;
           
            $('iframe').each(function(index,element) {
                var iframe, player;

                iframe = $(element);
                if (iframe.attr('data-type')==='youtube') {
                    player = new YT.Player(iframe.attr('id'));
                   
                    iframe.parent().data('player',player);
                }

            })
        }


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

        /**
         * Super basic template function
         *
         */   
         SwipeGallery.fn.t = function(s,d){
           for(var p in d)
             s=s.replace(new RegExp('{{'+p+'}}','g'), d[p]);
           return s;
          }

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
            this.state = states.IDLE_STATE;
            this.options = $.extend({}, defaultOptions, opts || {});

            this.initSwipe();
            this.buildContols();
            this.initControls();
            this.initVideos();
            

            this.initResize();


            if (this.options.autoplay === true) {
                this.setTimer();
            }
            //initSwipe();
        };


        /**
         * Create controls html if enabled
         */
        SwipeGallery.fn.buildContols = function() {
            var component = this;
            var controlsHTML, tmplParts, tmpl;
            controlsHTML = '';

            if (this.options.paginator === true) {
                tmplParts = this.options.pagerTemplate.split('{%forloop%}');
                controlsHTML += tmplParts[0];
                tmplParts = tmplParts[1].split('{%endforloop%}');
                tmpl = tmplParts[0];

                $(this.slides).each(function (listIndex, listItem) {
                        controlsHTML += component.t(tmpl,{index:listIndex});
                });
                controlsHTML += tmplParts[1];
            }

            if (this.options.controls === true) {
                controlsHTML +=this.options.controlsTemplate
            }

            
            this.$e.append(controlsHTML);
        }   





        /**
         * Initalise resizecheck
         */
        SwipeGallery.fn.initResize = function() {
            var component = this;
              
            var videoProxys = $('.video-proxy');

           
            if (videoProxys.length>0) {
              on_resize(function() {
                component.onResize(videoProxys);
                 
                  
              });

              component.onResize(videoProxys)
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
          * Uodate video proxies on resize
          **/
        SwipeGallery.fn.onResize = function(videoProxys) {
            videoProxys.each(function(index, proxy) {
                var container = $(proxy).parent();
                if (container.hasClass('youtube-slide')) {
                  $(proxy).css('height',container.height()-45);
                }
                if (container.hasClass('vimeo-slide')) {
                  $(proxy).css('height',container.height()-51);
                }
            });


        }


        /**
         * Initalise controls if enabled
         */
        SwipeGallery.fn.initControls = function() {
            var component = this;
            if (this.options.controls === true) {
                this.$e.find('.next, .prev').on('click',function (event) {
                    event.preventDefault();
                    component.nextPrevSlide(event.target);
                    return false;
                });

                this.$e.find('.autoplay').on('click',function (event) {
                    event.preventDefault();
                    
                    if (component.state == states.AUTOPLAY_STATE) {
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
            var component = this, player;
            this.options.swipeOptions.callback = function (index, elem) {
                $(this.slides).removeClass('current').eq(index).addClass('current');

                component.pageButtons.removeClass('active').eq(index).addClass('active');

                component.options.callback && component.options.callback.call(this,index, elem);

                // pause youtube player if it exsits
                if ($(elem).hasClass('youtube-slide')) {
                    player = $(elem).data('player');
                    if (player.getPlayerState()==1 || player.getPlayerState()==3) {
                        player.pauseVideo();
                    }
                }
                if ($(elem).hasClass('vimeo-slide')) {
                    player = $(elem).data('player');
                    
                    player.api('pause');
                    
                }
            };
            this.options.swipeOptions.transitionEnd = function (index, elem) {
                component.options.transitionEnd && component.options.transitionEnd.call(this,index, elem);
                
            };

            this.carousel = Swipe(this.element, this.options.swipeOptions);

            $(this.slides).eq(0).addClass('current');
        }


        /**
         * 
         */
        SwipeGallery.fn.initVideos = function() {
            var component = this, video;
            $(this.slides).each(function (listIndex, listItem) {
                 video = $(this).find('iframe');     

                 if (video.length>0) {
                    component.parseVideo(video, $(this),listIndex);
                 }
            });




        }

         SwipeGallery.fn.parseVideo = function(video, container,listIndex) {
            var url = video.attr('src');
            var component = this;

            
            if (url.indexOf("youtube.com")>-1) {

              getYoutubeApi();
              video.attr('data-type','youtube')
                   .attr('id','video'+listIndex);
              container
                  .addClass('resp-frame')
                  .addClass('youtube-slide')
                  .append('<div class="video-proxy"></div>');

              container.find('.video-proxy')        
                  .data('video', video.get(0))
                  .on('click',function(event) { 
                                      component.toggleVideo(event,'youtube') 
                              });    

            } else if (url.indexOf("vimeo.com")>-1) {
              var viddeoID = getQuerystring(url, 'player_id','video'+listIndex);
              

              getVimeoApi();

              video.attr('data-type','vimeo')
                   .attr('id',viddeoID);
              container
                  .addClass('resp-frame')
                  .addClass('vimeo-slide')
                  .append('<div class="video-proxy"></div>');

              container.find('.video-proxy')
                  .data('video', video.get(0))
                  .on('click',function(event) { 
                                      component.toggleVideo(event,'vimeo') 
                              });    

            }
        }

        SwipeGallery.fn.toggleVideo = function(event,type) {
            var el = $(event.target);
            var video = el.data('video');
            var player = $(video).parent().data('player');
            
            if (type == 'youtube') {
              /**
                * -1 (unstarted)
                *  0 (ended)
                *  1 (playing)
                *  2 (paused)
                *  3 (buffering)
                *  5 (video cued).
                **/

              if (player.getPlayerState()==1 || player.getPlayerState()==3) {

                  player.pauseVideo();
              } else {
                  player.playVideo();
              }
            }

            if (type == 'vimeo') {
              console.log('toggle b')
              //player.api('play');
              player.api('paused', function (value, player_id) {
                         
                  if (value==true) {
                      player.api('play');

                  } else {
                      player.api('pause');

                  }
              });
            }

           
        }

        /**
         * Change slide next / previous
         */
        SwipeGallery.fn.nextPrevSlide = function(btn) {
            var component = this;
            if (component.state == states.AUTOPLAY_STATE) { 
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
           
                this.timer = setTimeout(function() { component.timerCallback() },this.options.autoplayDelay);
                this.state = states.AUTOPLAY_STATE;
                if (!this.$e.find('.autoplay').hasClass('playing')) this.$e.find('.autoplay').addClass('playing')
           
        }

        /**
         * Clear autoplay timer
         */
        SwipeGallery.fn.clearTimer = function() {
            clearTimeout(this.timer);
            this.$e.find('.autoplay').removeClass('playing');
            this.state = states.IDLE_STATE;
        }
        
        /**
         * Timer called
         */
        SwipeGallery.fn.timerCallback = function() {
             this.carousel.next();
             this.setTimer();
        }

        SwipeGallery.fn.fixIframeVideos = function() {
             var component = this;
            $(this.slides).find('iframe').each(function (listIndex, listItem) {
                        

            });

             //video-proxy
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