"use strict";

var compilePages = require("../lib/compile-pages"),
    removeDir = require("../lib/remove-dir"),
    expect = require("chai").expect,
    mockery = require("mockery"),
    Promise = require("bluebird"),
    sinon = require("sinon"),
    fs = require("fs");

describe("Given pages and posts", function () {
    var rootPath = ".tmp/compile-pages";
    var doneStub, errorStub;

    before(function () {
        doneStub = sinon.stub();
        errorStub = sinon.stub();

        // create the root path
        [
            ".tmp",
            ".tmp/compile-pages"
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
            "/build/content",
            "/build/content/pages",
            "/build/content/posts"
        ].forEach(function (dir) {
            if (!fs.existsSync(rootPath + dir)) {
                fs.mkdirSync(rootPath + dir);
            }
        });

        // set-up files:
        fs.writeFileSync(rootPath + "/site.json",
            "{\"title\":\"Test site\",\"testSiteVar\":\"my test value\"}", {
                encoding: "utf8"
            });
        fs.writeFileSync(rootPath +
            "/src/templates/page.hbs",
            "<div class=\"page\"><h1>{{post.title}}</h1>{{{post.body}}}<h3>{{site.testSiteVar}}</h3><h4>{{post.site.testSiteVar}}</h4></div>", {
                encoding: "utf8"
            });
        fs.writeFileSync(rootPath +
            "/src/templates/post.hbs",
            "<div class=\"post\"><h1>{{post.title}}</h1>{{{post.body}}}<h3>{{site.testSiteVar}}</h3><h4>{{post.site.testSiteVar}}</h4></div>", {
                encoding: "utf8"
            });
    });

    after(function () {
        removeDir(rootPath);
    });

    describe("When compiling a page", function () {
        before(function (done) {
            fs.writeFileSync(rootPath +
                "/build/content/pages/test-page.json",
                "{\"slug\":\"test-page\",\"title\":\"Test page\",\"template\":\"page.hbs\",\"body\":\"<p>Test page content</p>\"}", {
                    encoding: "utf8"
                });
            compilePages(rootPath).then(done,
                errorStub);
        });

        it("Should create the static page", function () {
            expect(fs.existsSync(rootPath +
                "/build/test-page/index.html"
            )).to.be.true;
        });

        it("Should have the correct page content",
            function () {
                expect(fs.readFileSync(rootPath +
                    "/build/test-page/index.html",
                    "utf8")).to.equal(
                    "<div class=\"page\"><h1>Test page</h1><p>Test page content</p><h3>my test value</h3><h4>my test value</h4></div>"
                );
            });
    });

    describe("When compiling a page with no slug", function () {
        before(function (done) {
            fs.writeFileSync(rootPath +
                "/build/content/pages/test-page-no-slug.json",
                "{\"title\":\"Test page no slug\",\"template\":\"page.hbs\",\"body\":\"<p>Test page content</p>\"}", {
                    encoding: "utf8"
                });
            compilePages(rootPath).then(done,
                errorStub);
        });

        it("Should create the static page", function () {
            expect(fs.existsSync(rootPath +
                "/build/test-page-no-slug/index.html"
            )).to.be.true;
        });

        it("Should have the correct page content",
            function () {
                expect(fs.readFileSync(rootPath +
                    "/build/test-page-no-slug/index.html",
                    "utf8")).to.equal(
                    "<div class=\"page\"><h1>Test page no slug</h1><p>Test page content</p><h3>my test value</h3><h4>my test value</h4></div>"
                );
            });
    });

    describe("When compiling a post", function () {
        before(function (done) {
            fs.writeFileSync(rootPath +
                "/build/content/posts/test-post.json",
                "{\"slug\":\"test-post\",\"title\":\"Test post\",\"date\":\"2014-06-11\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", {
                    encoding: "utf8"
                });
            compilePages(rootPath).then(done,
                errorStub);
        });

        it("Should create the static post", function () {
            expect(fs.existsSync(rootPath +
                "/build/test-post/index.html"
            )).to.be.true;
        });

        it("Should have the correct post content",
            function () {
                expect(fs.readFileSync(rootPath +
                    "/build/test-post/index.html",
                    "utf8")).to.equal(
                    "<div class=\"post\"><h1>Test post</h1><p>Test post content</p><h3>my test value</h3><h4>my test value</h4></div>"
                );
            });
    });

    describe("When compiling a post with no slug", function () {
        before(function (done) {
            fs.writeFileSync(rootPath +
                "/build/content/posts/test-post-no-slug.json",
                "{\"title\":\"Test post no slug\",\"date\":\"2014-06-11\",\"template\":\"post.hbs\",\"body\":\"<p>Test post content</p>\"}", {
                    encoding: "utf8"
                });
            compilePages(rootPath).then(done,
                errorStub);
        });

        it("Should create the static post", function () {
            expect(fs.existsSync(rootPath +
                "/build/test-post-no-slug/index.html"
            )).to.be.true;
        });

        it("Should have the correct post content",
            function () {
                expect(fs.readFileSync(rootPath +
                    "/build/test-post-no-slug/index.html",
                    "utf8")).to.equal(
                    "<div class=\"post\"><h1>Test post no slug</h1><p>Test post content</p><h3>my test value</h3><h4>my test value</h4></div>"
                );
            });
    });

    describe("When an error occurs with the promises", function () {
        var promisesListStub, newCompilePages;

        beforeEach(function (done) {
            fs.writeFileSync(rootPath +
                "/build/content/pages/test-page.json",
                "{\"slug\":\"test-page\",\"title\":\"Test page\",\"template\":\"page.hbs\",\"body\":\"<p>Test page content</p>\"}", {
                    encoding: "utf8"
                });

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.deregisterAll();

            promisesListStub = {
                filter: function () {
                    return [Promise.reject(
                        "An error occurred"
                    )];
                }
            };

            mockery.registerMock(
                "../lib/promises",
                promisesListStub);

            newCompilePages = require(
                "../lib/compile-pages");

            newCompilePages(rootPath).then(function () {
                    done();
                },
                function (err) {
                    errorStub(err);
                    done();
                });
        });

        it("Should call the error function", function () {
            expect(errorStub.called).to.be.true;
        });

        afterEach(function () {
            mockery.deregisterMock(
                "../lib/promises");
            mockery.disable();
        });
    });

    describe("When compiling posts and excluding draft templates", function () {
        var minimistStub, newCompilePages;
        
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
            
            fs.writeFileSync(rootPath +
                "/build/content/posts/test-draft-post.json",
                "{\"slug\":\"test-draft-post\",\"title\":\"Test draft post\",\"date\":\"2014-06-11\",\"template\":\"post.hbs\",\"status\":\"draft\",\"body\":\"<p>Test draft post content</p>\"}", {
                    encoding: "utf8"
                });

            newCompilePages = require("../lib/compile-pages");

            newCompilePages(rootPath).then(done,
                errorStub);
        });

        after(function () {
            mockery.disable();
        });

        it("Should not create the static post",
            function () {
                expect(fs.existsSync(rootPath +
                    "/build/test-draft-post/index.html"
                )).to.be.false;
            });
    });

    describe("When compiling posts and including tags",
        function () {
            before(function (done) {
                fs.writeFileSync(rootPath +
                    "/src/templates/post.hbs",
                    "<div class=\"{{body_class}}\"><div class=\"post\"><h1>{{post.title}}</h1>{{{post.body}}}</div></div>", {
                        encoding: "utf8"
                    });
                fs.writeFileSync(rootPath +
                    "/build/content/posts/test-tagged-post.json",
                    "{\"slug\":\"test-tagged-post\",\"title\":\"Test tagged post\",\"date\":\"2014-06-11\",\"template\":\"post.hbs\",\"tags\":\"tag1 tag2\",\"body\":\"<p>Test tagged post content</p>\"}", {
                        encoding: "utf8"
                    });
                compilePages(rootPath).then(done,
                    errorStub);
            });

            it("Should have the correct post content",
                function () {
                    expect(fs.readFileSync(rootPath +
                        "/build/test-tagged-post/index.html",
                        "utf8")).to.equal(
                        "<div class=\"post-template tag-tag1 tag-tag2\"><div class=\"post\"><h1>Test tagged post</h1><p>Test tagged post content</p></div></div>"
                    );
                });
        });

    describe("When there are no posts or pages to compile",
        function () {
            beforeEach(function (done) {
                removeDir(rootPath);
                fs.mkdirSync(rootPath);
                fs.writeFileSync(rootPath +
                    "/site.json",
                    "{\"title\":\"Test site\"}", {
                        encoding: "utf8"
                    });
                compilePages(rootPath).then(function () {
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
        var globStub, newCompilePages;

        beforeEach(function (done) {
            removeDir(rootPath);
            fs.mkdirSync(rootPath);
            fs.writeFileSync(rootPath +
                "/site.json",
                "{\"title\":\"Test site\"}", {
                    encoding: "utf8"
                });

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.deregisterAll();

            globStub = function (paths, options,
                callback) {
                callback({
                    message: "I threw an error"
                }, null);
            };

            mockery.registerMock("glob",
                globStub);

            newCompilePages = require(
                "../lib/compile-pages");

            newCompilePages(rootPath).then(function () {
                    done();
                },
                function (err) {
                    errorStub(err);
                    done();
                });
        });

        it("Should throw a glob error", function () {
            expect(errorStub.called).to.be.true;
        });

        it("Should throw a specific error", function () {
            expect(errorStub.calledWith({
                message: "I threw an error"
            })).to.be.true;
        });

        afterEach(function () {
            mockery.deregisterMock("glob");
            mockery.disable();
        });
    });
});