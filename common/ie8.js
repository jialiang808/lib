/**********************************
 * JSON2 - 2014-02-04 
 * This file creates a global JSON object containing two methods: stringify and parse.
 * Please see:  http://www.JSON.org/
 ***********************************/
if (typeof JSON !== "object") {
    JSON = {};
}(function() {
    "use strict";

    function f(e) {
        return e < 10 ? "0" + e : e;
    }

    function quote(e) {
        escapable.lastIndex = 0;
        return escapable.test(e) ? '"' + e.replace(escapable, function(e) {
            var t = meta[e];
            return typeof t === "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + e + '"';
    }

    function str(e, t) {
        var n, r, i, s, o = gap,
            u, a = t[e];
        if (a && typeof a === "object" && typeof a.toJSON === "function") {
            a = a.toJSON(e);
        }
        if (typeof rep === "function") {
            a = rep.call(t, e, a);
        }
        switch (typeof a) {
            case "string":
                return quote(a);
            case "number":
                return isFinite(a) ? String(a) : "null";
            case "boolean":
            case "null":
                return String(a);
            case "object":
                if (!a) {
                    return "null";
                }
                gap += indent;
                u = [];
                if (Object.prototype.toString.apply(a) === "[object Array]") {
                    s = a.length;
                    for (n = 0; n < s; n += 1) {
                        u[n] = str(n, a) || "null";
                    }
                    i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]";
                    gap = o;
                    return i;
                }
                if (rep && typeof rep === "object") {
                    s = rep.length;
                    for (n = 0; n < s; n += 1) {
                        if (typeof rep[n] === "string") {
                            r = rep[n];
                            i = str(r, a);
                            if (i) {
                                u.push(quote(r) + (gap ? ": " : ":") + i);
                            }
                        }
                    }
                } else {
                    for (r in a) {
                        if (Object.prototype.hasOwnProperty.call(a, r)) {
                            i = str(r, a);
                            if (i) {
                                u.push(quote(r) + (gap ? ": " : ":") + i);
                            }
                        }
                    }
                }
                i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}";
                gap = o;
                return i;
        }
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf();
        };
    }
    var cx, escapable, gap, indent, meta, rep;
    if (typeof JSON.stringify !== "function") {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {
            "\b": "\\b",
            "    ": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        };
        JSON.stringify = function(e, t, n) {
            var r;
            gap = "";
            indent = "";
            if (typeof n === "number") {
                for (r = 0; r < n; r += 1) {
                    indent += " ";
                }
            } else if (typeof n === "string") {
                indent = n;
            }
            rep = t;
            if (t && typeof t !== "function" && (typeof t !== "object" || typeof t.length !== "number")) {
                throw new Error("JSON.stringify");
            }
            return str("", {
                "": e
            });
        };
    }
    if (typeof JSON.parse !== "function") {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function(text, reviver) {
            function walk(e, t) {
                var n, r, i = e[t];
                if (i && typeof i === "object") {
                    for (n in i) {
                        if (Object.prototype.hasOwnProperty.call(i, n)) {
                            r = walk(i, n);
                            if (r !== undefined) {
                                i[n] = r;
                            } else {
                                delete i[n];
                            }
                        }
                    }
                }
                return reviver.call(e, t, i);
            }
            var j;
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(e) {
                    return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j;
            }
            throw new SyntaxError("JSON.parse");
        };
    }
})();
/*** JSON end ***/

/*** placeholder start ***/
/**
 * jquery.placeholder http://matoilic.github.com/jquery.placeholder
 *
 * @version v0.2.4
 * @author Mato Ilic <info@matoilic.ch>
 * @copyright 2013 Mato Ilic
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($, doc, debug) {
    var input = ('placeholder' in doc.createElement('input')),
        textarea = ('placeholder' in doc.createElement('textarea')),
        selector = ':input[placeholder]';

    $.placeholder = { input: input, textarea: textarea };

    //skip if there is native browser support for the placeholder attribute
    if (!debug && input && textarea) {
        $.fn.placeholder = function() {};
        return;
    }

    if (!debug && input && !textarea) {
        selector = 'textarea[placeholder]';
    }

    /* patch jQuery.fn.val to return an empty value if the value matches 
     * the placeholder
     */
    $.fn.realVal = function(value) {
        var hooks, ret, isFunction,
            elem = this[0];

        if (!arguments.length) {
            if (elem) {
                hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

                if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                    return ret;
                }

                ret = elem.value;

                return typeof ret === "string" ?
                    // handle most common string cases
                    ret.replace(/\r/g, "") :
                    // handle cases where value is null/undef or number
                    ret == null ? "" : ret;
            }

            return;
        }

        isFunction = jQuery.isFunction(value);

        return this.each(function(i) {
            var val;

            if (this.nodeType !== 1) {
                return;
            }

            if (isFunction) {
                val = value.call(this, i, jQuery(this).val());
            } else {
                val = value;
            }

            // Treat null/undefined as ""; convert numbers to string
            if (val == null) {
                val = "";
            } else if (typeof val === "number") {
                val += "";
            } else if (jQuery.isArray(val)) {
                val = jQuery.map(val, function(value) {
                    return value == null ? "" : value + "";
                });
            }

            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

            // If set returns undefined, fall back to normal setting
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                this.value = val;
            }
        });
    };
    $.fn.val = function() {
        var $element = $(this),
            val, placeholder;
        if (arguments.length > 0) return $element.realVal.apply(this, arguments);

        val = $element.realVal();
        placeholder = $element.attr('placeholder');

        return ((val == placeholder) ? '' : val);
    };

    function clearForm() {
        $(this).find(selector).each(removePlaceholder);
    }

    function extractAttributes(elem) {
        var attr = elem.attributes,
            copy = {},
            skip = /^jQuery\d+/;
        for (var i = 0; i < attr.length; i++) {
            if (attr[i].specified && !skip.test(attr[i].name)) {
                copy[attr[i].name] = attr[i].value;
            }
        }
        return copy;
    }

    function removePlaceholder() {
        var $target = $(this),
            $clone, $orig;

        if ($target.is(':password')) return;

        if ($target.data('password')) {
            $orig = $target.next().show().focus();
            $('label[for=' + $target.attr('id') + ']').attr('for', $orig.attr('id'));
            $target.remove();
        } else if ($target.realVal() == $target.attr('placeholder')) {
            $target.val('');
            $target.removeClass('placeholder');
        }
    }

    function setPlaceholder() {
        var $target = $(this),
            $clone, plceholder, hasVal, cid;
        placeholder = $target.attr('placeholder');

        if ($.trim($target.val()).length > 0) return;

        if ($target.is(':password')) {
            cid = $target.attr('id') + '-clone';
            $clone = $('<input/>')
                .attr($.extend(extractAttributes(this), { type: 'text', value: placeholder, 'data-password': 1, id: cid }))
                .addClass('placeholder');

            $target.before($clone).hide();
            $('label[for=' + $target.attr('id') + ']').attr('for', cid);
        } else {
            $target.val(placeholder);
            $target.addClass('placeholder');
        }
    }

    $.fn.placeholder = function() {
        this.filter(selector).each(setPlaceholder);
        return this;
    };

    $(function($) {
        var $doc = $(doc);
        $doc.on('submit', 'form', clearForm);
        $doc.on('focus', selector, removePlaceholder);
        $doc.on('blur', selector, setPlaceholder);
        $(selector).placeholder();
    });
})(jQuery, document, window.debug);
/*** placeholder end ***/

(function() {
    if (!Date.now) {
        Date.now = function() {
            return new Date().getTime();
        };
    }
})();