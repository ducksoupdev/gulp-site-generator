"use strict";

var moment = require("moment");

module.exports = {
    getDateAsLink: function (path, dateMonth, dateStr) {
        if (!dateMonth) {
            return undefined;
        }
        return "<a href=\"" + path + "/date/" + dateMonth + "\">" + dateStr + "</a>";
    },
    getAllDatesAsLinks: function (path, posts) {
        var allDates = {},
            allDatesArray = [],
            self = this;
        posts.forEach(function (post) {
            var dateMonth = post.date.substr(0, 7); //2014-12
            if (!allDates[dateMonth]) {
                allDates[dateMonth] = path + "/date/" + dateMonth;
            }
        });
        var keys = Object.keys(allDates);
        if (keys.length) {
            keys.sort();
            keys.forEach(function (key) {
                allDatesArray.push({
                    dateMonth: key,
                    dateStr: moment(key, "YYYY-MM").format("MMMM YYYY"),
                    dateLink: allDates[key]
                });
            });
        }
        return allDatesArray;
    },
    sortFunc: function (a, b) {
        var timeA = new Date(a.date).getTime(),
            timeB = new Date(b.date).getTime();
        if (timeA > timeB) return -1;
        if (timeA === timeB) return 0;
        if (timeA < timeB) return 1;
    }
};
