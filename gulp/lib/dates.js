(function () {
    'use strict';

    var moment = require('moment');

    module.exports = {
        getDateAsLink: function (path, dateMonth, dateStr) {
            if (!dateMonth) {
                return undefined;
            }
            return '<a href="' + path + '/date/' + dateMonth + '">' + dateStr + '</a>';
        },
        getAllDatesAsLinks: function (path, posts) {
            var allDates = {}, allDatesArray = [], self = this;
            posts.forEach(function (post) {
                var dateMonth = post.date.substr(0, 7); //2014-12
                if (!allDates[dateMonth]) {
                    allDates[dateMonth] = self.getDateAsLink(path, dateMonth, moment(dateMonth, 'YYYY-MM').format('MMMM YYYY'));
                }
            });
            var keys = Object.keys(allDates);
            if (keys.length) {
                keys.sort();
                keys.forEach(function (key) {
                    allDatesArray.push({
                        dateMonth: key,
                        dateLink: allDates[key]
                    });
                });
            }
            return allDatesArray;
        }
    };
})();
