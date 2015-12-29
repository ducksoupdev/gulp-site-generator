"use strict";

var tagObjToArray = function (tagObj) {
    var tags = [];
    if (tagObj) {
        if (typeof tagObj === "string" || tagObj instanceof String) {
            tags = tagObj.split(" ");
        } else if (Array.isArray(tagObj)) {
            tags = tagObj;
        }
    }
    return tags;
};

module.exports = {
    getTagClasses: function (tagObj) {
        var tags = tagObjToArray(tagObj);
        if (!tags.length) {
            return undefined;
        }
        var classStr = "";
        tags.forEach(function (tag) {
            classStr += " tag-" + tag;
        });
        return classStr;
    },
    getTagsAsLinks: function (path, tagObj) {
        var tags = tagObjToArray(tagObj);
        if (!tags.length) {
            return undefined;
        }
        var tagLinks = [];
        tags.forEach(function (tag) {
            tagLinks.push("<a href=\"" + path + "/tag/" + tag + "\">" + tag + "</a>");
        });
        return tagLinks.join(", ");
    },
    getTagAsLink: function (path, tag) {
        if (!tag) {
            return undefined;
        }
        return "<a href=\"" + path + "/tag/" + tag + "\">" + tag + "</a>";
    },
    getAllTagsAsLinks: function (path, posts) {
        var allTags = {}, allTagsArray = [], self = this;
        posts.forEach(function (post) {
            if (post.tagStr) {
                var tagList = tagObjToArray(post.tagStr);
                tagList.forEach(function (tag) {
                    if (!allTags[tag]) {
                        allTags[tag] = path + "/tag/" + tag;
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
