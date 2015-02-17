(function () {
    "use strict";

    var moment = require("moment"),
        _ = require("lodash"),
        downsize = require("downsize"),
        downzero = require("./downzero");

    module.exports = function(rootPath) {
        return {
            batch: [rootPath + "/src/templates/partials"],
            helpers : {
                date: function(context, options) {
                    if (!options && context.hasOwnProperty("hash")) {
                        options = context;
                        context = undefined;

                        // set to published_at by default, if it's available
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

                    excerpt = String(this.description).replace(/<\/?[^>]+>/gi, "");
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
                resolve: function(path) {
                    if (path && this.resourcePath && this.resourcePath !== "") {
                        return this.resourcePath + path;
                    }
                    return "." + path;
                }
            }
        };
    };
})();
