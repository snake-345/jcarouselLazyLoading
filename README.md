# jcarouselLazyLoading plugin
Adds lazy loading to jcarousel.  
The plugin prevented scroll until content in next slides loadings and then scroll will be called.  
But if next slides partially visible(for example: when a user uses swipe gestures) then scroll not prevents.

## Features
* configurable
* opportunity waiting loading any content(video, ajax, images)
* easy to use

## Requirments
* jQuery
* jquery.jcarousel-core.js(minimum) also you may use bundle version: jquery.jcarousel.js

## How to use
To use the plugin include jquery, jcarousel and jcarouselLazyLoading source files into your HTML document:
``` HTML
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery.jcarousel.min.js"></script>
<script type="text/javascript" src="js/jquery.jcarousel-lazyloading.min.js"></script>
```
By default plugin works with images with data-src attribute.  
Also before loading images jcarousel can't get correct slide width and it will broken.  
Therefore you should previously set width for all slides or set width and height attributes for lazy images.
``` HTML
<div class="jcarousel">
    <ul>
        <li><img data-src="http://fakeimg.pl/600x400/ccc/?text=slide1" width="600" height="400" alt=""></li>
        <li><img data-src="http://fakeimg.pl/600x400/bbb/?text=slide2" width="600" height="400" alt=""></li>
        <li><img data-src="http://fakeimg.pl/600x400/aaa/?text=slide3" width="600" height="400" alt=""></li>
        <li><img data-src="http://fakeimg.pl/600x400/999/?text=slide4" width="600" height="400" alt=""></li>
        <li><img data-src="http://fakeimg.pl/600x400/888/?text=slide5" width="600" height="400" alt=""></li>
        <li><img data-src="http://fakeimg.pl/600x400/777/?text=slide6" width="600" height="400" alt=""></li>
    </ul>
</div>
```
and init the plugin:
``` javascript
$('.jcarousel')
    .jcarousel()             // init jcarousel
    .jcarouselLazyLoading(); // init jcarouselLazyLoading
```
That's all =)

## Options
``` javascript
{
    preventScroll: true, // default: true. If set false then jcarousel scroll will not be prevents
    waitFunction: function($slides, callback, isScrollPrevented) { // default: function that is written below
        // $slides: contains slides which will be visible after scroll
        // callback: contains function which you should call when all content in $slides loaded
        // isScrollPrevented: boolean parameter. If true then method scroll was canceled
        // and waiting when callback function will be called. For example you may use it for cancel "show content" animation.
        var i = 0;
        var $lazyImages = $slides.find('img[data-src]');

        $lazyImages.toggleClass('non-transition', !!isScrollPrevented);
        $lazyImages.each(function() {
            var $img = $(this);
            var src = $img.attr('data-src');
            $img.addClass('loading');
            $img.attr('src', src).removeAttr('data-src');
        });
        wait();

        function wait() {
            i++;
            if ($.jCarousel.isImagesLoaded($slides)) {
                callback();
                $lazyImages.removeClass('loading');
            } else if (i <= 100) { // wait maximum 10 seconds
                setTimeout(wait, 100);
            } else {
                callback();
                $lazyImages.removeClass('loading');
            }
        }
    }
}
```
In waitFunction you may waiting any content.  
Also you may use any third-party plugin for waiting content loading in waitFunction(for example imagesLoaded https://github.com/desandro/imagesloaded)
