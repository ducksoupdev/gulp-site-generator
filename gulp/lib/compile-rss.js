"use strict";

var fs = require("fs"),
    Promise = require("bluebird"),
    glob = require("glob"),
    moment = require("moment"),
    RSS = require("rss"),
    dates = require("../lib/dates"),
    resolvePaths = require("../lib/paths"),
    compileDrafts = require("../lib/drafts");

module.exports = function (rootPath) {
    return new Promise(function(resolve, reject) {
        var siteData = JSON.parse(fs.readFileSync(rootPath + "/site.json", "utf8"));
        var gulpVersion = require("gulp/package").version;

        glob(rootPath + "/build/content/posts/*.json", {
            cwd: "."
        }, function (err, files) {
            if (err) {
                reject(err);
            } else {
                var posts = [];

                files.forEach(function (file) {
                    var fileData = JSON.parse(fs.readFileSync(file, "utf8"));

                    if (fileData.status && fileData.status === "draft" && !compileDrafts()) {
                        return;
                    }

                    var metaData = {
                        title: fileData.title,
                        description: resolvePaths.resolve(fileData.body, siteData.url),
                        url: siteData.url + "/" + fileData.slug + "/",
                        tags: (fileData.tags ? (fileData.tags.split ? fileData.tags.split(" ") : fileData.tags) : undefined), // tags can be either string or array
                        date: fileData.date
                    };

                    posts.push(metaData);
                });

                if (posts.length) {

                    var feed = new RSS({
                        title: siteData.title,
                        description: siteData.description,
                        generator: "Gulp " + gulpVersion,
                        site_url: siteData.url,
                        feed_url: siteData.url + "/rss.xml",
                        ttl: 60
                    });

                    posts.sort(dates.sortFunc);

                    posts.forEach(function (item) {
                        feed.item({
                            title: item.title,
                            description: item.description,
                            url: item.url,
                            guid: item.url,
                            categories: item.tags,
                            date: moment(item.date, "YYYY-MM-DD").toDate()
                        });
                    });

                    var xml = feed.xml();

                    fs.writeFile(rootPath + "/build/rss.xml", xml, {
                        encoding: "utf8"
                    }, function (err) {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                } else {
                    resolve();
                }
            }
        });
    });
};
