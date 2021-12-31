const americanOnly = require('./american-only.js');
const britishOnly = require('./british-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const { sortDict, reverseKeyAndvalue } = require("./utils");

class BritishToAmerican {
    constructor() {
        this.spelling = sortDict(reverseKeyAndvalue(americanToBritishSpelling));
        this.titles = sortDict(reverseKeyAndvalue(americanToBritishTitles));
        this.math = sortDict(britishOnly);
    }
    matchTitles(text) {
        const matches = [];
        for (let key in this.titles) {
            let exp = `\\b${key}\\b`;
            if (text.match(new RegExp(exp, 'gi'))) {
                // text.replace(key, "");
                matches.push([key, this.titles[key]]);
            }
        }
        return matches;
    }
    matchSpelling(text) {
        const matches = [];
        for (let key in this.spelling) {
            if (text.match(new RegExp(`\\b${key}\\b`, 'gi'))) {
                matches.push([key, this.spelling[key]]);
                // text.replace(key, "");
            }
        }
        return matches;
    }
    matchMath(text) {
        const matches = [];
        for (let key in this.math) {
            if (text.match(new RegExp(`\\b${key}\\b`, 'gi'))) {
                matches.push([key, this.math[key]]);
                // text.replace(key, "");
            }
        }
        return matches;
    }
    matchTime(text) {
        const matches = [];
        const match = text.match(/\d{1,2}.\d{2}/gi);
        if (match) {
            for (let i = 0; i < match.length; i++) {
                const original = match[i];
                const time = original.split('.');
                const newText = `${time[0]}:${time[1]}`;
                matches.push([original, newText]);
            }
        }
        return matches;
    }
}
module.exports = BritishToAmerican;