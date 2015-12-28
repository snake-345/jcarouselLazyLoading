(function($) {
    $(function() {
        $('.jcarousel-1')
            .jcarousel({
                wrap: 'circular'
            })
            .jcarouselSwipe()
            .jcarouselLazyLoading();

        $('.jcarousel-2')
            .jcarousel({
                wrap: 'circular'
            })
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
                target: '-=3'
            });

        $('.jcarousel-control-next')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=3'
            });
    });
})(jQuery);
