"use strict";

var compileTags = require("../lib/compile-tags"),
    removeDir = require("../lib/remove-dir"),
    expect = require("chai").expect,
    mockery = require("mockery"),
    Promise = require("bluebird"),
    sinon = require("sinon"),
    fs = require("fs");

describe("When compiling tag pages", function () {
    var rootPath = ".tmp/compile-tags";
    var doneStub, errorStub;

    before(function () {
        doneStub = sinon.stub();
        errorStub = sinon.stub();

        // create the root path
        [
            ".tmp",
            ".tmp/compile-tags"
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
            "/build/tag",
            "/build/tag/page",
            "/build/content",
            "/build/content/pages",
            "/build/content/posts"
        ].forEach(function (dir) {
            if (!fs.existsSync(rootPath + dir)) {
                fs.mkdirSync(rootPath + dir);
            }
        });

        // set-up files:
        fs.writeFileSync(rootPath + "/site.json", "{\"title\":\"Test site\"}", { encoding: "utf8" });
        fs.writeFileSync(rootPath + "/src/templates/partials/loop.hbs", "<ul>{{#each posts}}<li><a href=\"{{url}}\">{{title}}</a></li>{{/each}}</ul>", { encoding: "utf8" });
        fs.writeFileSync(rootPath + "/src/templates/partials/pagination.hbs", "<ul><li><a href=\"{{#if nextUrl}}{{nextUrl}}{{else}}#{{/if}}\">Older</a></li><li><a href=\"{{#if prevUrl}}{{prevUrl}}{{else}}#{{/if}}\">Newer</a></li></ul>", { encoding: "utf8" });
        fs.writeFileSync(rootPath + "/src/templates/index.hbs", "<div>{{> loop}}{{> pagination}}</div>", { encoding: "utf8" });
    });

    after(function () {
        removeDir(rootPath);
    });

    describe("When compiling tag pages", function () {
        before(function (done) {
            fs.writeFileSync(rootPath + "/build/content/posts/test-post1.json", "{\"slug\":\"test-post1\",\"title\":\"Test post 1\",\"date\":\"2014-06-11\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post2.json", "{\"slug\":\"test-post2\",\"title\":\"Test post 2\",\"date\":\"2014-12-05\",\"tags\":\"mocha coke\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            compileTags(rootPath).then(done, errorStub);
        });

        it("Should create the mocha tag page", function () {
            expect(fs.existsSync(rootPath + "/build/tag/mocha/index.html")).to.be.true;
        });

        it("Should create the coke tag page", function () {
            expect(fs.existsSync(rootPath + "/build/tag/coke/index.html")).to.be.true;
        });

        it("Should have the correct mocha tag page content", function () {
            var expectedHtml = "<div><ul><li><a href=\"../../test-post2/\">Test post 2</a></li><li><a href=\"../../test-post1/\">Test post 1</a></li></ul><ul><li><a href=\"#\">Older</a></li><li><a href=\"#\">Newer</a></li></ul></div>";
            expect(fs.readFileSync(rootPath + "/build/tag/mocha/index.html", "utf8")).to.equal(expectedHtml);
        });

        it("Should have the correct coke tag page content", function () {
            var expectedHtml = "<div><ul><li><a href=\"../../test-post2/\">Test post 2</a></li></ul><ul><li><a href=\"#\">Older</a></li><li><a href=\"#\">Newer</a></li></ul></div>";
            expect(fs.readFileSync(rootPath + "/build/tag/coke/index.html", "utf8")).to.equal(expectedHtml);
        });
    });

    describe("When an error occurs with the promises", function () {
        var promisesListStub, newCompileTags;

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

            newCompileTags = require("../lib/compile-tags");

            newCompileTags(rootPath).then(function () {
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

    describe("When compiling tag pages and excluding draft templates", function () {
        var minimistStub, newCompileTags;
        
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

            fs.writeFileSync(rootPath + "/build/content/posts/test-post1.json", "{\"slug\":\"test-post1\",\"title\":\"Test post 1\",\"date\":\"2014-06-11\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post2.json", "{\"slug\":\"test-post2\",\"title\":\"Test post 2\",\"date\":\"2014-12-05\",\"status\":\"draft\",\"tags\":\"mocha coke\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            
            newCompileTags = require("../lib/compile-tags");

            newCompileTags(rootPath).then(done, errorStub);
        });

        after(function () {
            mockery.disable();
        });

        it("Should have the correct mocha tag page content", function () {
            var expectedHtml = "<div><ul><li><a href=\"../../test-post1/\">Test post 1</a></li></ul><ul><li><a href=\"#\">Older</a></li><li><a href=\"#\">Newer</a></li></ul></div>";
            expect(fs.readFileSync(rootPath + "/build/tag/mocha/index.html", "utf8")).to.equal(expectedHtml);
        });
    });

    describe("When compiling tag posts with pagination", function () {
        before(function (done) {
            fs.writeFileSync(rootPath + "/site.json", "{ \"title\": \"Test site\", \"maxItems\": \"2\" }", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post1.json", "{\"slug\":\"test-post1\",\"title\":\"Test post 1\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post2.json", "{\"slug\":\"test-post2\",\"title\":\"Test post 2\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post3.json", "{\"slug\":\"test-post3\",\"title\":\"Test post 3\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post4.json", "{\"slug\":\"test-post4\",\"title\":\"Test post 4\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post5.json", "{\"slug\":\"test-post5\",\"title\":\"Test post 5\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post6.json", "{\"slug\":\"test-post6\",\"title\":\"Test post 6\",\"date\":\"2014-12-05\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post7.json", "{\"slug\":\"test-post7\",\"title\":\"Test post 7\",\"tags\":\"mocha\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            compileTags(rootPath).then(done, errorStub);
        });

        it("Should have the correct mocha tag page content", function () {
            var expectedHtml = "<div>" +
                "<ul><li><a href=\"../../test-post1/\">Test post 1</a></li><li><a href=\"../../test-post2/\">Test post 2</a></li></ul>" +
                "<ul><li><a href=\"../../tag/mocha/page/2\">Older</a></li><li><a href=\"#\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/tag/mocha/index.html", "utf8")).to.equal(expectedHtml);
        });

        it("Should create the second paginated mocha tag page", function () {
            expect(fs.existsSync(rootPath + "/build/tag/mocha/page/2/index.html")).to.be.true;
        });

        it("Should create the third paginated mocha tag page", function () {
            expect(fs.existsSync(rootPath + "/build/tag/mocha/page/3/index.html")).to.be.true;
        });

        it("Should have the correct content for the second paginated page", function () {
            var expectedHtml = "<div>" +
                "<ul><li><a href=\"../../../../test-post3\">Test post 3</a></li><li><a href=\"../../../../test-post4\">Test post 4</a></li></ul>" +
                "<ul><li><a href=\"../3\">Older</a></li><li><a href=\"../../\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/tag/mocha/page/2/index.html", "utf8")).to.equal(expectedHtml);
        });

        it("Should have the correct content for the third paginated page", function () {
            var expectedHtml = "<div>" +
                "<ul><li><a href=\"../../../../test-post5\">Test post 5</a></li><li><a href=\"../../../../test-post6\">Test post 6</a></li></ul>" +
                "<ul><li><a href=\"#\">Older</a></li><li><a href=\"../2\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/tag/mocha/page/3/index.html", "utf8")).to.equal(expectedHtml);
        });
    });

    describe("When there are no posts for the tag pages", function () {
        beforeEach(function (done) {
            removeDir(rootPath);
            fs.mkdirSync(rootPath);
            fs.writeFileSync(rootPath + "/site.json", "{\"title\":\"Test site\"}", { encoding: "utf8" });
            compileTags(rootPath).then(function () {
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
        var globStub, newCompileTags;

        beforeEach(function (done) {
            removeDir(rootPath);
            fs.mkdirSync(rootPath);
            fs.writeFileSync(rootPath + "/site.json", "{\"title\":\"Test site\"}", { encoding: "utf8" });

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

            newCompileTags = require("../lib/compile-tags");

            newCompileTags(rootPath).then(function () {
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
