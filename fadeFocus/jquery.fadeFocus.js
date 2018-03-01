/* 首页焦点图 图片尺寸 全屏 X 550*/
(function($) {
    var ua = window.navigator.userAgent;
    var isTouchDevice = (/Android|HTC/i.test(ua)) || (/iPad/i.test(ua)) || (/iPod|iPhone/i.test(ua));
    var animateTimeout = null;
    window.mySlide = {
        init: function(options) {
            var options = options || {
                stopAnimte: $('.slide,.prev,.next,.item'),
                prev: $('.prev'),
                next: $('.next'),
                slide: $('.slide'),
                slideCur: $('.item a')
            };
            mySlide.banSlide(0, 3000, options, 500);
        },
        banSlide: function(item, time, options, speed) {
            if (animateTimeout) {
                clearTimeout(animateTimeout);
            }
            var length = options.slide.length - 1;
            /*自动播放*/
            function autoPlay() {
                item++;
                if (item == length + 1) {
                    item = 0;
                    aniObj(item);
                } else {
                    aniObj(item);
                }
                spanCur(item);
                animateTimeout = setTimeout(autoPlay, time);
            }
            animateTimeout = setTimeout(autoPlay, time);
            /*点击切换动画*/
            function slidePrev(e) {
                e.preventDefault();
                if (!options.slide.is(':animated')) {
                    if (item == 0) {
                        item = length;
                        aniObj(item);
                    } else {
                        item--;
                        aniObj(item);
                    }
                    spanCur(item);
                }
            };

            function slideNext(e) {
                e.preventDefault();
                if (!options.slide.is(':animated')) {
                    if (item == length) {
                        item = 0;
                        aniObj(item);
                    } else {
                        item++;
                        aniObj(item);
                    }
                    spanCur(item);
                }
            };
            /* 点击切换动画 */
            options.slideCur.click(function() {
                if (animateTimeout) {
                    clearTimeout(animateTimeout);
                }
                options.slideCur.removeClass('cur');
                $(this).addClass('cur');
                item = $(this).index();
                if (item <= length) {
                    aniObj(item);
                }
            });
            /*执行动画方法*/
            function aniObj(getNum) {
                options.slide.hide().css({ opacity: 0.5, zIndex: 0 });
                options.slide.eq(getNum).show().stop(true, true).animate({ opacity: 1, zIndex: 8 }, speed);
                if (options.aniMation) {
                    options.slide.removeClass('banAnimate');
                    options.slide.eq(getNum).addClass('banAnimate');
                }
            }
            /*当前动画指示*/
            function spanCur(eqNum) {
                options.slideCur.removeClass('cur');
                options.slideCur.eq(eqNum).addClass('cur');
            }
            /* 触发执行事件 */
            options.prev.click(slidePrev);
            options.next.click(slideNext);
            /* 手机上执行touch事件 */
            if (isTouchDevice) {
                var touchMain = document.getElementById('slide-main');
                var page = {
                    x: 0,
                    y: 0
                }
                var touched;
                touchMain.addEventListener('touchstart', function(e) {
                    if (animateTimeout) {
                        clearTimeout(animateTimeout);
                    }
                    page.x = e.changedTouches[0].pageX;
                    page.y = e.changedTouches[0].pageY;
                });
                touchMain.addEventListener('touchend', function(e) {
                    var pageX = e.changedTouches[0].pageX - page.x;
                    var pageY = e.changedTouches[0].pageY - page.y;
                    if (Math.abs(pageX) > 50) {
                        if (pageX > 0) {
                            slidePrev(e);
                        } else {
                            slideNext(e);
                        }
                    }
                    animateTimeout = setTimeout(autoPlay, time);
                    touched = null;
                });
                /* 防止阻止touchend事件 */
                touchMain.addEventListener('touchmove', function(e) {
                    if (null == touched) {
                        var pageX = e.changedTouches[0].pageX - page.x;
                        var pageY = e.changedTouches[0].pageY - page.y;
                        touched = Math.abs(pageX - page.x) < Math.abs(pageY - page.y);
                    }
                    if (!touched) e.preventDefault();
                });
            } else {
                /*滑过主体区域停止动画*/
                options.stopAnimte.hover(function() {
                    if (animateTimeout) {
                        clearTimeout(animateTimeout);
                    }
                }, function() {
                    animateTimeout = setTimeout(autoPlay, time);
                });
            }
            /*初始化动画*/
            options.slide.eq(0).show().addClass('banAnimate');
        }
    };

    $(function() {
        mySlide.init()
    });
})(jQuery);
