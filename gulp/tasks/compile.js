"use strict";

var gulp = require("gulp"),
    Promise = require("bluebird"),
    compileRss = require("../lib/compile-rss"),
    compileHome = require("../lib/compile-home"),
    compilePages = require("../lib/compile-pages"),
    compileTags = require("../lib/compile-tags"),
    compileDates = require("../lib/compile-dates"),
    removeDir = require("../lib/remove-dir");

gulp.task("compile", ["content"], function (done) {
    var rootPath = ".";
    var compilePromises = [];

    // pages
    compilePromises.push(compilePages(rootPath));

    // tags
    compilePromises.push(compileTags(rootPath));

    // dates
    compilePromises.push(compileDates(rootPath));

    // rss feed compilation
    compilePromises.push(compileRss(rootPath));

    // index page generation
    compilePromises.push(compileHome(rootPath));

    Promise.all(compilePromises)
        .then(function () {
            removeDir("./build/content");
            done();
        }, function () {
            // call done even if there are errors
            done();
        });
});

