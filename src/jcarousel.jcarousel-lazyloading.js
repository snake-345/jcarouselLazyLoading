/*! jсarouselLazyLoading - v0.1.0 - 2015-12-10
* Copyright (c) 2015 Evgeniy Pelmenev; Licensed MIT */
(function($) {
    'use strict';

    $.jCarousel.plugin('jcarouselLazyLoading', {
        _init: function() {
            var self = this;
            this.carousel().on('jcarousel:reloadend', function() {
                self._reload();
            });
        },
        _create: function() {
            this._instance = this.carousel().data('jcarousel');
        },
        _destroy: function() {
            
        },
        _reload: function() {
            
        }
    });
}(jQuery));
