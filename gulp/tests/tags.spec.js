(function () {
    'use strict';

    var tags = require('../lib/tags'),
        expect = require('chai').expect;

    describe('When parsing tags', function() {
        beforeEach(function() {
            this.tagStr = 'content gulp testing';
        });

        it('Should create tag classes', function() {
            expect(tags.getTagClasses(this.tagStr)).to.equal(' tag-content tag-gulp tag-testing');
        });

        it('Should return undefined if no tags exist', function() {
            expect(tags.getTagClasses(null)).to.be.undefined;
        });

        it('Should create tag links', function() {
            expect(tags.getTagsAsLinks('.', this.tagStr)).to.equal('<a href="./tag/content">content</a>, <a href="./tag/gulp">gulp</a>, <a href="./tag/testing">testing</a>');
        });

        it('Should return undefined if no tags exist', function() {
            expect(tags.getTagsAsLinks('.', null)).to.be.undefined;
        });
    });
})();
