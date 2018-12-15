var ajaxContent = {};

ajaxContent.functions = {};

/**
 * Get object content
 *
 * @param $item
 * @returns {{ajaxContentUrl: null, ajaxContentErrorClass: string, ajaxContentLoadClass: string, ajaxContentLoadEvent: string, ajaxContentRetry: number, ajaxContentResponseType: string, ajaxContentResponseContentField: string}}
 */
ajaxContent.functions.collectOptions = function ($item) {
    var $options = {
        ajaxContentUrl: null,
        ajaxContentErrorClass: 'error',
        ajaxContentLoadClass: 'loading',
        ajaxContentLoadEvent: 'load',
        ajaxContentRetry: 3,
        ajaxContentResponseType: 'content',
        ajaxContentResponseContentField: 'content',
        ajaxContentButtonLoaderTemplate: '<div class="ajax-content" data-ajax-content-url="{url}"></div>',
        ajaxContentButtonLocation: null,
    };
    jQuery.extend($options, $item.data());
    return $options;
};

/**
 * Load Ajax content
 * @param $item
 * @param $options
 */
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
                    $item,
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
                        $item,
                        $response
                    ]);
                }
            }
        });
    };
    $item.trigger('loading', [
        $item
    ]);
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

    jQuery("body").on("click", ".ajax-content-btn", function () {

        var $t = jQuery(this);

        var $options = ajaxContent.functions.collectOptions($t);

        var $div = $options.ajaxContentButtonLoaderTemplate;

        $div = $div.replace(/{url}/g, $options.ajaxContentUrl);

        $div = jQuery($div);

        if ($options.ajaxContentButtonLocation) {
            jQuery($options.ajaxContentButtonLocation).append($div);
        } else {
            $t.after($div);
        }

        $div.ajaxLoad();
    });

});