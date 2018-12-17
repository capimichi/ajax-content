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
        ajaxContentButtonLoaderTemplate: '<div class="ajax-content" data-ajax-content-url="{url}"><button class="ajax-content-close-btn" data-target="parent">Close</button><div class="ajax-content-inner">{content}</div></div>',
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

                var $content = "";

                if ($options.ajaxContentResponseType === "content") {
                    $content = $response;
                }
                if ($options.ajaxContentResponseType === "json") {
                    $content = $response[$options.ajaxContentResponseContentField];
                }
                if ($item.html().match(/{content}/is)) {
                    $item.html($item.html().replace(/{content}/g, $content));
                } else {
                    $item.html($content);
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

        console.log($options);

        var $div = $options.ajaxContentButtonLoaderTemplate;

        $div = $div
            .replace(/{url}/g, $options.ajaxContentUrl)
        ;

        $div = jQuery($div);

        if ($options.ajaxContentButtonLocation) {
            jQuery($options.ajaxContentButtonLocation).append($div);
        } else {
            $t.after($div);
        }

        $div.ajaxLoad();
    });

    jQuery("body").on("click", ".ajax-content-close-btn", function () {
        var $t = jQuery(this);

        var $targetName = $t.data("target");

        if ($targetName === "parent") {
            $t.parent().remove();
        } else {
            jQuery($targetName).remove();
        }
    });
});