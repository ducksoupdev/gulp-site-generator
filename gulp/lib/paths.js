"use strict";

module.exports = {
    resolve: function (html, path) {

        // images
        html = html.replace(/<img(.+)?src="([^"]+)"(.*)?>/gim, function (match, p1, p2, p3, offset, s) {
            var imagePath = p2;
            if (/^\//.test(imagePath)) {
                imagePath = path + p2;
            }
            return "<img" + p1 + "src=\"" + imagePath + "\"" + p3 + ">";
        });

        // links
        html = html.replace(/<a(.+)?href="([^"]+)"(.*)?>/gim, function (match, p1, p2, p3, offset, s) {
            var linkPath = p2;
            if (/^\//.test(linkPath)) {
                linkPath = path + p2;
            }
            return "<a" + p1 + "href=\"" + linkPath + "\"" + p3 + ">";
        });

        return html;
    }
};
