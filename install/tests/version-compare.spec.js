/* globals it, afterEach, beforeEach, after, describe, before */
/* jshint -W079 */
"use strict";

var versionCompare = require("../lib/version-compare"),
    expect = require("chai").expect;

describe("version compare", function() {
    it("not compare invalid versions", function() {
        expect(versionCompare("a.v.s", "a.v.s")).to.be.NaN;
        expect(versionCompare("1.v.d", "a.v.s")).to.be.NaN;
    });
    
    it("compare dotted version strings", function() {
        expect(versionCompare("1.8", "1.8.1")).to.equal(-1);
        expect(versionCompare("1.8.3", "1.8.1")).to.equal(1);
        expect(versionCompare("1.8", "1.10")).to.equal(-1);
        expect(versionCompare("1.10.1", "1.10.1")).to.equal(0);
    });

    it("compare longer is considered greater", function() {
        expect(versionCompare("1.10.1.0", "1.10.1")).to.equal(1);
        expect(versionCompare("1.10.1", "1.10.1.0")).to.equal(-1);
    });

    it("compare string pairs", function() {
        expect(versionCompare("1.x", "1.x")).to.equal(0);
        expect(versionCompare("1.10.x", "1.10.x")).to.equal(0);
        expect(versionCompare("~1.10", "1.10")).to.equal(0);
        expect(versionCompare("^1.10", "1.10")).to.equal(0);
        expect(versionCompare(">1.10", "1.10")).to.equal(0);
        expect(versionCompare(">=1.10", "1.10")).to.equal(0);
        expect(versionCompare("<1.10", "1.10")).to.equal(0);
        expect(versionCompare("<=1.10", "1.10")).to.equal(0);
    });

    it("compare mixed ints and string pairs", function() {
        expect(versionCompare("1.8", "1")).to.equal(1);
    });

    it("compare plain numbers", function() {
        expect(versionCompare("4", "3")).to.equal(1);
    });
});
