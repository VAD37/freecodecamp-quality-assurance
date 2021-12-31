'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      // Return text and translated text
      const text = req.body.text;
      const locale = req.body.locale;

      if (!locale || text === undefined) {
        res.json({ error: 'Required field(s) missing' });
      } else if (!text) {
        res.json({ error: 'No text to translate' });
      }
      else if (locale !== 'american-to-british' && locale !== 'british-to-american') {
        res.json({ error: 'Invalid value for locale field' });
      }
      else {
        const { original, translation, matches } = translator.translate(locale, text);
        if (original === translation) {
          res.json({ text, translation: 'Everything looks good to me!' });
        } else {
          res.json({ text, translation: translation });
        }
      }
    });
};
