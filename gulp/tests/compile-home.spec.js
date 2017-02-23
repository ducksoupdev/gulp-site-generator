"use strict";

var compileHome = require("../lib/compile-home"),
    removeDir = require("../lib/remove-dir"),
    expect = require("chai").expect,
    mockery = require("mockery"),
    sinon = require("sinon"),
    Promise = require("bluebird"),
    fs = require("fs");

describe("Given the home page", function () {
    var rootPath = ".tmp/compile-home";
    var doneStub, errorStub;

    before(function () {
        doneStub = sinon.stub();
        errorStub = sinon.stub();

        // create the root path
        [
            ".tmp",
            ".tmp/compile-home"
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
            "/build/page",
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
        fs.writeFileSync(rootPath + "/src/templates/partials/loop.hbs", "<ul>{{#each pages}}<li><a href=\"{{url}}\">{{title}}</a></li>{{/each}}{{#each posts}}<li><a href=\"{{url}}\">{{title}}</a></li>{{/each}}</ul>", { encoding: "utf8" });
        fs.writeFileSync(rootPath + "/src/templates/partials/pagination.hbs", "<ul><li><a href=\"{{#if nextUrl}}{{nextUrl}}{{else}}#{{/if}}\">Older</a></li><li><a href=\"{{#if prevUrl}}{{prevUrl}}{{else}}#{{/if}}\">Newer</a></li></ul>", { encoding: "utf8" });
        fs.writeFileSync(rootPath + "/src/templates/index.hbs", "<div>{{> loop}}{{> pagination}}</div>", { encoding: "utf8" });
    });

    after(function () {
        removeDir(rootPath);
    });

    describe("When compiling the home page", function () {
        before(function (done) {
            fs.writeFileSync(rootPath + "/build/content/pages/test-page.json", "{\"slug\":\"test-page\",\"title\":\"Test page\",\"template\":\"page.hbs\",\"body\":\"<p>Test page content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post1.json", "{\"slug\":\"test-post1\",\"title\":\"Test post 1\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            compileHome(rootPath).then(done, errorStub);
        });

        it("Should create the static home page", function () {
            expect(fs.existsSync(rootPath + "/build/index.html")).to.be.true;
        });

        it("Should have the correct home page content", function () {
            var expectedHtml = "<div>" +
                "<ul>" +
                "<li>" +
                "<a href=\"test-page/\">Test page</a>" +
                "</li>" +
                "<li>" +
                "<a href=\"test-post1/\">Test post 1</a>" +
                "</li>" +
                "</ul>" +
                "<ul><li><a href=\"#\">Older</a></li><li><a href=\"#\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/index.html", "utf8")).to.equal(expectedHtml);
        });
    });

    describe("When an error occurs with the promises", function () {
        var promisesListStub, newCompileHome;

        beforeEach(function (done) {
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

            newCompileHome = require("../lib/compile-home");

            newCompileHome(rootPath).then(function () {
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

    describe("When compiling the home page excluding draft templates", function () {
        var minimistStub, newCompileHome;
        
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
            
            fs.writeFileSync(rootPath + "/build/content/pages/test-page.json", "{\"slug\":\"test-page\",\"title\":\"Test page\",\"template\":\"page.hbs\",\"body\":\"<p>Test page content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post1.json", "{\"slug\":\"test-post1\",\"title\":\"Test post 1\",\"template\":\"post.hbs\",\"status\":\"draft\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            
            newCompileHome = require("../lib/compile-home");

            newCompileHome(rootPath).then(done, errorStub);
        });

        after(function () {
            mockery.disable();
        });

        it("Should have the correct home page content", function () {
            var expectedHtml = "<div><ul><li><a href=\"test-page/\">Test page</a></li></ul><ul><li><a href=\"#\">Older</a></li><li><a href=\"#\">Newer</a></li></ul></div>";
            expect(fs.readFileSync(rootPath + "/build/index.html", "utf8")).to.equal(expectedHtml);
        });
    });

    describe("When compiling the home page with pagination", function () {
        before(function (done) {
            fs.writeFileSync(rootPath + "/site.json", "{ \"title\": \"Test site\", \"maxItems\": \"2\" }", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/pages/test-page.json", "{\"slug\":\"test-page\",\"title\":\"Test page\",\"template\":\"page.hbs\",\"body\":\"<p>Test page content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post1.json", "{\"slug\":\"test-post1\",\"title\":\"Test post 1\",\"date\":\"2015-02-20\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post2.json", "{\"slug\":\"test-post2\",\"title\":\"Test post 2\",\"date\":\"2015-02-20\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post3.json", "{\"slug\":\"test-post3\",\"title\":\"Test post 3\",\"date\":\"2015-02-20\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post4.json", "{\"slug\":\"test-post4\",\"title\":\"Test post 4\",\"date\":\"2015-02-20\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post5.json", "{\"slug\":\"test-post5\",\"title\":\"Test post 5\",\"date\":\"2015-02-20\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/posts/test-post6.json", "{\"slug\":\"test-post6\",\"title\":\"Test post 6\",\"date\":\"2015-02-20\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            compileHome(rootPath).then(done, errorStub);
        });

        it("Should have the correct home page content", function () {
            var expectedHtml = "<div>" +
                "<ul><li><a href=\"test-page/\">Test page</a></li><li><a href=\"test-post1/\">Test post 1</a></li><li><a href=\"test-post2/\">Test post 2</a></li></ul>" +
                "<ul><li><a href=\"page/2\">Older</a></li><li><a href=\"#\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/index.html", "utf8")).to.equal(expectedHtml);
        });

        it("Should create the second paginated home page", function () {
            expect(fs.existsSync(rootPath + "/build/page/2/index.html")).to.be.true;
        });

        it("Should create the third paginated home page", function () {
            expect(fs.existsSync(rootPath + "/build/page/3/index.html")).to.be.true;
        });

        it("Should have the correct home page content for the second paginated page", function () {
            var expectedHtml = "<div>" +
                "<ul><li><a href=\"../../test-post3\">Test post 3</a></li><li><a href=\"../../test-post4\">Test post 4</a></li></ul>" +
                "<ul><li><a href=\"../3\">Older</a></li><li><a href=\"../../\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/page/2/index.html", "utf8")).to.equal(expectedHtml);
        });

        it("Should have the correct home page content for the third paginated page", function () {
            var expectedHtml = "<div>" +
                "<ul><li><a href=\"../../test-post5\">Test post 5</a></li><li><a href=\"../../test-post6\">Test post 6</a></li></ul>" +
                "<ul><li><a href=\"#\">Older</a></li><li><a href=\"../2\">Newer</a></li></ul>" +
                "</div>";
            expect(fs.readFileSync(rootPath + "/build/page/3/index.html", "utf8")).to.equal(expectedHtml);
        });
    });

    describe("When compiling the home page content with no front matter", function () {
        before(function (done) {
            removeDir(rootPath);
            fs.mkdirSync(rootPath);
            fs.writeFileSync(rootPath + "/site.json", "{ \"title\": \"Test site\" }", { encoding: "utf8" });

            [
                "/src",
                "/src/templates",
                "/src/templates/partials",
                "/build",
                "/build/content"
            ].forEach(function (dir) {
                if (!fs.existsSync(rootPath + dir)) {
                    fs.mkdirSync(rootPath + dir);
                }
            });

            fs.writeFileSync(rootPath + "/src/templates/partials/loop.hbs", "{{#each pages}}<li><a href=\"{{url}}\">{{title}}</a></li>{{/each}}{{#each posts}}<li><a href=\"{{url}}\">{{title}}</a></li>{{/each}}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/src/templates/index.hbs", "<div><ul>{{> loop}}</ul></div>", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/test-page.json", "{\"body\":\"<p>Test page content</p>\"}", { encoding: "utf8" });
            fs.writeFileSync(rootPath + "/build/content/test-post1.json", "{\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", { encoding: "utf8" });
            compileHome(rootPath).then(done, errorStub);
        });

        it("Should have the correct home page content", function () {
            expect(fs.readFileSync(rootPath + "/build/index.html", "utf8")).to.equal("<div><ul><li><a href=\"test-page-content/\">Test page content</a></li><li><a href=\"test-post-content/\">Test post content</a></li></ul></div>");
        });
    });

    describe("When there are no posts or pages for the home page", function () {
        beforeEach(function (done) {
            removeDir(rootPath);
            fs.mkdirSync(rootPath);
            fs.writeFileSync(rootPath + "/site.json", "{\"title\":\"Test site\"}", { encoding: "utf8" });
            compileHome(rootPath).then(function () {
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
        var globStub, newCompileHome;

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

            newCompileHome = require("../lib/compile-home");

            newCompileHome(rootPath).then(function () {
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
