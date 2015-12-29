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
    var compilePromises = [];

    // pages
    compilePromises.push(new Promise(function (resolve, reject) {
        compilePages.run(".", resolve, reject);
    }));

    // tags
    compilePromises.push(new Promise(function (resolve, reject) {
        compileTags.run(".", resolve, reject);
    }));

    // dates
    compilePromises.push(new Promise(function (resolve, reject) {
        compileDates.run(".", resolve, reject);
    }));

    // rss feed compilation
    compilePromises.push(new Promise(function (resolve, reject) {
        compileRss.run(".", resolve, reject);
    }));

    // index page generation
    compilePromises.push(new Promise(function (resolve, reject) {
        compileHome.run(".", resolve, reject);
    }));

    Promise.all(compilePromises)
        .then(function () {
            removeDir("./build/content");
            done();
        }, function () {
            // call done even if there are errors
            done();
        });
});

