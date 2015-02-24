(function () {
    'use strict';

    var gulp = require('gulp'),
        Promise = require('bluebird'),
        compileHandlebars = require('gulp-compile-handlebars'),
        rename = require('gulp-rename'),
        fs = require('fs'),
        path = require('path'),
        glob = require('glob'),
        moment = require('moment'),
        compileOptions = require('../lib/compile-options'),
        tags = require('../lib/tags'),
        resolvePaths = require('../lib/paths'),
        compileDrafts = require('../lib/drafts'),
        promiseList = require('../lib/promises');

    module.exports.run = function(rootPath, done, error) {
        var siteData = JSON.parse(fs.readFileSync(rootPath + '/site.json', 'utf8'));
        var gulpVersion = require('gulp/package').version;
        var compileOptionsObj = compileOptions(rootPath);

        glob(rootPath + '/build/content/**/*.json', { cwd: rootPath }, function(err, files) {
            if (err) {
                error(err);
            } else {
                var promises = [];

                files.forEach(function(file) {
                    var fileData = JSON.parse(fs.readFileSync(file, 'utf8'));

                    if (fileData.status && fileData.status === 'draft' && !compileDrafts()) {
                        return;
                    }

                    // check and fill-in missing file meta data
                    fileData = compileOptionsObj.checkContent(fileData);

                    var tagClasses = tags.getTagClasses(fileData.tags);

                    var metaData = {
                        title: fileData.title,
                        body: resolvePaths.resolve(fileData.body, '..'),
                        url: '../' + fileData.slug + '/',
                        tags: (fileData.tags ? tags.getTagsAsLinks('..', fileData.tags) : undefined),
                        date: fileData.date,
                        post_class: 'post ' + (/pages\//.test(file) ? 'page ' : '') + (fileData.tags ? tagClasses : fileData.slug),
                        author: (fileData.author ? siteData.authors[fileData.author] : ''),
                        meta: fileData
                    };

                    // post class
                    var bodyClass = 'post-template';
                    if (/pages\//.test(file)) {
                        bodyClass += ' page-template page';
                    }

                    // tags
                    if (fileData.tags) {
                        bodyClass += tagClasses;
                    }

                    var templateData = {
                        date: moment().format('YYYY-MM-DD'),
                        resourcePath: '..',
                        generator: 'Gulp ' + gulpVersion,
                        meta_title: fileData.title,
                        url: '..',
                        site: siteData,
                        post: metaData,
                        body_class: bodyClass,
                        rss: '..' + siteData.rss
                    };

                    var outDir = rootPath + '/build/' + path.basename(file).replace(/\.[^/.]+$/, '');

                    promises.push(new Promise(function(resolve, reject) {
                        gulp.src(rootPath + '/src/templates/' + fileData.template)
                            .pipe(compileHandlebars(templateData, compileOptionsObj))
                            .pipe(rename('index.html'))
                            .pipe(gulp.dest(outDir))
                            .on('error', reject)
                            .on('end', resolve);
                    }));
                });

                if (promises.length) {
                    Promise.all(promiseList.filter(promises))
                        .then(function () {
                            done();
                        }, function (err) {
                            error(err);
                        });
                } else {
                    done();
                }
            }
        });
    };
})();
