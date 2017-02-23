"use strict";

module.exports = {
    /**
     * Method to update all image and hyperlink URLs to paths relative to the site root
     * @param {String} html The HTML containing images and hyperlinks
     * @param {String} path The path to the site root
     * @returns {String} The HTML with images and hyperlinks updated
     */
    resolve: function (html, path) {

        // images
        html = html.replace(/<img(.+)?src="([^"]+)"(.*)?>/gim, function (match, p1, p2, p3) {
            var imagePath = p2;
            if (/^\//.test(imagePath)) {
                imagePath = path + (path === "" ? p2.substring(1) : p2);
            }
            return "<img" + p1 + "src=\"" + imagePath + "\"" + p3 + ">";
        });

        // links
        html = html.replace(/<a(.+)?href="([^"]+)"(.*)?>/gim, function (match, p1, p2, p3) {
            var linkPath = p2;
            if (/^\//.test(linkPath)) {
                linkPath = path + (path === "" ? p2.substring(1) : p2);
            }
            return "<a" + p1 + "href=\"" + linkPath + "\"" + p3 + ">";
        });

        return html;
    }
};
