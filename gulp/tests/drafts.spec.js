"use strict";

var compileDrafts,
    mockery = require("mockery"),
    expect = require("chai").expect;

describe("When working with compile options", function () {
    var minimistStub;

    describe("When not working in draft mode", function () {
        before(function () {
            mockery.enable({
                warnOnReplace: false,
                useCleanCache: true
            });
            minimistStub = function () {
                return {
                    compile: "published"
                };
            };
            mockery.registerAllowable("../lib/drafts");
            mockery.registerMock("minimist", minimistStub);

            compileDrafts = require("../lib/drafts");
        });

        after(function () {
            mockery.disable();
        });

        it("Should return false if not compiling drafts", function () {
            expect(compileDrafts()).to.be.false;
        });
    });

    describe("When working in draft mode", function () {
        before(function () {
            mockery.enable({
                warnOnReplace: false,
                useCleanCache: true
            });
            minimistStub = function () {
                return {
                    compile: "drafts"
                };
            };
            mockery.registerAllowable("../lib/drafts");
            mockery.registerMock("minimist", minimistStub);

            compileDrafts = require("../lib/drafts");
        });

        after(function () {
            mockery.disable();
        });

        it("Should return true if compiling drafts", function () {
            expect(compileDrafts()).to.be.true;
        });
    });

});
