const { sortDict, reverseKeyAndvalue } = require("./utils");
const AmericanToBritish = require("./american-to-british.js");
const BritishToAmerican = require("./british-to-american.js");
const { math } = require("./american-only");

// Translate check whole words from dictionary first. Then check for single word. (This deal with word with variation)
// Translate time format will have custom time format foreach translation.
// Each language will have its own custom drive/class for its translation.
// So technically, each language will have its own translation class.
// The higher level will use switch case or dictionary function to find correct method.
// Due to how each language have its own adhoc translation, group all languages share same unit function is terrible for maintainability.

class Translator {
    constructor() {
        
        this.locales = {
            "american-to-british": new AmericanToBritish(),
            "british-to-american": new BritishToAmerican(),
        }
    }

    // Translate text from American English to British English
    translate(locale, text) {
        const localeData = this.locales[locale];
        const matches = this.findMatchTextTranslation(text, localeData);
        let translationText = text;
        for (let i = 0; i < matches.length; i++) {
            const [original, newText] = matches[i];
            translationText = translationText.replace(original, this.highlightWord(newText));
        }
        return { original:text, translation: translationText,  matches };
    }

    // This should found all words that can be replace and return an array of words that can be replaced.
    // So split translate and highlight into 2 different function. But I was too lazy to add more complexity.
    findMatchTextTranslation(text, locale) {        
        let matches = []
        matches.push(...locale.matchTitles(text));
        matches.push(...locale.matchSpelling(text));
        matches.push(...locale.matchMath(text));
        matches.push(...locale.matchTime(text));
        return matches;
    }

    highlightWord(word) {
        return `<span class="highlight">${word}</span>`;
    }


}

module.exports = Translator;