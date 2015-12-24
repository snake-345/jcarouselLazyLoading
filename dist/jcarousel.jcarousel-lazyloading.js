/*! jсarouselLazyLoading - v0.1.0 - 2015-12-10
* Copyright (c) 2015 Evgeniy Pelmenev; Licensed MIT */
(function($) {
    'use strict';

    $.jCarousel.isImageLoaded = function(img) {
        if (!img.complete) {
            return false;
        }

        if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
            return false;
        }

        return true;
    };

    $.jCarousel.plugin('jcarouselLazyLoading', {
        _options: {
            waitFunction: function($slides, callback) {
                //var img = $slide.find('img')[0];

                //if ($.jCarousel.isImageLoaded(img)) {
                    console.clear();
                    $slides.find('img').each(function() {
                        console.log($(this).attr('src'));
                    });
                    callback();
                //} else {

                //}
            }
        },
        _init: function() {
            var self = this;
            this._instance = this.carousel().data('jcarousel');
            this.carousel()
                .on('jcarousel:reloadend', function() {
                    self._reload();
                })
                .on('jcarousel:scroll', function(event, carousel, target, animate) {
                    if (!self._scrolling) {
                        var $nextSlides = self._getNextVisibleSlides(target);

                        self._options.waitFunction($nextSlides, function() {
                            self._scrolling = true;
                            self._instance.scroll(target, animate, function() {
                                self._scrolling = false;
                            });
                        });
                        event.preventDefault();
                    }
                });
        },
        _create: function() {
            this._instance = this.carousel().data('jcarousel');
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
            
        },
        _reload: function() {
            
        }
    });

    // идеи:
    // - определять свайп можно по изменению left
    // - если свайп то не отменять скролл, и уже после прокрутки подгружать изображения
    // - если обычное переключение, то можно определить заранее какие слайды будут visible и подгрузить их перед прокруткой
}(jQuery));
