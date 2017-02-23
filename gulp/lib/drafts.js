"use strict";

var minimist = require("minimist");

var knownOptions = {
    string: "compile",
    default: {
        compile: "drafts"
    }
};

var options = minimist(process.argv.slice(2), knownOptions);

module.exports = function () {
    if (options.compile === "published") {
        return false;
    }

    if (process.env.GSD_PUBLISHED != null && process.env.GSD_PUBLISHED !== "") {
        return false;
    }

    return true;
};
