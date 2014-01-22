!function(){function t(t,i){function n(t,i){return this.init(t,i),this}var e={IDLE_STATE:"idle",AUTOPLAY_STATE:"autoplay"},s={paginator:!0,autoplay:!1,autoplayDelay:5e3,controls:!0,swipeOptions:{speed:400,continuous:!0,disableScroll:!1,stopPropagation:!1}};return n.fn=n.prototype,n.fn.init=function(i,n){this.element=i,this.$e=t(this.element),this.container=this.element.children[0],this.slides=this.container.children,this.timer,this.state=e.IDLE_STATE,this.options=t.extend({},s,n||{}),this.initSwipe(),this.buildContols(),this.initControls(),this.options.autoplay===!0&&this.setTimer()},n.fn.buildContols=function(){var i;i="",this.options.paginator===!0&&(i+='<nav class="paging">',t(this.slides).each(function(t){i+='<button class="pager" data-index="'+t+'">'+t+"</button>"}),i+="</nav>");var n=[];this.options.controls===!0&&(n.push('<button class="prev changeSlide carouselControl">Previous</button>'),n.push('<button class="autoplay carouselControl">Play/Pause</button>'),n.push('<button class="next changeSlide carouselControl">Next</button>')),(this.options.autoplay===!0||this.options.controls===!0)&&(i+='<nav class="controls">'+n.join("")+"</nav>"),this.$e.append(i)},n.fn.initControls=function(){var t=this;this.options.controls===!0&&(this.$e.find(".changeSlide").on("click",function(i){return i.preventDefault(),t.nextPrevSlide(i.target),!1}),this.$e.find(".autoplay").on("click",function(i){return i.preventDefault(),t.state==e.AUTOPLAY_STATE?t.clearTimer():t.setTimer(),!1})),this.options.paginator===!0&&(this.pageButtons=this.$e.find(".pager"),this.pageButtons.on("click",function(i){return i.preventDefault(),t.changeSlide(i.target),!1}).eq(0).addClass("active"))},n.fn.initSwipe=function(){var n=this;this.options.swipeOptions.callback=function(i,e){t(this.slides).removeClass("current").eq(i).addClass("current"),n.pageButtons.removeClass("active").eq(i).addClass("active"),n.options.callback&&n.options.callback.call(this,i,e)},this.options.swipeOptions.transitionEnd=function(t,i){n.options.transitionEnd&&n.options.transitionEnd.call(this,t,i)},this.carousel=i(this.element,this.options.swipeOptions),t(this.slides).eq(0).addClass("current")},n.fn.nextPrevSlide=function(i){var n=this;n.state==e.AUTOPLAY_STATE&&n.setTimer(),t(i).hasClass("next")?this.carousel.next():this.carousel.prev()},n.fn.changeSlide=function(i){this.carousel.slide(parseInt(t(i).data("index"),10),this.options.swipeOptions.speed)},n.fn.setTimer=function(){var t=this;clearTimeout(this.timer),this.timer=setTimeout(function(){t.timerCallback()},this.options.autoplayDelay),this.state=e.AUTOPLAY_STATE,this.$e.find(".autoplay").hasClass("playing")||this.$e.find(".autoplay").addClass("playing")},n.fn.clearTimer=function(){clearTimeout(this.timer),this.$e.find(".autoplay").removeClass("playing"),this.state=e.IDLE_STATE},n.fn.timerCallback=function(){this.carousel.next(),this.setTimer()},(window.jQuery||window.Zepto)&&!function(t){t.fn.SwipeGallery=function(i){return this.each(function(){t(this).data("SwipeGallery",new n(t(this)[0],i))})}}(window.jQuery||window.Zepto),n}"function"==typeof define&&define.amd?define(["jquery","swipe"],t):window.SwipeGallery=t(window.$,window.Swipe)}();