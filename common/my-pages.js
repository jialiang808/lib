(function($) {
    $.fn.extend({
        myPages: function(action, args) {
            var container = this;
            if (container.length == 0) {
                return;
            }

            var defaultOptions = {
                width: 0,
                height: 0,
                current: 1,
                total: 1,
                onClick: null
            };

            args = args || action;
            if (action === 'update') {
                defaultOptions = container.data('options');
                var options = $.extend(defaultOptions, args);
                container.data('options', options);
                render();
                return;
            }

            var options = $.extend(defaultOptions, args);
            container.data('options', options);
            container.empty();
            var tempHtml = '<dl class="page"><dt></dt></dl>';
            container.html(tempHtml);
            render();

            function render() {
                if (options.total < 2) {
                    container.hide();
                    return;
                }

                var linkTemplate = '<a my_page_number="{0}">{1}</a>';
                var spanTemplate = '<span class="{0}">{1}</span>';
                var pageHtml = '';
                if (options.current == 1) {
                    pageHtml += spanTemplate.format('disabled', '&lt;');
                } else {
                    pageHtml += linkTemplate.format(options.current - 1, '&lt;');
                }
                //如果页面总数小于9, 显示所有页面，没有...
                if (options.total < 9) {
                    for (var i = 1; i <= options.total; i++) {
                        if (options.current == i) {
                            pageHtml += spanTemplate.format('current', i);
                        } else {
                            pageHtml += linkTemplate.format(i, i);
                        }
                    }
                } else {
                    //添加当前页之前的页面
                    if (options.current > 4) {
                        pageHtml += linkTemplate.format(1, 1);
                        pageHtml += '<b>···</b>';
                        if (options.current == options.total) {
                            pageHtml += linkTemplate.format(options.current - 4, options.current - 4);
                            pageHtml += linkTemplate.format(options.current - 3, options.current - 3);
                        } else if (options.current == options.total - 1) {
                            pageHtml += linkTemplate.format(options.current - 3, options.current - 3);
                        }
                        pageHtml += linkTemplate.format(options.current - 2, options.current - 2);
                        pageHtml += linkTemplate.format(options.current - 1, options.current - 1);
                    } else {
                        for (var i = 1; i < options.current; i++) {
                            pageHtml += linkTemplate.format(i, i);
                        }
                    }
                    //添加当前页面
                    pageHtml += spanTemplate.format('current', options.current);
                    //添加当前页之后的页面
                    if (options.total - options.current > 3) {
                        pageHtml += linkTemplate.format(options.current + 1, options.current + 1);
                        pageHtml += linkTemplate.format(options.current + 2, options.current + 2);
                        if (options.current == 1) {
                            pageHtml += linkTemplate.format(options.current + 3, options.current + 3);
                            pageHtml += linkTemplate.format(options.current + 4, options.current + 4);
                        } else if (options.current == 2) {
                            pageHtml += linkTemplate.format(options.current + 3, options.current + 3);
                        }
                        pageHtml += '<b>···</b>';
                        pageHtml += linkTemplate.format(options.total, options.total);
                    } else {
                        for (var i = options.current + 1; i <= options.total; i++) {
                            pageHtml += linkTemplate.format(i, i);
                        }
                    }
                }
                if (options.current == options.total) {
                    pageHtml += spanTemplate.format('disabled', '&gt;');
                } else {
                    pageHtml += linkTemplate.format(options.current + 1, '&gt;');
                }
                container.find('dt').html(pageHtml);
                container.find('dt a').click(function() {
                    var pageNumber = $(this).attr('my_page_number');
                    gotoPage(parseInt(pageNumber));
                });
                container.show();
            }

            function gotoPage(pageNumber) {
                options.current = pageNumber;
                render();
                if (options.onClick) {
                    options.onClick.call(window, pageNumber);
                }
            }
        }
    });
})(jQuery);