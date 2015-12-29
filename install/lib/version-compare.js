"use strict";

module.exports = function(v1, v2) {
    var v1parts = ("" + v1).replace(/~|\^|>=|>|<=|<|\.x/i, "").split("."),
        v2parts = ("" + v2).replace(/~|\^|>=|>|<=|<|\.x/i, "").split("."),
        minLength = Math.min(v1parts.length, v2parts.length),
        p1, p2, i;

    // Compare tuple pair-by-pair.
    for (i = 0; i < minLength; i++) {
        // Convert to integer if possible, because "8" > "10".
        p1 = parseInt(v1parts[i], 10);
        p2 = parseInt(v2parts[i], 10);
        
        if (isNaN(p1)) {
            return NaN;
        }
        if (isNaN(p2)) {
            return NaN;
        }
        
        if (p1 === p2) {
            continue;
        } else if (p1 > p2) {
            return 1;
        } else if (p1 < p2) {
            return -1;
        }        
    }

    // The longer tuple is always considered "greater"
    if (v1parts.length === v2parts.length) {
        return 0;
    }

    return (v1parts.length < v2parts.length) ? -1 : 1;
};
