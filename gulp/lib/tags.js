(function () {
    "use strict";

    module.exports = {
        getTagClasses: function (tagStr) {
            if (!tagStr) {
                return undefined;
            }
            var tags = tagStr.split(" ");
            var classStr = "";
            tags.forEach(function (tag) {
                classStr += " tag-" + tag
            });
            return classStr;
        },
        getTagsAsLinks: function(path, tagStr) {
            if (!tagStr) {
                return undefined;
            }
            var tags = tagStr.split(" ");
            var tagLinks = [];
            tags.forEach(function (tag) {
                tagLinks.push("<a href=\"" + path + "/tag/" + tag + "\">" + tag + "</a>");
            });
            return tagLinks.join(", ");
        }
    };
})();
