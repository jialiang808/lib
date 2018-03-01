/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            data_attribute: "original",
            skip_invisible: false,
            appear: null,
            load: null,
            placeholderType: 'img',
            placeholder: "data:image/jpeg;base64,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"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                    /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if (options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
            settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.on(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. 设置默认img的url*/
            if (settings.placeholderType == 'img') {
                if ($self.attr("src") === undefined || $self.attr("src") === false) {
                    if ($self.is("img")) {
                        $self.attr("src", settings.placeholder);
                    }
                }
            }

            if (settings.placeholderType == 'div') {
                // 如果使用了div进行替代的话则优先使用
                var _src = $self.attr('data-src') || $self.attr('src') || settings.placeholder;
                if ($self.is('img')) {
                    var $parent = $self.parent();
                    // 创建一个替换的div
                    $placeholderDiv = $('<div></div>').css({
                        display: 'inline-block',
                        width: $self.width() + 'px',
                        height: $self.height() + 'px',
                        background: 'url("' + _src + '") no-repeat center'
                    });
                    $self.before($placeholderDiv);
                    $self.hide();
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .one("load", function() {
                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self.prev('div').remove();
                            $self[settings.effect](settings.effect_speed);
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.on(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.on("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.on("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold; //垂直方向图片开始加载的位置

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold; //水平方向图片开始加载的位置

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
            !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold": function(a) {
            return $.belowthefold(a, { threshold: 0 });
        },
        "above-the-top": function(a) {
            return !$.belowthefold(a, { threshold: 0 });
        },
        "right-of-screen": function(a) {
            return $.rightoffold(a, { threshold: 0 });
        },
        "left-of-screen": function(a) {
            return !$.rightoffold(a, { threshold: 0 });
        },
        "in-viewport": function(a) {
            return $.inviewport(a, { threshold: 0 });
        },
        /* Maintain BC for couple of versions. */
        "above-the-fold": function(a) {
            return !$.belowthefold(a, { threshold: 0 });
        },
        "right-of-fold": function(a) {
            return $.rightoffold(a, { threshold: 0 });
        },
        "left-of-fold": function(a) {
            return !$.rightoffold(a, { threshold: 0 });
        }
    });

})(jQuery, window, document);