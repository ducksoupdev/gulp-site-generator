"use strict";

var removeDir = require("../lib/remove-dir"),
    expect = require("chai").expect,
    mockery = require("mockery"),
    fs = require("fs");

describe("When removing directories", function () {
    beforeEach(function () {
        // create the root path
        [
            ".tmp",
            ".tmp/remove-dir-test"
        ].forEach(function (dir) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
        
        var files = {
            ".tmp/remove-dir-test/file1": "This is test content",
            ".tmp/remove-dir-test/file2": "This is test content",
            ".tmp/remove-dir-test/file3": "This is test content"
        };

        for (var file in files) {
            if (files.hasOwnProperty(file)) {
                fs.writeFileSync(file, files[file], { encoding: "utf8" });
            }
        }
    });

    after(function() {
        removeDir(".tmp/remove-dir-test");
    });

    describe("When the temp directory structure is created", function () {
        it("Should have a temp directory structure", function () {
            expect(fs.existsSync(".tmp/remove-dir-test")).to.be.true;
        });

        it("Should have a temp file in the directory", function () {
            expect(fs.existsSync(".tmp/remove-dir-test/file1")).to.be.true;
        });
    });

    describe("When removing the temp directory", function () {
        beforeEach(function () {
            removeDir(".tmp/remove-dir-test");
        });

        it("Should remove the temp directory structure", function () {
            expect(fs.existsSync(".tmp/remove-dir-test")).to.be.false;
        });
    });

    describe("When removing the contents of the temp directory", function () {
        beforeEach(function () {
            removeDir(".tmp/remove-dir-test", false);
        });

        it("Should not remove the temp directory structure", function () {
            expect(fs.existsSync(".tmp/remove-dir-test")).to.be.true;
        });

        it("Should remove the temp file in the directory", function () {
            expect(fs.existsSync(".tmp/remove-dir-test/file1")).to.be.false;
        });
    });

    describe("When a nested directory of files exists", function () {
        beforeEach(function () {
            if (!fs.existsSync(".tmp/remove-dir-test/nested-dir")) {
                fs.mkdirSync(".tmp/remove-dir-test/nested-dir");
            }
            fs.writeFileSync(".tmp/remove-dir-test/nested-dir/file1", "This is test content", { encoding: "utf8" });
        });

        it("Should have a nested directory structure", function () {
            expect(fs.existsSync(".tmp/remove-dir-test/nested-dir/file1")).to.be.true;
        });

        describe("When the nested directory is removed", function () {
            beforeEach(function () {
                removeDir(".tmp/remove-dir-test");
            });

            it("Should remove the temp directory structure", function () {
                expect(fs.existsSync(".tmp/remove-dir-test")).to.be.false;
            });
        });
    });

    describe("When the readdirSync function throws an error", function () {
        var fsStub, newRemoveDir, error;

        before(function () {
            removeDir(".tmp/remove-dir-test");

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            fsStub = {
                readdirSync: function () {
                    throw new Error("readdirSync error!");
                }
            };

            mockery.registerMock("fs", fsStub);

            newRemoveDir = require("../lib/remove-dir");

            error = newRemoveDir(".tmp/remove-dir-test");
        });

        it("Should throw an error", function () {
            expect(error instanceof Error).to.be.true;
        });

        it("Should throw a specific error", function () {
            expect(error.message).to.equal("readdirSync error!");
        });

        after(function () {
            mockery.disable();
        });
    });
});
