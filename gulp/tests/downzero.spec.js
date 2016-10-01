"use strict";

var downzero = require("../lib/downzero"),
    expect = require("chai").expect;

describe("When extracting html tags with double quotes", function () {
    beforeEach(function () {
        this.html = "<p><img src=\"/images/test.png\"></p> <p>This is the first paragraph.</p>";
    });

    it("Should strip just the first tag from the html", function () {
        expect(downzero(this.html)).to.equal("<p><img src=\"/images/test.png\"></p>");
    });
});

describe("When extracting html tags with single quotes", function () {
    beforeEach(function () {
        this.html = "<p><img src=\"/images/test.png\"></p> <p>This is the \"first paragraph\".</p>";
    });

    it("Should strip just the first tag from the html", function () {
        expect(downzero(this.html)).to.equal("<p><img src=\"/images/test.png\"></p>");
    });
});

describe("When extracting html tags with comments", function () {
    beforeEach(function () {
        this.html = "<p><!-- test comment --><img src=\"/images/test.png\"></p> <p>This is the first paragraph.</p>";
    });

    it("Should strip just the first tag from the html", function () {
        expect(downzero(this.html)).to.equal("<p><!-- test comment --><img src=\"/images/test.png\"></p>");
    });
});
