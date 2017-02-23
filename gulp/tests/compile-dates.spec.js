"use strict";

var compileDates = require("../lib/compile-dates"),
    removeDir = require("../lib/remove-dir"),
    expect = require("chai").expect,
    mockery = require("mockery"),
    Promise = require("bluebird"),
    sinon = require("sinon"),
    fs = require("fs");

describe("When compiling date pages", function () {
    var rootPath = ".tmp/compile-dates";
    var doneStub, errorStub;

    before(function () {
        doneStub = sinon.stub();
        errorStub = sinon.stub();

        // create the root path
        [
            ".tmp",
            ".tmp/compile-dates"
        ].forEach(function (dir) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });

        // set-up folders:
        [
            "/src",
            "/src/templates",
            "/src/templates/partials",
            "/build",
            "/build/date",
            "/build/date/page",
            "/build/content",
            "/build/content/pages",
            "/build/content/posts"
        ].forEach(function (dir) {
            if (!fs.existsSync(rootPath + dir)) {
                fs.mkdirSync(rootPath + dir);
            }
        });

        // set-up files:
        fs.writeFileSync(rootPath + "/site.json", "{\"title\":\"Test site\"}");
        fs.writeFileSync(rootPath + "/src/templates/partials/loop.hbs", "<ul>{{#each posts}}<li><a href=\"{{url}}\">{{title}}</a></li>{{/each}}</ul>");
        fs.writeFileSync(rootPath + "/src/templates/partials/pagination.hbs", "<ul><li><a href=\"{{#if nextUrl}}{{nextUrl}}{{else}}#{{/if}}\">Older</a></li><li><a href=\"{{#if prevUrl}}{{prevUrl}}{{else}}#{{/if}}\">Newer</a></li></ul>");
        fs.writeFileSync(rootPath + "/src/templates/index.hbs", "<div>Posts dated: {{dateStr}}{{> loop}}{{> pagination}}</div>");
    });

    after(function () {
        removeDir(rootPath);
    });

    describe("When compiling date pages", function () {
        before(function (done) {
            fs.writeFileSync(rootPath + "/build/content/posts/test-post1.json", "{\"slug\":\"test-post1\",\"title\":\"Test post 1\",\"date\":\"2014-06-11\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            fs.writeFileSync(rootPath + "/build/content/posts/test-post2.json", "{\"slug\":\"test-post2\",\"title\":\"Test post 2\",\"date\":\"2014-12-05\",\"tags\":\"mocha coke\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            compileDates(rootPath).then(done, errorStub);
        });

        it("Should create the June 2014 date page", function () {
            expect(fs.existsSync(rootPath + "/build/date/2014-06/index.html")).to.be.true;
        });

        it("Should create the December 2014 date page", function () {
            expect(fs.existsSync(rootPath + "/build/date/2014-12/index.html")).to.be.true;
        });

        it("Should have the correct date page content for June 2014", function () {
            var expectedHtml = "<div>" +
                "Posts dated: June 2014" +
                "<ul><li><a href=\"../../test-post1/\">Test post 1</a></li></ul>" +
                "<ul><li><a href=\"#\">Older</a></li><li><a href=\"#\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/date/2014-06/index.html", "utf8")).to.equal(expectedHtml);
        });

        it("Should have the correct date page content for December 2014", function () {
            var expectedHtml = "<div>" +
                "Posts dated: December 2014" +
                "<ul><li><a href=\"../../test-post2/\">Test post 2</a></li></ul>" +
                "<ul><li><a href=\"#\">Older</a></li><li><a href=\"#\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/date/2014-12/index.html", "utf8")).to.equal(expectedHtml);
        });
    });

    describe("When an error occurs with the promises", function () {
        var promisesListStub, newCompileDates;

        beforeEach(function (done) {
            errorStub.reset();

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.deregisterAll();

            promisesListStub = {
                filter: function () {
                    return [Promise.reject("An error occurred")];
                }
            };

            mockery.registerMock("../lib/promises", promisesListStub);

            newCompileDates = require("../lib/compile-dates");

            newCompileDates(rootPath).then(function () {
                done();
            }, function (err) {
                errorStub(err);
                done();
            });

        });

        it("Should call the error function", function () {
            expect(errorStub.called).to.be.true;
        });

        afterEach(function () {
            mockery.deregisterMock("../lib/promises");
            mockery.disable();
        });
    });

    describe("When compiling date pages and excluding draft templates", function () {
        var minimistStub, newCompileDates;
        
        before(function (done) {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });
            minimistStub = function () {
                return {
                    compile: "published"
                };
            };
            mockery.registerAllowable("../lib/drafts");
            mockery.registerMock("minimist", minimistStub);
            
            fs.writeFileSync(rootPath + "/build/content/posts/test-post1.json", "{\"slug\":\"test-post1\",\"title\":\"Test post 1\",\"date\":\"2014-06-11\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            fs.writeFileSync(rootPath + "/build/content/posts/test-post2.json", "{\"slug\":\"test-post2\",\"title\":\"Test post 2\",\"date\":\"2014-12-05\",\"status\":\"draft\",\"tags\":\"mocha coke\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            
            newCompileDates = require("../lib/compile-dates");
            
            newCompileDates(rootPath).then(done, errorStub);
        });

        after(function () {
            mockery.disable();
        });

        it("Should have the correct date page content for June 2014", function () {
            var expectedHtml = "<div>" +
                "Posts dated: June 2014" +
                "<ul><li><a href=\"../../test-post1/\">Test post 1</a></li></ul>" +
                "<ul><li><a href=\"#\">Older</a></li><li><a href=\"#\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/date/2014-06/index.html", "utf8")).to.equal(expectedHtml);
        });
    });

    describe("When compiling date posts with pagination", function () {
        before(function (done) {
            fs.writeFileSync(rootPath + "/site.json", "{ \"title\": \"Test site\", \"maxItems\": \"2\" }");
            fs.writeFileSync(rootPath + "/build/content/posts/test-post1.json", "{\"slug\":\"test-post1\",\"title\":\"Test post 1\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            fs.writeFileSync(rootPath + "/build/content/posts/test-post2.json", "{\"slug\":\"test-post2\",\"title\":\"Test post 2\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            fs.writeFileSync(rootPath + "/build/content/posts/test-post3.json", "{\"slug\":\"test-post3\",\"title\":\"Test post 3\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            fs.writeFileSync(rootPath + "/build/content/posts/test-post4.json", "{\"slug\":\"test-post4\",\"title\":\"Test post 4\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            fs.writeFileSync(rootPath + "/build/content/posts/test-post5.json", "{\"slug\":\"test-post5\",\"title\":\"Test post 5\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            fs.writeFileSync(rootPath + "/build/content/posts/test-post6.json", "{\"slug\":\"test-post6\",\"title\":\"Test post 6\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            fs.writeFileSync(rootPath + "/build/content/posts/test-post7.json", "{\"slug\":\"test-post7\",\"title\":\"Test post 7\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}");
            compileDates(rootPath).then(done, errorStub);
        });

        it("Should have the correct date page content for December 2014", function () {
            var expectedHtml = "<div>" +
                "Posts dated: December 2014" +
                "<ul><li><a href=\"../../test-post1/\">Test post 1</a></li><li><a href=\"../../test-post2/\">Test post 2</a></li></ul>" +
                "<ul><li><a href=\"../../date/2014-12/page/2\">Older</a></li><li><a href=\"#\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/date/2014-12/index.html", "utf8")).to.equal(expectedHtml);
        });

        it("Should create the second paginated date page for December 2014", function () {
            expect(fs.existsSync(rootPath + "/build/date/2014-12/page/2/index.html")).to.be.true;
        });

        it("Should create the third paginated date page for December 2014", function () {
            expect(fs.existsSync(rootPath + "/build/date/2014-12/page/3/index.html")).to.be.true;
        });

        it("Should have the correct content for the second paginated page", function () {
            var expectedHtml = "<div>" +
                "Posts dated: December 2014" +
                "<ul><li><a href=\"../../../../test-post3\">Test post 3</a></li><li><a href=\"../../../../test-post4\">Test post 4</a></li></ul>" +
                "<ul><li><a href=\"../3\">Older</a></li><li><a href=\"../../\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/date/2014-12/page/2/index.html", "utf8")).to.equal(expectedHtml);
        });

        it("Should have the correct content for the third paginated page", function () {
            var expectedHtml = "<div>" +
                "Posts dated: December 2014" +
                "<ul><li><a href=\"../../../../test-post5\">Test post 5</a></li><li><a href=\"../../../../test-post6\">Test post 6</a></li></ul>" +
                "<ul><li><a href=\"#\">Older</a></li><li><a href=\"../2\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/date/2014-12/page/3/index.html", "utf8")).to.equal(expectedHtml);
        });
    });

    describe("When there are no posts for the date pages", function () {
        beforeEach(function (done) {
            removeDir(rootPath);
            fs.mkdirSync(rootPath);
            fs.writeFileSync(rootPath + "/site.json", "{\"title\":\"Test site\"}");
            compileDates(rootPath).then(function () {
                doneStub();
                done();
            }, function () {
                errorStub();
                done();
            });
        });

        it("Should call done", function () {
            expect(doneStub.called).to.be.true;
        });
    });

    describe("When a glob error occurs", function () {
        var globStub, newCompileDates;

        beforeEach(function (done) {
            removeDir(rootPath);
            fs.mkdirSync(rootPath);
            fs.writeFileSync(rootPath + "/site.json", "{\"title\":\"Test site\"}");

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.deregisterAll();

            globStub = function (paths, options, callback) {
                callback({
                    message: "I threw an error"
                }, null);
            };

            mockery.registerMock("glob", globStub);

            newCompileDates = require("../lib/compile-dates");

            newCompileDates(rootPath).then(function () {
                done();
            }, function (err) {
                errorStub(err);
                done();
            });
        });

        it("Should throw a glob error", function () {
            expect(errorStub.called).to.be.true;
        });

        it("Should throw a specific error", function () {
            expect(errorStub.calledWith({ message: "I threw an error" })).to.be.true;
        });

        afterEach(function () {
            mockery.deregisterMock("glob");
            mockery.disable();
        });
    });
});
