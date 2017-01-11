"use strict";

var moment = require("moment"),
    _ = require("lodash"),
    downsize = require("downsize"),
    downzero = require("./downzero"),
    stringUtils = require("mout/string");

module.exports = function (rootPath) {
    return {
        batch: [rootPath + "/src/templates/partials"],
        checkContent: function (fileData) {
            var excerpt = stringUtils.stripHtmlTags(fileData.body);
            excerpt = excerpt.replace(/(\r\n|\n|\r)+/gm, " ");
            var title = downsize(excerpt, { words: 10 });

            if (!fileData.title) {
                fileData.title = title;
            }

            if (!fileData.slug) {
                fileData.slug = stringUtils.slugify(fileData.title, "-");
            }

            if (!fileData.template && !fileData.date) {
                fileData.template = "page.hbs";
            } else if (fileData.date && !fileData.template) {
                fileData.template = "post.hbs";
            }

            return fileData;
        },
        helpers: {
            date: function (context, options) {
                if (!options && context.hasOwnProperty("hash")) {
                    options = context;
                    context = undefined;

                    // set to published_at by default, if it"s available
                    // otherwise, this will print the current date
                    if (this.date) {
                        context = this.date;
                    }
                }

                // ensure that context is undefined, not null, as that can cause errors
                context = context === null ? undefined : context;

                var format = options.hash.format || "MMM Do, YYYY";
                var date = moment(context, "YYYY-MM-DD").format(format);

                return date;
            },
            excerpt: function (options) {
                var truncateOptions = (options || {}).hash || {},
                    excerpt;

                truncateOptions = _.pick(truncateOptions, ["words", "characters"]);
                _.keys(truncateOptions).map(function (key) {
                    truncateOptions[key] = parseInt(truncateOptions[key], 10);
                });

                excerpt = stringUtils.stripHtmlTags(this.description);
                excerpt = excerpt.replace(/(\r\n|\n|\r)+/gm, " ");

                if (!truncateOptions.words && !truncateOptions.characters) {
                    truncateOptions.words = 50;
                }

                return downsize(excerpt, truncateOptions);
            },
            content: function (options) {
                var truncateOptions = (options || {}).hash || {};
                truncateOptions = _.pick(truncateOptions, ["words", "characters"]);
                _.keys(truncateOptions).map(function (key) {
                    truncateOptions[key] = parseInt(truncateOptions[key], 10);
                });

                if (truncateOptions.hasOwnProperty("words") || truncateOptions.hasOwnProperty("characters")) {
                    // Legacy function: {{content words="0"}} should return leading tags.
                    if (truncateOptions.hasOwnProperty("words") && truncateOptions.words === 0) {
                        return downzero(this.description);
                    }

                    return downsize(this.description, truncateOptions);
                }

                return this.description;
            },
            resolve: function (path) {
                if (path && this.resourcePath && this.resourcePath !== "") {
                    return this.resourcePath + path;
                }
                if (/^\//.test(path)) {
                    path = path.substring(1);
                }
                return "" + path;
            },
            or: function (v1, v2) {
                return v1 || v2;
            }
        }
    };
};
