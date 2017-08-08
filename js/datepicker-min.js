/*!
 * Datepicker v0.5.3
 * https://github.com/fengyuanchen/datepicker
 *
 * Copyright (c) 2014-2017 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2017-05-30T03:33:51.775Z
 */
! function(t) {
    "function" == typeof define && define.amd ? define("datepicker", ["jquery"], t) : t("object" == typeof exports ? require("jquery") : jQuery)
}(function(t) {
    "use strict";

    function e(t) {
        return b.call(t).slice(8, -1).toLowerCase()
    }

    function i(t) {
        return "string" == typeof t
    }

    function s(t) {
        return "number" == typeof t && !isNaN(t)
    }

    function a(t) {
        return void 0 === t
    }

    function n(t) {
        return "date" === e(t)
    }

    function h(t, e) {
        var i = [];
        return Array.from ? Array.from(t).slice(e || 0) : (s(e) && i.push(e), i.slice.apply(t, i))
    }

    function r(t, e) {
        var i = h(arguments, 2);
        return function() {
            return t.apply(e, i.concat(h(arguments)))
        }
    }

    function l(t) {
        return t % 4 == 0 && t % 100 != 0 || t % 400 == 0
    }

    function o(t, e) {
        return [31, l(t) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][e]
    }

    function d(t) {
        var e, i, s = String(t).toLowerCase(),
            a = s.match(y);
        if (!a || 0 === a.length) throw new Error("Invalid date format.");
        for (t = {
                source: s,
                parts: a
            }, e = a.length, i = 0; i < e; i++) switch (a[i]) {
            case "dd":
            case "d":
                t.hasDay = !0;
                break;
            case "mm":
            case "m":
                t.hasMonth = !0;
                break;
            case "yyyy":
            case "yy":
                t.hasYear = !0
        }
        return t
    }

    function c(e, i) {
        i = t.isPlainObject(i) ? i : {}, i.language && (i = t.extend({}, c.LANGUAGES[i.language], i)), this.$element = t(e), this.options = t.extend({}, c.DEFAULTS, i), this.isBuilt = !1, this.isShown = !1, this.isInput = !1, this.isInline = !1, this.initialValue = "", this.initialDate = null, this.startDate = null, this.endDate = null, this.init()
    }
    var u = t(window),
        p = window.document,
        f = t(p),
        g = window.Number,
        w = "datepicker",
        m = "click.datepicker",
        y = /(y|m|d)+/g,
        k = /^\d{2,4}$/,
        v = ["datepicker-top-left", "datepicker-top-right", "datepicker-bottom-left", "datepicker-bottom-right"].join(" "),
        D = "datepicker-hide",
        C = Math.min,
        b = Object.prototype.toString;
    c.prototype = {
        constructor: c,
        init: function() {
            var e = this.options,
                i = this.$element,
                s = e.startDate,
                a = e.endDate,
                n = e.date;
            this.$trigger = t(e.trigger), this.isInput = i.is("input") || i.is("textarea"), this.isInline = e.inline && (e.container || !this.isInput), this.format = d(e.format), this.oldValue = this.initialValue = this.getValue(), n = this.parseDate(n || this.initialValue), s && (s = this.parseDate(s), n.getTime() < s.getTime() && (n = new Date(s)), this.startDate = s), a && (a = this.parseDate(a), s && a.getTime() < s.getTime() && (a = new Date(s)), n.getTime() > a.getTime() && (n = new Date(a)), this.endDate = a), this.date = n, this.viewDate = new Date(n), this.initialDate = new Date(this.date), this.bind(), (e.autoShow || this.isInline) && this.show(), e.autoPick && this.pick()
        },
        build: function() {
            var e, i = this.options,
                s = this.$element;
            this.isBuilt || (this.isBuilt = !0, this.$picker = e = t(i.template), this.$week = e.find('[data-view="week"]'), this.$yearsPicker = e.find('[data-view="years picker"]'), this.$yearsPrev = e.find('[data-view="years prev"]'), this.$yearsNext = e.find('[data-view="years next"]'), this.$yearsCurrent = e.find('[data-view="years current"]'), this.$years = e.find('[data-view="years"]'), this.$monthsPicker = e.find('[data-view="months picker"]'), this.$yearPrev = e.find('[data-view="year prev"]'), this.$yearNext = e.find('[data-view="year next"]'), this.$yearCurrent = e.find('[data-view="year current"]'), this.$months = e.find('[data-view="months"]'), this.$daysPicker = e.find('[data-view="days picker"]'), this.$monthPrev = e.find('[data-view="month prev"]'), this.$monthNext = e.find('[data-view="month next"]'), this.$monthCurrent = e.find('[data-view="month current"]'), this.$days = e.find('[data-view="days"]'), this.isInline ? t(i.container || s).append(e.addClass("datepicker-inline")) : (t(p.body).append(e.addClass("datepicker-dropdown")), e.addClass(D)), this.fillWeek())
        },
        unbuild: function() {
            this.isBuilt && (this.isBuilt = !1, this.$picker.remove())
        },
        bind: function() {
            var e = this.options,
                i = this.$element;
            t.isFunction(e.show) && i.on("show.datepicker", e.show), t.isFunction(e.hide) && i.on("hide.datepicker", e.hide), t.isFunction(e.pick) && i.on("pick.datepicker", e.pick), this.isInput && i.on("keyup.datepicker", t.proxy(this.keyup, this)), this.isInline || (e.trigger ? this.$trigger.on(m, t.proxy(this.toggle, this)) : this.isInput ? i.on("focus.datepicker", t.proxy(this.show, this)) : i.on(m, t.proxy(this.show, this)))
        },
        unbind: function() {
            var e = this.options,
                i = this.$element;
            t.isFunction(e.show) && i.off("show.datepicker", e.show), t.isFunction(e.hide) && i.off("hide.datepicker", e.hide), t.isFunction(e.pick) && i.off("pick.datepicker", e.pick), this.isInput && i.off("keyup.datepicker", this.keyup), this.isInline || (e.trigger ? this.$trigger.off(m, this.toggle) : this.isInput ? i.off("focus.datepicker", this.show) : i.off(m, this.show))
        },
        showView: function(t) {
            var e = this.$yearsPicker,
                i = this.$monthsPicker,
                s = this.$daysPicker,
                a = this.format;
            if (a.hasYear || a.hasMonth || a.hasDay) switch (g(t)) {
                case 2:
                case "years":
                    i.addClass(D), s.addClass(D), a.hasYear ? (this.fillYears(), e.removeClass(D), this.place()) : this.showView(0);
                    break;
                case 1:
                case "months":
                    e.addClass(D), s.addClass(D), a.hasMonth ? (this.fillMonths(), i.removeClass(D), this.place()) : this.showView(2);
                    break;
                default:
                    e.addClass(D), i.addClass(D), a.hasDay ? (this.fillDays(), s.removeClass(D), this.place()) : this.showView(1)
            }
        },
        hideView: function() {
            !this.isInline && this.options.autoHide && this.hide()
        },
        place: function() {
            if (!this.isInline) {
                var t = this.options,
                    e = this.$element,
                    i = this.$picker,
                    s = f.outerWidth(),
                    a = f.outerHeight(),
                    n = e.outerWidth(),
                    h = e.outerHeight(),
                    r = i.width(),
                    l = i.height(),
                    o = e.offset(),
                    d = o.left,
                    c = o.top,
                    u = parseFloat(t.offset) || 10,
                    p = "datepicker-top-left";
                c > l && c + h + l > a ? (c -= l + u, p = "datepicker-bottom-left") : c += h + u, d + r > s && (d = d + n - r, p = p.replace("left", "right")), i.removeClass(v).addClass(p).css({
                    top: c,
                    left: d,
                    zIndex: parseInt(t.zIndex, 10)
                })
            }
        },
        trigger: function(e, i) {
            var s = t.Event(e, i);
            return this.$element.trigger(s), s
        },
        createItem: function(e) {
            var i = this.options,
                s = i.itemTag,
                a = {
                    text: "",
                    view: "",
                    muted: !1,
                    picked: !1,
                    disabled: !1,
                    highlighted: !1
                },
                n = [];
            return t.extend(a, e), a.muted && n.push(i.mutedClass), a.highlighted && n.push(i.highlightedClass), a.picked && n.push(i.pickedClass), a.disabled && n.push(i.disabledClass), "<" + s + ' class="' + n.join(" ") + '"' + (a.view ? ' data-view="' + a.view + '"' : "") + ">" + a.text + "</" + s + ">"
        },
        fillAll: function() {
            this.fillYears(), this.fillMonths(), this.fillDays()
        },
        fillWeek: function() {
            var e, i = this.options,
                s = parseInt(i.weekStart, 10) % 7,
                a = i.daysMin,
                n = "";
            for (a = t.merge(a.slice(s), a.slice(0, s)), e = 0; e <= 6; e++) n += this.createItem({
                text: a[e]
            });
            this.$week.html(n)
        },
        fillYears: function() {
            var e, i = this.options,
                s = i.disabledClass || "",
                a = i.yearSuffix || "",
                n = t.isFunction(i.filter) && i.filter,
                h = this.startDate,
                r = this.endDate,
                l = this.viewDate,
                o = l.getFullYear(),
                d = l.getMonth(),
                c = l.getDate(),
                u = new Date,
                p = u.getFullYear(),
                f = this.date,
                g = f.getFullYear(),
                w = !1,
                m = !1,
                y = !1,
                k = !1,
                v = !1,
                D = "";
            for (e = -5; e <= 6; e++) f = new Date(o + e, d, c), v = e === -5 || 6 === e, k = o + e === g, y = !1, h && (y = f.getFullYear() < h.getFullYear(), e === -5 && (w = y)), !y && r && (y = f.getFullYear() > r.getFullYear(), 6 === e && (m = y)), !y && n && (y = n.call(this.$element, f) === !1), D += this.createItem({
                text: o + e,
                view: y ? "year disabled" : k ? "year picked" : "year",
                muted: v,
                picked: k,
                disabled: y,
                highlighted: f.getFullYear() === p
            });
            this.$yearsPrev.toggleClass(s, w), this.$yearsNext.toggleClass(s, m), this.$yearsCurrent.toggleClass(s, !0).html(o + -5 + a + " - " + (o + 6) + a), this.$years.html(D)
        },
        fillMonths: function() {
            var e, i = this.options,
                s = i.disabledClass || "",
                a = i.monthsShort,
                n = t.isFunction(i.filter) && i.filter,
                h = this.startDate,
                r = this.endDate,
                l = this.viewDate,
                o = l.getFullYear(),
                d = l.getDate(),
                c = new Date,
                u = c.getFullYear(),
                p = c.getMonth(),
                f = this.date,
                g = f.getFullYear(),
                w = f.getMonth(),
                m = !1,
                y = !1,
                k = !1,
                v = !1,
                D = "";
            for (e = 0; e <= 11; e++) f = new Date(o, e, d), v = o === g && e === w, k = !1, h && (m = f.getFullYear() === h.getFullYear(), k = m && f.getMonth() < h.getMonth()), !k && r && (y = f.getFullYear() === r.getFullYear(), k = y && f.getMonth() > r.getMonth()), !k && n && (k = n.call(this.$element, f) === !1), D += this.createItem({
                index: e,
                text: a[e],
                view: k ? "month disabled" : v ? "month picked" : "month",
                picked: v,
                disabled: k,
                highlighted: o === u && f.getMonth() === p
            });
            this.$yearPrev.toggleClass(s, m), this.$yearNext.toggleClass(s, y), this.$yearCurrent.toggleClass(s, m && y).html(o + i.yearSuffix || ""), this.$months.html(D)
        },
        fillDays: function() {
            var e, i, s, a = this.options,
                n = a.disabledClass || "",
                h = a.yearSuffix || "",
                r = a.monthsShort,
                l = parseInt(a.weekStart, 10) % 7,
                d = t.isFunction(a.filter) && a.filter,
                c = this.startDate,
                u = this.endDate,
                p = this.viewDate,
                f = p.getFullYear(),
                g = p.getMonth(),
                w = f,
                m = g,
                y = f,
                k = new Date,
                v = k.getFullYear(),
                D = k.getMonth(),
                C = k.getDate(),
                b = g,
                $ = this.date,
                x = $.getFullYear(),
                F = $.getMonth(),
                S = $.getDate(),
                I = !1,
                M = !1,
                V = !1,
                T = !1,
                Y = [],
                A = [],
                P = [];
            for (0 === g ? (w -= 1, m = 11) : m -= 1, e = o(w, m), $ = new Date(f, g, 1), s = $.getDay() - l, s <= 0 && (s += 7), c && (I = $.getTime() <= c.getTime()), i = e - (s - 1); i <= e; i++) $ = new Date(w, m, i), T = w === x && m === F && i === S, V = !1, c && (V = $.getTime() < c.getTime()), !V && d && (V = d.call(this.$element, $) === !1), Y.push(this.createItem({
                text: i,
                view: "day prev",
                muted: !0,
                picked: T,
                disabled: V,
                highlighted: w === v && m === D && $.getDate() === C
            }));
            for (11 === g ? (y += 1, b = 0) : b += 1, e = o(f, g), s = 42 - (Y.length + e), $ = new Date(f, g, e), u && (M = $.getTime() >= u.getTime()), i = 1; i <= s; i++) $ = new Date(y, b, i), T = y === x && b === F && i === S, V = !1, u && (V = $.getTime() > u.getTime()), !V && d && (V = d.call(this.$element, $) === !1), A.push(this.createItem({
                text: i,
                view: "day next",
                muted: !0,
                picked: T,
                disabled: V,
                highlighted: y === v && b === D && $.getDate() === C
            }));
            for (i = 1; i <= e; i++) $ = new Date(f, g, i), T = f === x && g === F && i === S, V = !1, c && (V = $.getTime() < c.getTime()), !V && u && (V = $.getTime() > u.getTime()), !V && d && (V = d.call(this.$element, $) === !1), P.push(this.createItem({
                text: i,
                view: V ? "day disabled" : T ? "day picked" : "day",
                picked: T,
                disabled: V,
                highlighted: f === v && g === D && $.getDate() === C
            }));
            this.$monthPrev.toggleClass(n, I), this.$monthNext.toggleClass(n, M), this.$monthCurrent.toggleClass(n, I && M).html(a.yearFirst ? f + h + " " + r[g] : r[g] + " " + f + h), this.$days.html(Y.join("") + P.join(" ") + A.join(""))
        },
        click: function(e) {
            var i, s, a, n, h, r, l = t(e.target),
                o = this.options,
                d = this.viewDate;
            if (e.stopPropagation(), e.preventDefault(), !l.hasClass("disabled")) switch (i = d.getFullYear(), s = d.getMonth(), a = d.getDate(), r = l.data("view")) {
                case "years prev":
                case "years next":
                    i = "years prev" === r ? i - 10 : i + 10, h = l.text(), n = k.test(h), n && (i = parseInt(h, 10), this.date = new Date(i, s, C(a, 28))), this.viewDate = new Date(i, s, C(a, 28)), this.fillYears(), n && (this.showView(1), this.pick("year"));
                    break;
                case "year prev":
                case "year next":
                    i = "year prev" === r ? i - 1 : i + 1, this.viewDate = new Date(i, s, C(a, 28)), this.fillMonths();
                    break;
                case "year current":
                    this.format.hasYear && this.showView(2);
                    break;
                case "year picked":
                    this.format.hasMonth ? this.showView(1) : (l.addClass(o.pickedClass).siblings().removeClass(o.pickedClass), this.hideView()), this.pick("year");
                    break;
                case "year":
                    i = parseInt(l.text(), 10), this.date = new Date(i, s, C(a, 28)), this.format.hasMonth ? (this.viewDate = new Date(i, s, C(a, 28)), this.showView(1)) : (l.addClass(o.pickedClass).siblings().removeClass(o.pickedClass), this.hideView()), this.pick("year");
                    break;
                case "month prev":
                case "month next":
                    s = "month prev" === r ? s - 1 : "month next" === r ? s + 1 : s, this.viewDate = new Date(i, s, C(a, 28)), this.fillDays();
                    break;
                case "month current":
                    this.format.hasMonth && this.showView(1);
                    break;
                case "month picked":
                    this.format.hasDay ? this.showView(0) : (l.addClass(o.pickedClass).siblings().removeClass(o.pickedClass), this.hideView()), this.pick("month");
                    break;
                case "month":
                    s = t.inArray(l.text(), o.monthsShort), this.date = new Date(i, s, C(a, 28)), this.format.hasDay ? (this.viewDate = new Date(i, s, C(a, 28)), this.showView(0)) : (l.addClass(o.pickedClass).siblings().removeClass(o.pickedClass), this.hideView()), this.pick("month");
                    break;
                case "day prev":
                case "day next":
                case "day":
                    s = "day prev" === r ? s - 1 : "day next" === r ? s + 1 : s, a = parseInt(l.text(), 10), this.date = new Date(i, s, a), l.addClass(o.pickedClass).siblings().removeClass(o.pickedClass), "day" === r && this.hideView(), this.pick("day");
                    break;
                case "day picked":
                    l.addClass(o.pickedClass).siblings().removeClass(o.pickedClass), this.hideView(), this.pick("day")
            }
        },
        clickDoc: function(t) {
            for (var e, i = t.target, s = this.$element[0], a = this.$trigger[0]; i !== p;) {
                if (i === a || i === s) {
                    e = !0;
                    break
                }
                i = i.parentNode
            }
            e || this.hide()
        },
        keyup: function() {
            this.update()
        },
        keyupDoc: function(t) {
            this.isInput && t.target !== this.$element[0] && this.isShown && ("Tab" === t.key || 9 === t.keyCode) && this.hide()
        },
        getValue: function() {
            var t = this.$element,
                e = "";
            return this.isInput ? e = t.val() : this.isInline ? this.options.container && (e = t.text()) : e = t.text(), e
        },
        setValue: function(t) {
            var e = this.$element;
            t = i(t) ? t : "", this.isInput ? e.val(t) : this.isInline ? this.options.container && e.text(t) : e.text(t)
        },
        show: function() {
            this.isBuilt || this.build(), this.isShown || this.trigger("show.datepicker").isDefaultPrevented() || (this.isShown = !0, this.$picker.removeClass(D).on(m, t.proxy(this.click, this)), this.showView(this.options.startView), this.isInline || (u.on("resize.datepicker", this._place = r(this.place, this)), f.on(m, this._clickDoc = r(this.clickDoc, this)), f.on("keyup.datepicker", this._keyupDoc = r(this.keyupDoc, this)), this.place()))
        },
        hide: function() {
            this.isShown && (this.trigger("hide.datepicker").isDefaultPrevented() || (this.isShown = !1, this.$picker.addClass(D).off(m, this.click), this.isInline || (u.off("resize.datepicker", this._place), f.off(m, this._clickDoc), f.off("keyup.datepicker", this._keyupDoc))))
        },
        toggle: function() {
            this.isShown ? this.hide() : this.show()
        },
        update: function() {
            var t = this.getValue();
            t !== this.oldValue && (this.setDate(t, !0), this.oldValue = t)
        },
        pick: function(t) {
            var e = this.$element,
                i = this.date;
            this.trigger("pick.datepicker", {
                view: t || "",
                date: i
            }).isDefaultPrevented() || (this.setValue(i = this.formatDate(this.date)), this.isInput && e.trigger("change"))
        },
        reset: function() {
            this.setDate(this.initialDate, !0), this.setValue(this.initialValue), this.isShown && this.showView(this.options.startView)
        },
        getMonthName: function(e, i) {
            var n = this.options,
                h = n.months;
            return t.isNumeric(e) ? e = g(e) : a(i) && (i = e), i === !0 && (h = n.monthsShort), h[s(e) ? e : this.date.getMonth()]
        },
        getDayName: function(e, i, n) {
            var h = this.options,
                r = h.days;
            return t.isNumeric(e) ? e = g(e) : (a(n) && (n = i), a(i) && (i = e)), r = n === !0 ? h.daysMin : i === !0 ? h.daysShort : r, r[s(e) ? e : this.date.getDay()]
        },
        getDate: function(t) {
            var e = this.date;
            return t ? this.formatDate(e) : new Date(e)
        },
        setDate: function(e, s) {
            var a = this.options.filter;
            if (n(e) || i(e)) {
                if (e = this.parseDate(e), t.isFunction(a) && a.call(this.$element, e) === !1) return;
                this.date = e, this.viewDate = new Date(e), s || this.pick(), this.isBuilt && this.fillAll()
            }
        },
        setStartDate: function(t) {
            (n(t) || i(t)) && (this.startDate = this.parseDate(t), this.isBuilt && this.fillAll())
        },
        setEndDate: function(t) {
            (n(t) || i(t)) && (this.endDate = this.parseDate(t), this.isBuilt && this.fillAll())
        },
        parseDate: function(t) {
            var e, s, a, h, r, l, o = this.format,
                d = [];
            if (n(t)) return new Date(t.getFullYear(), t.getMonth(), t.getDate());
            if (i(t) && (d = t.match(/\d+/g) || []), t = new Date, s = t.getFullYear(), a = t.getDate(), h = t.getMonth(), e = o.parts.length, d.length === e)
                for (l = 0; l < e; l++) switch (r = parseInt(d[l], 10) || 1, o.parts[l]) {
                    case "dd":
                    case "d":
                        a = r;
                        break;
                    case "mm":
                    case "m":
                        h = r - 1;
                        break;
                    case "yy":
                        s = 2e3 + r;
                        break;
                    case "yyyy":
                        s = r
                }
            return new Date(s, h, a)
        },
        formatDate: function(t) {
            var e, i, s, a, h, r = this.format,
                l = "";
            if (n(t))
                for (l = r.source, i = t.getFullYear(), a = {
                        d: t.getDate(),
                        m: t.getMonth() + 1,
                        yy: i.toString().substring(2),
                        yyyy: i
                    }, a.dd = (a.d < 10 ? "0" : "") + a.d, a.mm = (a.m < 10 ? "0" : "") + a.m, e = r.parts.length, h = 0; h < e; h++) s = r.parts[h], l = l.replace(s, a[s]);
            return l
        },
        destroy: function() {
            this.unbind(), this.unbuild(), this.$element.removeData(w)
        }
    }, c.LANGUAGES = {}, c.DEFAULTS = {
        autoShow: !1,
        autoHide: !1,
        autoPick: !1,
        inline: !1,
        container: null,
        trigger: null,
        language: "",
        format: "mm/dd/yyyy",
        date: null,
        startDate: null,
        endDate: null,
        startView: 0,
        weekStart: 0,
        yearFirst: !1,
        yearSuffix: "",
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        itemTag: "li",
        mutedClass: "muted",
        pickedClass: "picked",
        disabledClass: "disabled",
        highlightedClass: "highlighted",
        template: '<div class="datepicker-container"><div class="datepicker-panel" data-view="years picker"><ul><li data-view="years prev">&lsaquo;</li><li data-view="years current"></li><li data-view="years next">&rsaquo;</li></ul><ul data-view="years"></ul></div><div class="datepicker-panel" data-view="months picker"><ul><li data-view="year prev">&lsaquo;</li><li data-view="year current"></li><li data-view="year next">&rsaquo;</li></ul><ul data-view="months"></ul></div><div class="datepicker-panel" data-view="days picker"><ul><li data-view="month prev">&lsaquo;</li><li data-view="month current"></li><li data-view="month next">&rsaquo;</li></ul><ul data-view="week"></ul><ul data-view="days"></ul></div></div>',
        offset: 10,
        zIndex: 1e3,
        filter: null,
        show: null,
        hide: null,
        pick: null
    }, c.setDefaults = function(e) {
        e = t.isPlainObject(e) ? e : {}, e.language && (e = t.extend({}, c.LANGUAGES[e.language], e)), t.extend(c.DEFAULTS, e)
    }, c.other = t.fn.datepicker, t.fn.datepicker = function(e) {
        var s, n = h(arguments, 1);
        return this.each(function() {
            var a, h, r = t(this),
                l = r.data(w);
            if (!l) {
                if (/destroy/.test(e)) return;
                a = t.extend({}, r.data(), t.isPlainObject(e) && e), r.data(w, l = new c(this, a))
            }
            i(e) && t.isFunction(h = l[e]) && (s = h.apply(l, n))
        }), a(s) ? this : s
    }, t.fn.datepicker.Constructor = c, t.fn.datepicker.languages = c.LANGUAGES, t.fn.datepicker.setDefaults = c.setDefaults, t.fn.datepicker.noConflict = function() {
        return t.fn.datepicker = c.other, this
    }
});