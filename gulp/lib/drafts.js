/* global process */
"use strict";

var minimist = require("minimist");

var knownOptions = {
    string: "compile",
    default: {
        compile: "published"
    }
};

var options = minimist(process.argv.slice(2), knownOptions);

module.exports = function () {
    if (options.compile === "published") {
        return false;
    }

    return true;
};
