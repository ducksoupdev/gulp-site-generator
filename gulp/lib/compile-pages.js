"use strict";

var gulp = require("gulp"),
    Promise = require("bluebird"),
    compileHandlebars = require("gulp-compile-handlebars"),
    rename = require("gulp-rename"),
    fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    moment = require("moment"),
    _ = require("lodash"),
    compileOptions = require("../lib/compile-options"),
    tags = require("../lib/tags"),
    dates = require("../lib/dates"),
    resolvePaths = require("../lib/paths"),
    compileDrafts = require("../lib/drafts"),
    promiseList = require("../lib/promises");

module.exports = function (rootPath) {
    return new Promise(function(resolve, reject) {
        var siteData = JSON.parse(fs.readFileSync(rootPath + "/site.json", "utf8"));
        var gulpVersion = require("gulp/package").version;
        var compileOptionsObj = compileOptions(rootPath);

        glob(rootPath + "/build/content/**/*.json", {
            cwd: "."
        }, function (err, files) {
            if (err) {
                reject(err);
            } else {
                var templatesToCreate = [],
                    posts = [];

                files.forEach(function (file) {
                    var fileData = JSON.parse(fs.readFileSync(file, "utf8"));

                    if (fileData.status && fileData.status === "draft" && !compileDrafts()) {
                        return;
                    }

                    // check and fill-in missing file meta data
                    fileData = compileOptionsObj.checkContent(fileData);

                    var tagClasses = tags.getTagClasses(fileData.tags);

                    var metaData = {
                        title: fileData.title,
                        body: resolvePaths.resolve(fileData.body, ".."),
                        url: "../" + fileData.slug + "/",
                        tagStr: fileData.tags,
                        tags: (fileData.tags ? tags.getTagsAsLinks("..", fileData.tags) : undefined),
                        date: fileData.date,
                        post_class: "post " + (fileData.template === "page.hbs" ? "page " : "") + (fileData.tags ? tagClasses : fileData.slug),
                        author: (fileData.author ? siteData.authors[fileData.author] : ""),
                        meta: fileData
                    };

                    if (fileData.date && fileData.template === "post.hbs") {
                        posts.push(metaData);
                    }

                    // post class
                    var bodyClass = "post-template";
                    if (fileData.template === "page.hbs") {
                        bodyClass += " page-template page";
                    }

                    // tags
                    if (fileData.tags) {
                        bodyClass += tagClasses;
                    }

                    var templateData = {
                        date: moment().format("YYYY-MM-DD"),
                        resourcePath: "..",
                        generator: "Gulp " + gulpVersion,
                        meta_title: fileData.title,
                        url: "..",
                        site: siteData,
                        post: metaData,
                        body_class: bodyClass,
                        rss: ".." + siteData.rss
                    };

                    var outDir = rootPath + "/build/" + path.basename(file).replace(/\.[^/.]+$/, "");

                    templatesToCreate.push({
                        outDir: outDir,
                        templateSrc: rootPath + "/src/templates/" + fileData.template,
                        templateData: templateData
                    });

                });

                if (templatesToCreate.length) {
                    var promises = [];
                    templatesToCreate.forEach(function (templateToCreate) {
                        _.extend(templateToCreate.templateData.post, {
                            site: siteData,
                            allDates: dates.getAllDatesAsLinks("..", posts),
                            allTags: tags.getAllTagsAsLinks("..", posts)
                        });

                        promises.push(new Promise(function (resolve, reject) {
                            gulp.src(templateToCreate.templateSrc)
                                .pipe(compileHandlebars(templateToCreate.templateData, compileOptionsObj))
                                .pipe(rename("index.html"))
                                .pipe(gulp.dest(templateToCreate.outDir))
                                .on("error", reject)
                                .on("end", resolve);
                        }));
                    });

                    Promise.all(promiseList.filter(promises))
                        .then(function () {
                            resolve();
                        }, function (err) {
                            reject(err);
                        });
                } else {
                    resolve();
                }
            }
        });
    });
};
