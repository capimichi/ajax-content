jQuery(function () {
    var $ajaxContent = {};
    $ajaxContent.loaders = {
        oval: '<!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL --> <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"> <g fill="none" fill-rule="evenodd"> <g transform="translate(1 1)" stroke-width="2"> <circle stroke-opacity=".5" cx="18" cy="18" r="18"/> <path d="M36 18c0-9.94-8.06-18-18-18"> <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/> </path> </g> </g> </svg>'
    };
    $ajaxContent.utils = {};
    $ajaxContent.functions = {};

    $ajaxContent.utils.hasAttr = function ($obj, $attrName) {
        var $attr = $obj.attr($attrName);
        if (typeof $attr !== typeof undefined && $attr !== false) {
            return true;
        }
        return false;
    };

    jQuery(".ajax-content").each(function () {

        var $t = jQuery(this);

        var $loaderImage = $ajaxContent.loaders.oval;
        var $loaderHeight = $ajaxContent.utils.hasAttr($t, 'data-loader-height') ? $t.attr('data-loader-height') : '200px';
        var $loaderWidth = $ajaxContent.utils.hasAttr($t, 'data-loader-height') ? $t.attr('data-loader-height') : '100%';
        var $maxRetry = $ajaxContent.utils.hasAttr($t, 'data-max-retry') ? parseInt($t.attr('data-max-retry')) : 5;

        $t.empty();

        var $loaderHtml = '<div class="ajax-content-loader" style="line-height: ' + $loaderHeight + '; height: ' + $loaderHeight + '; width: ' + $loaderWidth + ';">' + $loaderImage + '</div>';

        $t.html($loaderHtml);

        $ajaxContent.functions.loadContent = function ($object) {

            var $url = $t.attr('data-ajax-url');

            if ($maxRetry > 0) {
                $maxRetry--;
                jQuery.ajax({
                    url: $url,
                    error: function () {
                        $ajaxContent.functions.loadContent($object);
                    }
                }).done(function ($response) {
                    $object.html($response);
                });
            }
        };

        $ajaxContent.functions.loadContent($t);
    });
});