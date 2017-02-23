"use strict";

var tags = require("../lib/tags"),
    expect = require("chai").expect;

describe("When parsing tags", function () {
    beforeEach(function () {
        this.tagStr = "content gulp testing";
        this.tagArray = ["content", "gulp", "testing"];
        this.posts = [
            { tagStr: "content" },
            { tagStr: "gulp" },
            { tagStr: "testing" }
        ];
    });

    it("Should create tag classes", function () {
        expect(tags.getTagClasses(this.tagStr)).to.equal(" tag-content tag-gulp tag-testing");
    });

    it("Should return undefined if no tags exist", function () {
        expect(tags.getTagClasses(null)).to.be.undefined;
    });

    it("Should support tags as Array", function () {
        expect(tags.getTagClasses(this.tagArray)).to.equal(" tag-content tag-gulp tag-testing");
    });

    it("Should create tag links from the root path", function () {
        var tagLinks = tags.getTagsAsLinks("", this.tagStr);
        expect(tagLinks).to.equal("<a href=\"tag/content\">content</a><a href=\"tag/gulp\">gulp</a><a href=\"tag/testing\">testing</a>");
    });

    it("Should create tag links from a relative path", function () {
        var tagLinks = tags.getTagsAsLinks("../..", this.tagStr);
        expect(tagLinks).to.equal("<a href=\"../../tag/content\">content</a><a href=\"../../tag/gulp\">gulp</a><a href=\"../../tag/testing\">testing</a>");
    });

    it("Should return undefined if no tags exist", function () {
        expect(tags.getTagsAsLinks("", null)).to.be.undefined;
    });

    it("Should create tag link from the root path", function () {
        expect(tags.getTagAsLink("", "single")).to.equal("<a href=\"tag/single\">single</a>");
    });

    it("Should create tag link from a relative path", function () {
        expect(tags.getTagAsLink("../..", "single")).to.equal("<a href=\"../../tag/single\">single</a>");
    });

    it("Should return undefined if no tag exists", function () {
        expect(tags.getTagAsLink("", null)).to.be.undefined;
    });

    it("Should get all tags as links from the root path", function () {
        expect(tags.getAllTagsAsLinks("", this.posts)).to.deep.equal([
            { tag: "content", tagLink: "tag/content" },
            { tag: "gulp", tagLink: "tag/gulp" },
            { tag: "testing", tagLink: "tag/testing" }
        ]);
    });

    it("Should get all tags as links from a relative path", function () {
        expect(tags.getAllTagsAsLinks("../..", this.posts)).to.deep.equal([
            { tag: "content", tagLink: "../../tag/content" },
            { tag: "gulp", tagLink: "../../tag/gulp" },
            { tag: "testing", tagLink: "../../tag/testing" }
        ]);
    });
});
