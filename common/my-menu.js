(function($) {
    $.fn.extend({
        myMenu: function(action, args) {
            var container = this;
            if (container.length == 0) {
                return;
            }
            if (action === 'val') {
                if (args !== undefined) {
                    setValue(args);
                } else {
                    return getValue();
                }
            }

            var defaultOptions = {
                width: 0,
                height: 0,
                allText: '', //选择all的时候显示的特殊text
                defaultText: '', //显示请选择
                defaultValue: '', //默认选中的值
                maxHeight: 0, //最大高度
                disabled: false,
                data: [], //list items
                onChanged: null
            };
            args = args || action;
            if (action === 'update') {
                defaultOptions = container.data('options');
            } else {
                container.empty();
            }
            var options = $.extend(defaultOptions, args);
            container.data('options', options);
            container.css({ padding: 0, position: 'relative' });
            container.append('<a class="my-menu-button"></a>');
            var menuButton = container.children('.my-menu-button');
            if (options.disabled) {
                menuButton.addClass('disabled');
            }
            if (options.width > 0) {
                container.width(options.width);
            }
            if (options.height > 0) {
                container.height(options.height);
                menuButton.css('lineHeight', (options.height - 2) + 'px');
            }

            if (options.defaultText) {
                menuButton.html('<div style="text-align:center;">' + options.defaultText + '</div>');
            } else if (options.data && options.data.length > 0) {
                menuButton.attr('my-value', options.data[0].value);
                if (options.allText) {
                    menuButton.text(options.allText);
                } else {
                    menuButton.text(options.data[0].text);
                }
            }
            options.minWidth = options.minWidth || menuButton.innerWidth();
            updateData(container, options.data, true);

            if (options.maxHeight > 0) {
                var menus = container.find('.sub-menu ul');
                if (menus.length == 0) {
                    menus = container.children('.my-menu');
                }
                menus.css({
                    'maxHeight': options.maxHeight,
                    'overflowY': 'scroll'
                });
            }

            function updateData(parentMenuItem, data) {
                parentMenuItem.children('ul').remove();
                if (!data || data.length == 0) {
                    return;
                }
                var menuList = $(document.createElement('ul'));
                menuList.addClass('my-menu');
                menuList.css('minWidth', options.minWidth);
                menuList.hide();
                menuButton.click(function(e) {
                    e.stopPropagation();
                    if (options.disabled) {
                        return;
                    }
                    if (menuList.is(":visible")) {
                        $('.my-menu:visible').hide(); //隐藏其他menu
                        menuList.slideUp('fast');
                    } else {
                        $('.my-menu:visible').hide();
                        menuList.slideDown('fast');
                    }
                });
                $(document).click(function(e) {
                    menuList.hide();
                });

                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.selected || options.defaultValue == item.value) {
                        menuButton.text(item.text);
                        menuButton.attr('my-value', item.value);
                    }

                    var menuItem = $(document.createElement("a"));
                    menuItem.text(item.text);
                    menuItem.attr('my-value', item.value);
                    var itemContainer = $(document.createElement("li"));
                    itemContainer.append(menuItem);
                    menuList.append(itemContainer);
                    if (item.href) {
                        menuItem.attr('href', item.href);
                    } else {
                        menuItem.click(setSeletedItem);
                    }
                }

                parentMenuItem.append(menuList);
            }

            function setSeletedItem(e) {
                e.stopPropagation();
                var seletedItem = $(this);
                var newValue = seletedItem.attr('my-value');
                var newText = seletedItem.text();
                var oldValue = menuButton.attr('my-value');
                container.find('.my-menu').hide();
                if (newValue === oldValue) {
                    return;
                }
                menuButton.attr('my-value', newValue);
                var buttonText = (newValue == '-1' && options.allText) ? options.allText : newText;
                menuButton.text(buttonText);
                menuButton.removeClass('selected');
                if (options.onChanged) {
                    options.onChanged(newValue, buttonText);
                }
            }

            function getValue() {
                return container.children('.my-menu-button').attr('my-value') || '';
            }

            function setValue(value) {
                container.find('ul a[my-value="' + value + '"]').click();
            }
        }
    });
})(jQuery)
