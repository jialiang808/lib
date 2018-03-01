(function($) {
    $.fn.mySelectCity = function(args) {
        var container = this;
        if (this.length == 0) {
            return;
        }
        var defaultOptions = {
            province_id: '', //省
            city_id: '', //市
            county_id: '', //区、县
            town_id: '', //街道
            province_name: '',
            city_name: '',
            county_name: '',
            town_name: ''
        };
        var options = $.extend(defaultOptions, args);
        var provinceItem,
            cityItem,
            countyItem,
            townItem,
            provinceItemName,
            cityItemName,
            countyItemName,
            townItemName,
            townItemCon;

        function initSelectCity() {
            var html = '<div class="areacontainer"><span my-type="provincename">省份</span><select my-type="province"></select></div>\
                        <div class="areacontainer"><span my-type="cityname">市区</span><select my-type="city"></select></div>\
                        <div class="areacontainer"><span my-type="countyname">地区</span><select my-type="county"></select></div>\
                        <div class="areacontainer" my-type="towncontainer" style="display:none"><span my-type="townname">街道</span><select my-type="town" style="display:none"></select></div>';
            container.html(html);
            container.css({
                'padding': '0 0.2rem',
                'background': '#fff'
            });
            container.find(".areacontainer").css({
                'position': 'relative',
                'height': '0.82rem',
                'line-height': '0.82rem',
                'font-size': '0.26rem',
                'background': 'url(/img/mall/address-more.png) no-repeat center right',
                'background-size': '0.12rem 0.28rem',
                'border-bottom': '1px solid #e5e5e5'
            });
            container.find("select").css({
                'width': '100%',
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'height': '0.82rem',
                'opacity': '0',
                'margin': '0'
            });
            provinceItemName = container.find("span[my-type='provincename']");
            cityItemName = container.find("span[my-type='cityname']");
            countyItemName = container.find("span[my-type='countyname']");
            townItemName = container.find("span[my-type='townname']");

            townItemCon = container.find("div[my-type='towncontainer']");

            provinceItem = container.find("select[my-type='province']");
            cityItem = container.find("select[my-type='city']");
            countyItem = container.find("select[my-type='county']");
            townItem = container.find("select[my-type='town']");
            getProvince();
            getCity();
            getCounty();
            getTown();
            initChangeEvent();

            if (options.province_name) {
                provinceItemName.text(options.province_name);
                cityItemName.text(options.city_name);
                countyItemName.text(options.county_name)
                townItemName.text(options.town_name)
            }
        }
        //获取省
        function getProvince() {
            myCommon.ajax({
                url: window.apiServer + "/api/opt/location/province",
                success: function(data) {
                    var html = '<option value="">请选择省</option>';
                    $.each(data.data, function(index, value) {
                        html += '<option value="' + value.id + '">' + value.name + '</option>';
                    });
                    provinceItem.html(html).prop("value", options.province_id);
                }
            });
        }
        //获取市
        function getCity() {
            var html = '<option value="">请选择市</option>';
            if (!options.province_id) {
                cityItem.html(html);
                return;
            }
            myCommon.ajax({
                // loading: container,
                url: window.apiServer + '/api/opt/location/city',
                data: { id: options.province_id },
                success: function(data) {
                    $.each(data.data, function(index, value) {
                        html += '<option value="' + value.id + '">' + value.name + '</option>';
                    });
                    cityItem.html(html).prop("value", options.city_id);
                }
            });
        }
        //获取区、县
        function getCounty() {
            var html = '<option value="">请选择区县</option>';
            if (!options.city_id) {
                countyItem.html(html);
                return;
            }
            myCommon.ajax({
                // loading: container,
                url: window.apiServer + "/api/opt/location/area",
                data: { id: options.city_id },
                success: function(data) {
                    $.each(data.data, function(index, value) {
                        html += '<option value="' + value.id + '">' + value.name + '</option>';
                    });
                    countyItem.html(html).prop("value", options.county_id);
                }
            });
        }
        //获取街道
        function getTown() {
            var html = '<option value="0">请选择街道</option>';
            if (!options.county_id) {
                townItem.html(html);
                return;
            }
            myCommon.ajax({
                // loading: container,
                url: window.apiServer + '/api/opt/location/area',
                data: { id: options.county_id },
                success: function(data) {
                    $.each(data.data, function(index, value) {
                        html += '<option value="' + value.id + '">' + value.name + '</option>';
                    });
                    if (data.data.length > 0) {
                        townItem.show();
                        townItemCon.show();
                    } else {
                        townItem.hide();
                        townItemCon.hide();
                    }
                    townItem.html(html).prop("value", options.town_id);
                }
            });
        }
        //清除
        function clearItem(type) {
            if (type == 'province') {
                cityItem.html('<option value="">请选择市</option>');
                countyItem.html('<option value="">请选择区县</option>');
                cityItemName.text("市区");
                countyItemName.text("地区");
            } else if (type == 'city') {
                countyItem.html('<option value="">请选择区县</option>');
                countyItemName.text("地区");
            }
            townItem.html('<option value="0">请选择街道</option>');
            townItemName.text("街道");
            options.town_name = '';
        }

        function initChangeEvent() {
            provinceItem.on("change", function() {
                provinceItemName.text(provinceItem.find("option:selected").text());

                clearItem('province');
                options.province_id = provinceItem.val();
                options.province_name = provinceItem.find("option:selected").text();
                options.city_id = '';
                options.county_id = '';
                options.town_id = 0;
                townItem.hide();
                townItemCon.hide();
                getCity();
            });
            cityItem.on("change", function() {
                cityItemName.text(cityItem.find("option:selected").text());

                clearItem('city');
                options.city_id = cityItem.val();
                options.city_name = cityItem.find("option:selected").text();
                options.county_id = '';
                options.town_id = 0;
                townItem.hide();
                townItemCon.hide();
                getCounty();
            });
            countyItem.on("change", function() {
                countyItemName.text(countyItem.find("option:selected").text());

                clearItem('county');
                options.county_id = countyItem.val();
                options.county_name = countyItem.find("option:selected").text();
                options.town_id = 0;
                getTown();
            });
            townItem.on("change", function() {
                options.town_id = townItem.val();
                options.town_name = townItem.find("option:selected").text();
                townItemName.text(townItem.find("option:selected").text());
            });
        }
        initSelectCity();
        return {
            validator: function() {
                if (!options.province_id) {
                    myCommon.showMessage('请选择省份');
                    return false;
                } else if (!options.city_id) {
                    myCommon.showMessage('请选择城市');
                    return false;
                } else if (!options.county_id) {
                    myCommon.showMessage('请选择区县');
                    return false;
                } else if ((!options.town_id || options.town_id == 0) && !townItem.is(":hidden")) {
                    myCommon.showMessage('请选择城镇');
                    return false;
                }
                return true;
            },
            getVal: function() {
                return options;
            },
            editInit: function(item) {
                options = item;
                initSelectCity();
            },
            addInit: function() {
                options = defaultOptions;
                initSelectCity();
            }

        }
    };
})(jQuery);