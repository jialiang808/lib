(function($) {
    function DataTable(args) {
        var defaultOptions = {
            container: '',
            hasCheckbox: false,
            columns: [],
            afterRenderRow: null,
            pageLength: 10, //如果pageLength为false,没有分页
            lengthChange: false, //是否允许改变每页显示总数
            lengthMenu: [10, 15, 25, 50, 100], //每页显示总数设置
            ajax: null,
            data: []
        };
        this.options = $.extend(defaultOptions, args);
        if (!this.options.pageLength) {
            this.options.lengthChange = false;
        }
        this.container = $(this.options.container);
        this.init();
    }

    DataTable.prototype = {
        init: function() {
            var self = this;
            if (this.options.ajax) {
                this.options.ajax.data = $.extend({
                    p_offset: 0,
                    currentPage: 1,
                    orderColumn: '',
                    order: ''
                }, this.options.ajax.data);
                //设置每页获取多少条数据，没有分页时，获取所有数据
                this.options.ajax.data.p_limit = this.options.pageLength || 100000000;
                if (this.options.ajax.data.currentPage > 1) {
                    this.options.ajax.data.p_offset = (this.options.ajax.data.currentPage - 1) * self.options.pageLength;
                }
                this.options.ajax.loading = self.container;
                this.options.ajax.success = function(data, response) {
                    self.options.data = data.data;
                    self.renderData();
                    self.renderPage(data.total);
                    if (self.options.hasCheckbox) {
                        self.container.find('thead .i-checks input').prop('checked', false);
                    }
                    self.container.find("#mypage-num").text(data.total);
                };
            }
            this.container.append('<table class="table table-striped dataTable b-t b-b"><thead></thead><tbody></tbody></table>');
            this.container.append('<div class="my-table-foot clearfix"></div>');
            if (this.options.lengthChange) {
                this.container.find('.my-table-foot').append('<div class="my-pages-len text-left"></div>');
                this.renderSummary();
            }
            if (this.options.pageLength) {
                this.container.find('.my-table-foot').append('<div class="my-pages text-left"></div>');
            }
            this.renderHeader();
            if (this.options.ajax) {
                this.getData();
            } else {
                this.renderData();
            }
            this.initPage();
            if (this.options.hasCheckbox) {
                this.bindChoseEvent();
            }
            if (this.options.onClick) {
                $(self.container).on({
                    click: function() {
                        var data = $(this).parents('tr').data('data');
                        var action = $(this).attr('my-action');
                        self.options.onClick(data, action);
                    }
                }, '[my-action]');
            }
        },
        renderHeader: function() {
            var self = this;
            var headerHtml = '<tr>';
            if (this.options.hasCheckbox) {
                headerHtml += '<th style="min-width:0;width:20px;"><label class="i-checks m-b-none">';
                headerHtml += '<input type="checkbox"><i></i></label></th>';
            }
            for (var i = 0; i < this.options.columns.length; i++) {
                var item = this.options.columns[i];
                var className = item.sortable ? ' class="sorting"' : '';
                var styleWidth = item.width ? ' style="min-width:' + item.width + '"' : '';
                headerHtml += '<th' + className + styleWidth + ' my-sort="' + item.data + '">' + item.name + '</th>';
            }
            headerHtml += '</tr>';
            this.container.find('thead').html(headerHtml);
            var sortingEle = this.container.find('thead .sorting');
            this.container.find('thead .sorting').click(function() {
                var _class = $(this).hasClass('sorting') ? 'sorting_desc' : ($(this).hasClass('sorting_asc') ? 'sorting_desc' : 'sorting_asc')
                sortingEle.removeClass('sorting_asc');
                sortingEle.removeClass('sorting_desc');
                sortingEle.removeClass('sorting');
                sortingEle.addClass('sorting');
                $(this).removeClass('sorting');
                $(this).addClass(_class);
                var orderType = $(this).hasClass('sorting_asc') ? 'asc' : 'desc';
                var orderName = $(this).attr('my-sort');
                self.options.ajax.data.orderColumn = orderName;
                self.options.ajax.data.order = orderType;
                if (!self.options.pageLength || !self.options.ajax) {
                    //没有分页或者没有ajax时
                    self.options.data.sort(function(a, b) {
                        if (a[orderName] === null || a[orderName] === undefined) {
                            return orderType == 'asc' ? -1 : 1;
                        }
                        if (b[orderName] === null || b[orderName] === undefined) {
                            return orderType == 'asc' ? 1 : -1;
                        }
                        if ('number' == typeof(a[orderName])) {
                            return orderType == 'asc' ? (a[orderName] - b[orderName]) : (b[orderName] - a[orderName]);
                        }
                        return orderType == 'asc' ? a[orderName].localeCompare(b[orderName]) : b[orderName].localeCompare(a[orderName]);
                    });
                    self.renderData();
                } else {
                    self.getData();
                }
            });
        },
        getData: function() {
            if (this.options.ajax.data) {
                this.options.ajax.data.currePageNumber = this.options.ajax.data.currentPage; //java使用
                this.options.ajax.data.size = this.options.ajax.data.p_limit; //java使用
            }
            myCommon.ajax(this.options.ajax);
        },
        renderData: function() {
            var self = this;
            var dataHtml = '';
            for (var i = 0; i < this.options.data.length; i++) {
                var item = this.options.data[i];
                dataHtml += '<tr>';
                if (this.options.hasCheckbox) {
                    dataHtml += '<td><label class="i-checks m-b-none"><input type="checkbox" name="post[]"><i></i></label></td>';
                }
                for (var j = 0; j < this.options.columns.length; j++) {
                    var temp = this.options.columns[j];
                    var text = temp.formatHtml ? temp.formatHtml(item) : (item[temp.data] === null ? '-' : item[temp.data]);
                    if (temp.className) {
                        dataHtml += '<td class="' + temp.className + '">' + text + '</td>';
                    } else {
                        dataHtml += '<td>' + text + '</td>';
                    }
                }
                dataHtml += '</tr>';
            }
            this.container.find('tbody').html(dataHtml);
            this.container.find('tbody tr').each(function(i, el) {
                $(this).data('data', self.options.data[i]);
                if ('function' == typeof(self.options.afterRenderRow)) {
                    self.options.afterRenderRow($(this), self.options.data[i]);
                }
            });
        },
        renderSummary: function() {
            var self = this;
            var html = '<div class="dataTable-length" id="example_length">';
            html += '<label>每页 ';
            html += '    <select name="example_length" aria-controls="example" class="input-sm form-control inline v-middle">';
            for (var i = 0; i < this.options.lengthMenu.length; i++) {
                var item = this.options.lengthMenu[i];
                html += '        <option value="' + item + '">' + item + '</option>';
            }
            html += '    </select>  条数据，共<span id="mypage-num"></span>条</label>';
            html += '</div>';
            this.container.find(".my-pages-len").append(html);
            this.container.find('#example_length select').change(function() {
                self.options.pageLength = $(this).val();
                self.options.ajax.data.p_offset = 0;
                self.options.ajax.data.currentPage = 1;
                self.options.ajax.data.p_limit = $(this).val();
                self.getData();
            });
        },
        renderPage: function(totalCount) {
            var pageContainer = this.container.find('.my-pages');
            if (pageContainer.data('totalCount') != totalCount || pageContainer.data('pageLength') != this.options.pageLength) {
                var totalPages = Math.ceil(totalCount / this.options.pageLength);
                pageContainer.data('totalCount', totalCount);
                pageContainer.data('totalPages', totalPages);
                pageContainer.data('pageLength', this.options.pageLength);
                this.gotoPage(1);
            }
        },
        resetPageLength: function(pageLength) {
            this.options.pageLength = pageLength;
            this.getData();
        },
        initPage: function() {
            var self = this;
            var tempHtml = '<dl class="page  text-center-xs"><dt></dt>';
            tempHtml += '<dd style="display:none;">跳转至<input id="page_input" type="text" class="input-sm form-control" />';
            tempHtml += '页 <a id="skip_button" class="btn btn-sm btn-default">确定</a></dd></dl>';
            var pageContainer = this.container.find('.my-pages');
            pageContainer.html(tempHtml);
            $('#skip_button').click(function() {
                try {
                    var totalPages = pageContainer.data('totalPages');
                    var current = parseInt($('#page_input').val());
                    if (isNaN(current)) {
                        throw new Error("请输入正确的页数");
                    }
                    if (current < 1 || current > totalPages) {
                        throw new Error("输入的页数太大或者太小");
                    }
                    self.gotoPage(current);
                    self.options.ajax.data.currentPage = current;
                    self.options.ajax.data.p_offset = (current - 1) * self.options.pageLength;
                    self.getData();
                } catch (e) {
                    myCommon.showMessage(e.message);
                }
            });
            pageContainer.on('click', 'dt a', function() {
                var pageNumber = $(this).attr('my_page_number');
                self.gotoPage(parseInt(pageNumber));
                self.options.ajax.data.currentPage = pageNumber;
                self.options.ajax.data.p_offset = (pageNumber - 1) * self.options.pageLength;
                self.getData();
            });
            this.gotoPage(this.options.ajax.data.currentPage || 1);
        },
        gotoPage: function(currentPage) {
            self = this;
            var pageContainer = this.container.find('.my-pages');
            var totalPages = pageContainer.data('totalPages');
            if (!totalPages || totalPages < 2) {
                pageContainer.hide();
                return;
            }
            var linkTemplate = '<a my_page_number="{0}">{1}</a>';
            var spanTemplate = '<span class="{0}">{1}</span>';
            var pageHtml = '';
            if (currentPage == 1) {
                pageHtml += spanTemplate.format('disabled', '&lt;');
            } else {
                pageHtml += linkTemplate.format(currentPage - 1, '&lt;');
            }
            //如果页面总数小于9, 显示所有页面，没有...
            if (totalPages < 9) {
                for (var i = 1; i <= totalPages; i++) {
                    if (currentPage == i) {
                        pageHtml += spanTemplate.format('current', i);
                    } else {
                        pageHtml += linkTemplate.format(i, i);
                    }
                }
            } else {
                //添加当前页之前的页面
                if (currentPage > 4) {
                    pageHtml += linkTemplate.format(1, 1);
                    pageHtml += '<label>...</label>';
                    if (currentPage == totalPages) {
                        pageHtml += linkTemplate.format(currentPage - 4, currentPage - 4);
                        pageHtml += linkTemplate.format(currentPage - 3, currentPage - 3);
                    } else if (currentPage == totalPages - 1) {
                        pageHtml += linkTemplate.format(currentPage - 3, currentPage - 3);
                    }
                    pageHtml += linkTemplate.format(currentPage - 2, currentPage - 2);
                    pageHtml += linkTemplate.format(currentPage - 1, currentPage - 1);
                } else {
                    for (var i = 1; i < currentPage; i++) {
                        pageHtml += linkTemplate.format(i, i);
                    }
                }
                //添加当前页面
                pageHtml += spanTemplate.format('current', currentPage);
                //添加当前页之后的页面
                if (totalPages - currentPage > 3) {
                    pageHtml += linkTemplate.format(currentPage + 1, currentPage + 1);
                    pageHtml += linkTemplate.format(currentPage + 2, currentPage + 2);
                    if (currentPage == 1) {
                        pageHtml += linkTemplate.format(currentPage + 3, currentPage + 3);
                        pageHtml += linkTemplate.format(currentPage + 4, currentPage + 4);
                    } else if (currentPage == 2) {
                        pageHtml += linkTemplate.format(currentPage + 3, currentPage + 3);
                    }
                    pageHtml += '<label>...</label>';
                    pageHtml += linkTemplate.format(totalPages, totalPages);
                } else {
                    for (var i = currentPage + 1; i <= totalPages; i++) {
                        pageHtml += linkTemplate.format(i, i);
                    }
                }
            }
            if (currentPage == totalPages) {
                pageHtml += spanTemplate.format('disabled', '&gt;');
            } else {
                pageHtml += linkTemplate.format(currentPage + 1, '&gt;');
            }

            if (totalPages > 8) {
                pageContainer.find('dd').show();
            } else {
                pageContainer.find('dd').hide();
            }
            pageContainer.find('dt').html(pageHtml);
            pageContainer.show();
        },
        removeRow: function(data) {
            var index = this.options.data.indexOf(data);
            if (index > -1) {
                this.options.data.splice(index, 1);
                this.renderData();
            }
        },
        refresh: function(args) { //刷新列表，并更新过滤条件
            if (args) {
                this.options.ajax.data.p_offset = 0;
                this.options.ajax.data.currentPage = 1;
                this.options.ajax.data = $.extend(this.options.ajax.data, args);
            }
            this.getData();
        },
        bindChoseEvent: function() {
            var self = this;
            $(self.container).on({
                click: function() {
                    var checkedElement = self.container.find('tbody .i-checks input:checked');
                    if (checkedElement.length == self.options.pageLength) { //判断是否全部选中
                        self.container.find('thead .i-checks input').prop('checked', true);
                    } else {
                        self.container.find('thead .i-checks input').prop('checked', false);
                    }
                }
            }, 'tbody .i-checks input');
            $(self.container).on({
                click: function() {
                    var isChecked = $(this).is(':checked');
                    if (isChecked) {
                        self.container.find('tbody .i-checks input').prop('checked', true);
                    } else {
                        self.container.find('tbody .i-checks input').prop('checked', false);
                    }
                }
            }, 'thead .i-checks input');
        },
        getSelectedItems: function() {
            var data = [],
                self = this;
            var checkedElement = self.container.find('tbody .i-checks input:checked');
            checkedElement.each(function() {
                var tr = $(this).parents('tr');
                var item = tr.data('data');
                item.ele = tr
                data.push(item);
            });
            return data;
        }
    }

    $.fn.myDataTable = function(args) {
        args.container = this;
        return new DataTable(args);
    };

})(jQuery);