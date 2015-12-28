(function($) {
    $(function() {
        $('.jcarousel-1')
            .jcarousel()
            .jcarouselSwipe()
            .jcarouselLazyLoading();

        $('.jcarousel-2')
            .jcarousel()
            .jcarouselSwipe()
            .jcarouselLazyLoading({
                preventScroll: false
            });

        $('.jcarousel-control-prev')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=4'
            });

        $('.jcarousel-control-next')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=4'
            });
    });
})(jQuery);
