"use strict";

var paths = require("../lib/paths"),
    expect = require("chai").expect;

describe("When replacing paths", function () {
    beforeEach(function () {
        this.html = "<p>This is a sentence <a href=\"/my-test-page\">with a link</a>.</p><p>This sentence contains an <img src=\"/images/test.png\" alt=\"\"> image.</p>";
    });

    it("Should replace the link paths with relative links", function () {
        expect(paths.resolve(this.html, "../..")).to.match(/\.\.\/\.\.\/my-test-page/);
    });

    it("Should replace the image paths with relative links", function () {
        expect(paths.resolve(this.html, "../..")).to.match(/\.\.\/\.\.\/images\/test\.png/);
    });
});
