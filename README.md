# Swipe Gallery Component

Simple wrapper around Swipe component (https://github.com/bradbirdsall/Swipe)

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw2.github.com/jwtlondon/SwipeGallery/master/dist/js/swipeGallery.min.js
[max]: https://raw2.github.com/jwtlondon/SwipeGallery/master/src/js/swipeGallery.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="swipe.js"></script>
<script src="dist/swipeGallery.min.js"></script>
<script>
$(document).ready(function($) {
	$('.carousel').swipeGallery();
});
</script>
```

## Bower

$ bower install jwtlondon/SwipeGallery

## Documentation

Complete list of configuration options and defaults:

```javascript
defaultOptions = {
                paginator    : true, // opt add paginator
                controls     : true, // opt add controls
                autoplay     : false, // set autoplay mode
                autoplayDelay: 5000, // duration slide appears during autoplay
                callback : function (index, elem) { }, // on slide change
                transitionEnd : function (index, elem) { }, // on slide changed
                swipeOptions : {
                    speed           : 400, // speed of prev and next transitions in milliseconds
                    continuous      : true, // create an infinite feel with no endpoints
                    disableScroll   : false, // stop any touches on this container from scrolling the page
                    stopPropagation : false // stop event propagation
                }
            };
```
## Example

### HTML

The root `loading` class is removed after the JS initialises. This is handy for controlling the display on first load

```html
<!-- HTML Markup template 	-->
<div class="carousel">
	<ul class="slides">
		<!-- Slides -->
		<li><img src="http://placehold.it/1024x500"></li>
		<li><img src="http://placehold.it/1024x500"></li>
		<li><img src="http://placehold.it/1024x500"></li>
		<li><img src="http://placehold.it/1024x500"></li>
		<li><img src="http://placehold.it/1024x500"></li>
		<li><img src="http://placehold.it/1024x500"></li>
	 </ul>
</div>

```

### CSS

The slider requires some basic CSS scaffolding

```css

/** conainer element **/
.carousel {
	overflow: hidden;
	visibility: visible;
	position: relative;
}

/** carousel conainer element **/
.carousel ul {
	padding: 0;
	margin: 0;
	list-style: none;
	overflow: hidden;
  	position: relative;
	
}

/** carousel slides **/
.carousel li { 
	float:left;
	width:100%;
	position: relative;
}

.carousel li img {
	width: 100%;
	display: block;

}

/** carousel controls **/
.controls {
	float: right;
}
.paging {
	text-align: center;
	float: left;
}
.pager {
	background: #e7e7e7;
	border: 0;
	overflow: hidden;
	text-indent: -9999px;
	width: 12px;
	height: 12px;
	
	-webkit-border-radius: 50%;
	border-radius: 50%;
	margin:3px;
	cursor: pointer;
}
.pager.active, .pager:hover {
	background:#0089cd;
}
.carouselControl {
	border: 0;
	cursor: pointer;
}

.carouselControl.playing {
	opacity: 0.5;

}

.carouselControl:hover {
	opacity: 1;
}


```
### JS

_Simple example_

```javascript
//Simply select and initialise with some optional configurations
$(document).ready(function($) {
	$('.carousel').SwipeGallery({
                autoplay     : true, 
                autoplayDelay: 10000,
                callback : function (index, elem) { 
                	console.log('changing to '+index);
                }, // on slide change
                transitionEnd : function (index, elem) { 
                	console.log('changed to '+index);
                }, // on slide changed
                swipeOptions : {
                    speed           : 1000, 
                    continuous      : false
                   
                }

		});
});
```

## Repo Examples

* $ npm install
* $ node server.js
* open http://localhost:3000/example/exampleRequirejs.html
* or http://localhost:3000/example/example.html
