(function () {
    'use strict';

    var dates = require('../lib/dates'),
        expect = require('chai').expect;

    describe('When parsing dates', function() {
        beforeEach(function() {
            this.dateMonth = '2014-06';
            this.dateStr = 'June 2014';
            this.posts = [
                { date: '2014-06-11' },
                { date: '2014-12-11' }
            ]
        });

        it('Should create date link', function() {
            expect(dates.getDateAsLink('.', this.dateMonth, this.dateStr)).to.equal('<a href="./date/2014-06">June 2014</a>');
        });

        it('Should return undefined if no date exists', function() {
            expect(dates.getDateAsLink('.', null)).to.be.undefined;
        });

        it('Should get all dates as links', function() {
            expect(dates.getAllDatesAsLinks('.', this.posts)).to.deep.equal([
                {dateMonth: '2014-06', dateStr: 'June 2014', dateLink: './date/2014-06'},
                {dateMonth: '2014-12', dateStr: 'December 2014', dateLink: './date/2014-12'}
            ]);
        });
    });
})();
