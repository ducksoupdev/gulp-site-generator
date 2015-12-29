"use strict";

var fs = require("fs");

var rmDir = function (dirPath, removeSelf) {
    if (removeSelf === undefined) {
        removeSelf = true;
    }
    var files = [];
    try {
        files = fs.readdirSync(dirPath);
    } catch (e) {
        return e;
    }

    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + "/" + files[i];
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                rmDir(filePath);
            }
        }
    }
    if (removeSelf) {
        fs.rmdirSync(dirPath);
    }
};

module.exports = rmDir;
