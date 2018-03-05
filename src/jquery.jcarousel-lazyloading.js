/*! jсarouselLazyLoading - v0.1.0 - 2015-12-10
* Copyright (c) 2015 Evgeniy Pelmenev; Licensed MIT */
(function($) {
    'use strict';

    $.jCarousel.isImagesLoaded = function($scope) {
        var $images = $scope.find('img');
        var count = $images.length;
        var loadedImages = 0;

        $.each($images, function() {
            if (checkImage(this)) {
                loadedImages++;
            }
        });

        function checkImage(img) {
            if (!img.complete) {
                return false;
            }

            if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
                return false;
            }

            return true;
        }

        return loadedImages === count;
    };

    $.jCarousel.plugin('jcarouselLazyLoading', {
        _options: {
            preventScroll: true,
            waitFunction: function($slides, callback, isScrollPrevented) {
                // $slides: contains slides which will be visible after scroll
                // callback: contains function which you should call when all content in $slides loaded
                // isScrollPrevented: boolean parameter. If true then method scroll was canceled
                // and waiting when callback function will be called. For example you may use it for cancel "show content" animation.
                var i = 0;
                var $lazyImages = $slides.find('' +
                    'img[data-src],' +
                    'img[data-srcset],' +
                    'source[data-srcset],' +
                    'source[data-sizes]');

                $lazyImages.toggleClass('non-transition', !!isScrollPrevented);
                $lazyImages.each(function() {
                    var $img = $(this);
                    var src = $img.attr('data-src');
                    var srcset = $img.attr('data-srcset');
                    var sizes = $img.attr('data-sizes');
                    $img.addClass('loading');
                    $img
                        .attr('src', src)
                        .attr('srcset', srcset)
                        .attr('sizes', sizes)
                        .removeAttr('data-src')
                        .removeAttr('data-srcset')
                        .removeAttr('data-sizes');
                    // reevaluate <picture> if picturefill used for support <picture> in old browsers
                    if (typeof window.picturefill === 'function' && $img.is('img')) {
                        picturefill({
                            reevaluate: true,
                            elements: [$img[0]]
                        });
                    }
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
        },
        _loading: false,
        _scrollPrevented: false,
        _position: 0,
        _init: function() {
            var self = this;
            this._instance = this.carousel().data('jcarousel');

            this._element
                .on('jcarousel:reloadend.jcarouselLazyLoading', function() {
                    self._reload();
                })
                .on('jcarousel:scroll.jcarouselLazyLoading', function(event, carousel, target, animate) {
                    var isPositionChanged = self._position !== self._instance.list().position()[self._instance.lt];

                    if (!self._loading && !isPositionChanged && self._options.preventScroll) {
                        var $nextSlides = self._getNextVisibleSlides(target);
                        var callback = function() {};
                        self._scrollPrevented = self._loading = true;

                        if ($.isFunction(animate)) { // if scroll was called like .scroll(target, callback)
                            callback = animate;
                            animate  = true;
                        }

                        self._options.waitFunction($nextSlides, function() {
                            self._scrollPrevented = false;
                            self._instance.scroll(target, animate, function() {
                                callback();
                                self._loading = false;
                            });
                        }, true);
                        event.preventDefault();
                    }

                    if (self._scrollPrevented) {
                        event.preventDefault();
                    }
                })
                .on('jcarousel:scrollend.jcarouselLazyLoading', function() {
                    var isPositionChanged = self._position !== self._instance.list().position()[self._instance.lt];

                    if (isPositionChanged || !self._options.preventScroll) {
                        self._options.waitFunction(self._instance.visible(), function() {});
                    }
                })
                .on('jcarousel:animateend.jcarouselLazyLoading', function() {
                    self._position = self._instance.list().position()[self._instance.lt];
                });
        },
        _create: function() {
            this._reload();
        },
        _getNextVisibleSlides: function(target) {
            var wh = this._instance.clipping();
            var totalWH;
            var end = this._instance.items().length;
            var isEnd;
            var $visibleSlides, $slide, i = 0, targetIndex;

            $slide = this._getSlide(target);
            totalWH = this._instance.dimension($slide);
            $visibleSlides = $slide;
            targetIndex = $slide.index();
            isEnd = targetIndex + 1 >= end;

            while (totalWH < wh) {
                if (this._instance._options.wrap !== 'circular' && isEnd) {
                    if (i > 0) {
                        i = 0;
                    }
                    i--;
                } else {
                    i++;
                    isEnd = targetIndex + i + 1 >= end;
                }

                $slide = this._getSlide(targetIndex + i);
                totalWH += this._instance.dimension($slide);
                $visibleSlides = $visibleSlides.add($slide);
            }

            return $visibleSlides;
        },
        _getSlide: function(target) {
            var parsedTarget = $.jCarousel.parseTarget(target);
            var end = this._instance.items().length;
            var current;

            if (parsedTarget.relative) {
                current = this._instance.index(this._instance.target());

                return this._instance.items().eq((current + parsedTarget.target) % end);
            } else {
                return typeof parsedTarget.target === 'number' ?
                    this._instance.items().eq(parsedTarget.target % end) :
                    parsedTarget.target;
            }
        },
        _destroy: function() {
            this._element.off('.jcarouselLazyLoading');
        },
        _reload: function() {
            this._options.waitFunction(this._instance.visible(), function(){});
            this._position = this._instance.list().position()[this._instance.lt];
        }
    });
}(jQuery));
