(function () {
    'use strict';

    module.exports = {
        getTagClasses: function (tagStr) {
            if (!tagStr) {
                return undefined;
            }
            var tags = tagStr.split(' ');
            var classStr = '';
            tags.forEach(function (tag) {
                classStr += ' tag-' + tag
            });
            return classStr;
        },
        getTagsAsLinks: function (path, tagStr) {
            if (!tagStr) {
                return undefined;
            }
            var tags = tagStr.split(' ');
            var tagLinks = [];
            tags.forEach(function (tag) {
                tagLinks.push('<a href="' + path + '/tag/' + tag + '">' + tag + '</a>');
            });
            return tagLinks.join(', ');
        },
        getTagAsLink: function (path, tag) {
            if (!tag) {
                return undefined;
            }
            return '<a href="' + path + '/tag/' + tag + '">' + tag + '</a>';
        },
        getAllTagsAsLinks: function (path, posts) {
            var allTags = {}, allTagsArray = [], self = this;
            posts.forEach(function (post) {
                if (post.tagStr) {
                    var tagList = post.tagStr.split(' ');
                    tagList.forEach(function (tag) {
                        if (!allTags[tag]) {
                            allTags[tag] = path + '/tag/' + tag;
                        }
                    });
                }
            });
            var keys = Object.keys(allTags);
            if (keys.length) {
                keys.sort();
                keys.forEach(function (key) {
                    allTagsArray.push({
                        tag: key,
                        tagLink: allTags[key]
                    });
                });
            }
            return allTagsArray;
        }
    };
})();
