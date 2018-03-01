/* 列表页轮播 图片尺寸1000 X 430 */

(function($) {
    $.extend({
        foucs: function(args) {
            var returnFlag = false;
            var animateTimes = 0;
            var $container = $('#main-cont');
            var $imgs = $container.find('li.hero');
            var $leftBtn = $container.find('a.next');
            var $rightBtn = $container.find('a.prev');
            var $positionText = $container.find('.position-text');
            var defaultOptions = {
                interval: 3500,
                animateTime: 500,
                direction: 'right',
                isAutoPlay: false,
                isLazyLoad: false
            };
            var config = $.extend(defaultOptions, args);
            var i = 0;
            var imgLen = $imgs.length;
            init();

            function init() {
                $positionText.text(1 + ' / ' + imgLen);
                if (config.isLazyLoad) {
                    loadImg($imgs.eq(0));
                    loadImg($imgs.eq(1));
                    loadImg($imgs.eq(imgLen - 1));
                }
                if (config.isAutoPlay) {
                    var s = setInterval(function() {
                        silde(config.direction);
                    }, config.interval);
                }
                $imgs.eq(i).css('left', 0).end().eq(i + 1).css('left', '1200px').end().eq(i - 1).css('left', '-1200px');
                if (config.isAutoPlay) {
                    $container.find('.hero-wrap').add($leftBtn).add($rightBtn).hover(function() {
                        clearInterval(s);
                    }, function() {
                        s = setInterval(function() {
                            silde(config.direction);
                        }, config.interval);
                    });
                }
                $leftBtn.unbind().click(function() {
                    if ($(':animated').length === 0) {
                        silde('left');
                    }
                });
                $rightBtn.unbind().click(function() {
                    if ($(':animated').length === 0) {
                        silde('right');
                    }
                });
            }

            function getNextIndex(y) {
                return i + y >= imgLen ? i + y - imgLen : i + y;
            }

            function getPrevIndex(y) {
                return i - y < 0 ? imgLen + i - y : i - y;
            }

            function loadImg(ele) {
                ele.find('[my-src]').each(function() {
                    $(this).attr('src', $(this).attr('my-src')).remove('my-src');
                });
            }

            function silde(direction) {
                d = direction === 'right';
                if (returnFlag) {
                    return;
                }
                returnFlag == true;
                $imgs.eq((d ? getPrevIndex(2) : getNextIndex(2))).css('left', (d ? '-2400px' : '2400px'))
                $imgs.animate({
                    'left': (d ? '+' : '-') + '=1200px'
                }, config.animateTime, function() {
                    animateTimes++;
                    if (animateTimes == imgLen) {
                        returnFlag == false;
                        animateTimes = 0;
                    }
                });
                i = d ? getPrevIndex(1) : getNextIndex(1);
                $positionText.text(i + 1 + ' / ' + imgLen);
                if (config.isLazyLoad) {
                    loadImg($imgs.eq(i));
                    if (i > 0) {
                        loadImg($imgs.eq(i - 1));
                    }
                    if (i + 1 < imgLen) {
                        loadImg($imgs.eq(i + 1));
                    }
                }
            };
        }
    });
}(jQuery));
