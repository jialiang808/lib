//depend on common/common.js
var myValidator = {
    init: function() {
        //bind events for validator element
        $(document).on({
            focus: function() {
                myValidator.hideWarning(this);
            },
            blur: function() {
                myValidator.validate(this);
            }
        }, '[my-validator]');
    },
    //validate all elements
    validateAll: function(key, isGotoError) {
        var validateElements = key ? $('[my-validator][my-key="' + key + '"]') : $('[my-validator]');
        if (validateElements.length == 0) {
            return true;
        }
        var result = true;
        validateElements.each(function(i, el) {
            var tempResult = myValidator.validate(this);
            if (!tempResult && result) {
                if (isGotoError) {
                    var errTop = $(el).offset().top;
                    errTop = errTop > 30 ? errTop - 30 : 0;
                    $(document.body).scrollTop(errTop);
                }
                result = tempResult;
            }
        });

        return result;
    },
    //validate the element
    validate: function(element) {
        var ele = $(element);
        if (ele.attr('my-no-need') && !$.trim(ele.val())) {
            return true;
        }
        if (ele.length == 0 || ele.is(':hidden')) {
            return true;
        }
        var options = this.getOptions(element);
        var warningId = ele.attr('my-warning-id');
        if (!warningId) {
            var warningId = "validator-warning-" + myCommon.getSingleNumber();
            ele.attr('my-warning-id', warningId);
            ele.wrap('<div class="validator"></div>');
            ele.after('<span class="message-' + options.position + '"><span id="' + warningId + '" class="error" style="display:none;">' + options.message + '</span></span>');
        }

        var result = options.validator.call(ele);
        if (result === true) {
            this.hideWarning(element);
        } else {
            this.showWarning(element, result);
            result = false;
        }
        return result;
    },
    //get the validator options
    getOptions: function(element) {
        var ele = $(element);
        var args = ele.data('my-options') || {};
        args.key = ele.attr('my-key') || 'default';
        args.type = ele.attr('my-validator') || 'text';
        args.position = ele.attr('my-position') || 'bottom';
        args.message = ele.attr('my-message');
        //验证字符串长度，或者数值大小
        if (args.type == 'number') {
            args.min = ele.attr('my-min') ? parseInt(ele.attr('my-min')) : 0;
        } else {
            args.min = ele.attr('my-min') ? parseInt(ele.attr('my-min')) : 1;
        }
        args.max = ele.attr('my-max') ? parseInt(ele.attr('my-max')) : 0;
        var customMethod = ele.attr('my-custom');
        if (customMethod) {
            args.validator = window[customMethod];
        } else {
            switch (args.type) {
                case 'text':
                    args.validator = this.validateText;
                    break;
                case 'phone':
                    args.validator = this.validatePhone;
                    break;
                case 'number':
                    args.validator = this.validateNumber;
                    break;
                case 'price':
                    args.validator = this.validatePrice;
                    break;
                case 'telphone':
                    args.validator = this.validateTelPhone;
                    break;
                case 'password':
                    args.validator = this.validatePassword;
                    break;
            }
        }
        ele.data('my-options', args);

        return args;
    },
    //show the validator warning icon
    showWarning: function(element, message) {
        var ele = $(element);
        ele.addClass('error');
        var warningId = ele.attr("my-warning-id");
        var warningElement = $("#" + warningId);
        message = message || ele.attr('my-message');
        if (message) {
            warningElement.html(message);
            warningElement.show();
        }
    },
    //hide the validator warning icon
    hideWarning: function(element) {
        var ele = $(element);
        ele.removeClass('error');
        var warningId = ele.attr("my-warning-id");
        $("#" + warningId).hide();
    },
    //validate not empty
    validateText: function() {
        var options = $(this).data('my-options');
        var text = $.trim($(this).val());
        if (text.length < options.min) {
            return false;
        }

        if (options.max > 0 && text.length > options.max) {
            return false;
        }

        return true;
    },
    validateNumber: function() {
        var text = $.trim($(this).val());
        var floatArg = $(this).attr('my-decimal');
        if (!floatArg) {
            var re = /^\d+$/;
            if (!re.test(text)) {
                return false;
            }
        } else {
            if (floatArg == 'max') {
                var re = new RegExp('^\\d+(.\\d+)?$');
            } else {
                var re = new RegExp('^\\d+(.\\d{1,' + floatArg + '})?$');
            }
            if (!re.test(text)) {
                return false;
            }
        }
        try {
            var num = Number(text);
            var options = $(this).data('my-options');
            if (num < options.min) {
                return false;
            }
            if ($(this).attr('my-max') && num > options.max) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    validatePrice: function() {
        var text = $.trim($(this).val());
        var re = /^\d+(\.\d{1,2})?$/;
        if (!re.test(text)) {
            return false;
        }
        try {
            var num = parseFloat(text);
            return num >= 0;
        } catch (e) {
            return false;
        }
    },
    validatePhone: function() {
        var text = $.trim($(this).val());
        if (!text) {
            return false;
        }
        text = text.replace(String.fromCharCode(8237), '');
        if (text.length != 11) {
            return false;
        }
        var re = /^((1[0-9]{2})+\d{8})$/;
        if (!re.test(text)) {
            return false;
        }

        return true;
    },
    validateTel: function() {
        var text = $.trim($(this).val());
        if (!text) {
            return false;
        }
        text = text.replace(String.fromCharCode(8237), '');
        if (text.length < 10 || text.length > 13) {
            return false;
        }
        var re = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
        if (!re.test(text)) {
            return false;
        }

        return true;
    },
    validateTelPhone: function() {
        return myValidator.validateTel.call(this) || myValidator.validatePhone.call(this);
    },
    validatePassword: function() {
        var text = $.trim($(this).val());
        if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(text))) {
            return false;
        }
        return true;
    }
};

$(myValidator.init);