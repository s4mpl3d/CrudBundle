var whatwedo_ajax = {

    listen: null,
    noListen: null,
    callback: null,

    setListen: function (l) {
        this.listen = l;
    },
    setNoListen: function (n) {
        this.noListen = n;
    },
    setCallback: function (c) {
        this.callback = c;
    },

    formPrefix: '#form_',

    start: function () {
        var _ = this;
        $(this.listen).each(function ($i) {
            $(_.form($i)).on('change', function () {
                _.sendChange();
            });
        })
    },

    sendChange: function () {
        var _ = this;
        var vals = [];
        $(this.noListen).each(function ($i) {
            if ($(_.form($i)) ["0"].className.includes("ajax_date")) {
                vals[$i] = {
                    key: _.noListen[$i],
                    value: {
                        day: $(_.form($i)) ["0"].children["form[" + _.noListen[$i] + "][day]"].value,
                        month: $(_.form($i)) ["0"].children["form[" + _.noListen[$i] + "][month]"].value,
                        year: $(_.form($i)) ["0"].children["form[" + _.noListen[$i] + "][year]"].value,
                    }
                }
            } else {
                vals[$i] = {
                    key: _.noListen[$i],
                    value: $(_.form($i)).val()
                };
            }
        });
        var data = {data: vals};
        $.ajax({
            type: 'POST',
            url: _.callback,
            data: data,
            dataType: 'text',
            success: function (respond) {
                _.process($.parseJSON(respond));
            }
        });
    },

    process: function (respond) {
        var _ = this;
        $(this.noListen).each(function ($i) {
            if (respond.data[_.noListen[$i]] != undefined) {
                var c = respond.data[_.noListen[$i]];
                var formEle = $(_.form($i));

                if (formEle.is('textarea')) {
                    formEle.data("wysihtml5").editor.setValue(c.data)
                }
                if (c.values != null && formEle.is('select')) {
                    formEle.find('option').remove();
                    for (var key in c.values) {
                        if (c.values.hasOwnProperty(key)) {
                            var keyValue = key;
                            var s = parseInt(c.value) === parseInt(key) ? 'selected' : '';
                            if (key === '-' && c.value === null) {
                                s = 'selected';
                                keyValue = '';
                            }
                            formEle.append('<option '+ s +' value="' + keyValue + '">' + c.values[key] + '</option>')
                        }
                    }
                } else {
                    formEle.val(c.value);
                }
                if (formEle.is('[data-ajax-trigger]')) {
                    formEle.trigger('change');
                }
            }
        })
    },

    form: function ($i) {
        return this.formPrefix + this.noListen[$i];
    }
};
$(document).ready(function () {
    if (!(typeof whatwedo_ajax_listen === 'undefined' && typeof whatwedo_ajax_no_listen === 'undefined' && typeof whatwedo_ajax_callback === 'undefined')) {
        whatwedo_ajax.setListen(whatwedo_ajax_listen);
        whatwedo_ajax.setNoListen(whatwedo_ajax_no_listen);
        whatwedo_ajax.setCallback(whatwedo_ajax_callback);
        whatwedo_ajax.start();
        whatwedo_ajax.sendChange();
    }
});