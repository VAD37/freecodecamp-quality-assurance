const chai = require('chai');
const assert = chai.assert;

require("@babel/polyfill");
const Translator = require('../components/translator.js');
const translator = new Translator();

// I was a bit lazy at split between translation with and without highlight. Because the original website didn't  support return translated text without highlight.
// So share same function and result between translate and highligh-translate. This is not how the production project should be.

describe('Unit Tests', () => {    
    
    // Translate Mangoes are my favorite fruit. to British English
    it ('Translate Mangoes are my favorite fruit. to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'Mangoes are my favorite fruit.';
        const expected = "Mangoes are my <span class=\"highlight\">favourite</span> fruit.";
        const actual = translator.translate(locale ,text);        
        assert.equal(actual.translation, expected);
    });
    // Translate I ate yogurt for breakfast. to British English
    it ('Translate I ate yogurt for breakfast. to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'I ate yogurt for breakfast.';
        const expected = "I ate <span class=\"highlight\">yoghurt</span> for breakfast.";
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected);
    });
    // Translate We had a party at my friend's condo. to British English
    it ('Translate We had a party at my friend\'s condo. to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'We had a party at my friend\'s condo.';
        const expected = "We had a party at my friend's <span class=\"highlight\">flat</span>.";
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected);
    });
    // Translate Can you toss this in the trashcan for me? to British English
    it ('Translate Can you toss this in the trashcan for me? to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'Can you toss this in the trashcan for me?';
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, "Can you toss this in the <span class=\"highlight\">bin</span> for me?");
    });
    // Translate The parking lot was full. to British English
    it ('Translate The parking lot was full. to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'The parking lot was full.';
        const expected = {
            "text": "The parking lot was full.",
            "translation": "The <span class=\"highlight\">car park</span> was full."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Translate Like a high tech Rube Goldberg machine. to British English
    it ('Translate Like a high tech Rube Goldberg machine. to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'Like a high tech Rube Goldberg machine.';
        
        const expected = {
            "text": "Like a high tech Rube Goldberg machine.",
            "translation": "Like a high tech <span class=\"highlight\">Heath Robinson device</span>."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });

    // Translate To play hooky means to skip class or work. to British English
    it ('Translate To play hooky means to skip class or work. to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'To play hooky means to skip class or work.';        
        const expected = {
            "text": "To play hooky means to skip class or work.",
            "translation": "To <span class=\"highlight\">bunk off</span> means to skip class or work."
        };
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });


    // Translate No Mr. Bond, I expect you to die. to British English
    it ('Translate No Mr. Bond, I expect you to die. to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'No Mr. Bond, I expect you to die.';       
        const expected = "No <span class=\"highlight\">Mr</span> Bond, I expect you to die.";
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected);
    });

    // Translate Dr. Grosh will see you now. to British English
    it ('Translate Dr. Grosh will see you now. to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'Dr. Grosh will see you now.';
        const expected = {
            "text": "Dr. Grosh will see you now.",
            "translation": "<span class=\"highlight\">Dr</span> Grosh will see you now."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });

    // Translate Lunch is at 12:15 today. to British English
    it ('Translate Lunch is at 12:15 today. to British English',() => {
        const locale  = 'american-to-british';
        const text  = 'Lunch is at 12:15 today.';
        const expected = {
            "text": "Lunch is at 12:15 today.",
            "translation": "Lunch is at <span class=\"highlight\">12.15</span> today."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });

    // Translate We watched the footie match for a while. to American English
    it ('Translate We watched the footie match for a while. to American English',() => {
        const locale  = 'british-to-american';
        const text  = 'We watched the footie match for a while.';
        const expected ={
            "text": "We watched the footie match for a while.",
            "translation": "We watched the <span class=\"highlight\">soccer</span> match for a while."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Translate Paracetamol takes up to an hour to work. to American English
    it ('Translate Paracetamol takes up to an hour to work. to American English',() => {
        const locale  = 'british-to-american';
        const text  = 'Paracetamol takes up to an hour to work.';
        const expected = {
            "text": "Paracetamol takes up to an hour to work.",
            "translation": "<span class=\"highlight\">Tylenol</span> takes up to an hour to work."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Translate First, caramelise the onions. to American English
    it ('Translate First, caramelise the onions. to American English',() => {
        const locale  = 'british-to-american';
        const text  = 'First, caramelise the onions.';
        const expected = {
            "text": "First, caramelise the onions.",
            "translation": "First, <span class=\"highlight\">caramelize</span> the onions."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });

    // Translate I spent the bank holiday at the funfair. to American English
    it ('Translate I spent the bank holiday at the funfair. to American English',() => {
        const locale  = 'british-to-american';
        const text  = 'I spent the bank holiday at the funfair.';
        const expected = {
            "text": "I spent the bank holiday at the funfair.",
            "translation": "I spent the <span class=\"highlight\">public holiday</span> at the <span class=\"highlight\">carnival</span>."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });

    // Translate I had a bicky then went to the chippy. to American English
    it ('Translate I had a bicky then went to the chippy. to American English',() => {
        const locale  = 'british-to-american';
        const text  = 'I had a bicky then went to the chippy.';
        const expected = {
            "text": "I had a bicky then went to the chippy.",
            "translation": "I had a <span class=\"highlight\">cookie</span> then went to the <span class=\"highlight\">fish-and-chip shop</span>."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Translate I've just got bits and bobs in my bum bag. to American English
    it ('Translate I\'ve just got bits and bobs in my bum bag. to American English',() => {
        const locale  = 'british-to-american';
        const text  = 'I\'ve just got bits and bobs in my bum bag.';
        const expected = {
            "text": "I've just got bits and bobs in my bum bag.",
            "translation": "I've just got <span class=\"highlight\">odds and ends</span> in my <span class=\"highlight\">fanny pack</span>."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });

    // Translate The car boot sale at Boxted Airfield was called off. to American English
    it ('Translate The car boot sale at Boxted Airfield was called off. to American English',() => {
        const locale  = 'british-to-american';
        const text  = 'The car boot sale at Boxted Airfield was called off.';
        const expected = {
            "text": "The car boot sale at Boxted Airfield was called off.",
            "translation": "The <span class=\"highlight\">swap meet</span> at Boxted Airfield was called off."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Translate Have you met Mrs Kalyani? to American English
    it ('Translate Have you met Mrs Kalyani? to American English',() => {
        const locale  = 'british-to-american';
        const text  = 'Have you met Mrs Kalyani?';
        const expected = {
            "text": "Have you met Mrs Kalyani?",
            "translation": "Have you met <span class=\"highlight\">Mrs.</span> Kalyani?"
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Translate Prof Joyner of King's College, London. to American English
    it ("Translate Prof Joyner of King's College, London. to American English",() => {
        const locale  = 'british-to-american';
        const text  = 'Prof Joyner of King\'s College, London.';
        const expected = {
            "text": "Prof Joyner of King's College, London.",
            "translation": "<span class=\"highlight\">Prof.</span> Joyner of King's College, London."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Translate Tea time is usually around 4 or 4.30. to American English
    it ('Translate Tea time is usually around 4 or 4.30. to American English',() => {
        const locale  = 'british-to-american';
        const text  = 'Tea time is usually around 4 or 4.30.';
        const expected = {
            "text": "Tea time is usually around 4 or 4.30.",
            "translation": "Tea time is usually around 4 or <span class=\"highlight\">4:30</span>."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Highlight translation in Mangoes are my favorite fruit.
    it ('Highlight translation in Mangoes are my favorite fruit.',() => {
        const locale  = 'british-to-american';
        const text  = 'Mangoes are my favorite fruit.';
        const expected = {
            "text": "Mangoes are my favorite fruit.",
            "translation": "Mangoes are my favorite fruit."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Highlight translation in I ate yogurt for breakfast.
    it ('Highlight translation in I ate yogurt for breakfast.',() => {
        const locale  = 'british-to-american';
        const text  = 'I ate yogurt for breakfast.';
        const expected = {
            "text": "I ate yogurt for breakfast.",
            "translation": "I ate yogurt for breakfast."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Highlight translation in We watched the footie match for a while.
    it ('Highlight translation in We watched the footie match for a while.',() => {
        const locale  = 'british-to-american';
        const text  = 'We watched the footie match for a while.';
        const expected = {
            "text": "We watched the footie match for a while.",
            "translation": "We watched the <span class=\"highlight\">soccer</span> match for a while."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    // Highlight translation in Paracetamol takes up to an hour to work.
    it ('Highlight translation in Paracetamol takes up to an hour to work.',() => {
        const locale  = 'british-to-american';
        const text  = 'Paracetamol takes up to an hour to work.';
        const expected = {
            "text": "Paracetamol takes up to an hour to work.",
            "translation": "<span class=\"highlight\">Tylenol</span> takes up to an hour to work."
        }
        const actual = translator.translate(locale ,text);
        assert.equal(actual.translation, expected.translation);
    });
    
});
