var ajaxContent = {};

ajaxContent.functions = {};

ajaxContent.functions.collectOptions = function ($item) {
    var $options = {
        ajaxContentUrl: null,
        ajaxContentErrorClass: 'error',
        ajaxContentLoadClass: 'loading',
        ajaxContentLoadEvent: 'load',
        ajaxContentRetry: 3,
        ajaxContentResponseType: 'content',
        ajaxContentResponseContentField: 'content'
    };
    jQuery.extend($options, $item.data());
    return $options;
};

ajaxContent.functions.loadContent = function ($item, $options) {
    $item.addClass($options.ajaxContentLoadClass);
    var $retries = 0;
    ajaxContent.functions.loadContent.load = function () {
        jQuery.ajax({
            url: $options.ajaxContentUrl,
            success: function ($response) {
                if ($options.ajaxContentResponseType === "content") {
                    $item.html($response);
                }
                if ($options.ajaxContentResponseType === "json") {
                    $item.html($response[$options.ajaxContentResponseContentField]);
                }
                $item.removeClass($options.ajaxContentLoadClass);
                $item.trigger('loaded', [
                    $response
                ]);
            },
            error: function ($response) {
                if ($retries < $options.ajaxContentRetry) {
                    $retries++;
                    ajaxContent.functions.loadContent.load();
                } else {
                    $item.removeClass($options.ajaxContentLoadClass);
                    $item.addClass($options.ajaxContentErrorClass);
                    $item.trigger('error', [
                        $response
                    ]);
                }
            }
        });
    };
    $item.trigger('loading');
    ajaxContent.functions.loadContent.load();
};

jQuery(function ($) {

    $.fn.ajaxLoad = function () {
        var $t = jQuery(this);
        var $options = ajaxContent.functions.collectOptions($t);
        ajaxContent.functions.loadContent($t, $options);
    };


    jQuery(".ajax-content").each(function () {

        var $t = jQuery(this);

        var $options = ajaxContent.functions.collectOptions($t);

        if ($options.ajaxContentLoadEvent === "load") {
            ajaxContent.functions.loadContent($t, $options);
        }
    });
});