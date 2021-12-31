
const sortDict = (dict) => {
    var sorted = [];
    for (var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort((a, b) => b.length - a.length);

    var tempDict = {};
    for (var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }
    return tempDict;
};
const reverseKeyAndvalue = (dict) => {
    var tempDict = {};
    for (var key in dict) {
        tempDict[dict[key]] = key;
    }
    return tempDict;
};
exports.sortDict = sortDict;
exports.reverseKeyAndvalue = reverseKeyAndvalue;
