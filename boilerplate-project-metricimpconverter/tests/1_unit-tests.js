const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function () {
    
    // convertHandler should correctly read a whole number input.
    test('Whole Number Input', ()=> {
        assert.equal(convertHandler.getNum('32L'), 32);
        assert.equal(convertHandler.getNum('-562L'), -562);
    });
    // convertHandler should correctly read a decimal number input.
    test('Decimal Input', () => {
        assert.equal(convertHandler.getNum('32.5L'), 32.5);
        assert.equal(convertHandler.getNum('-32.5L'), -32.5);
    });
    // convertHandler should correctly read a fractional input.
    test('Fractional Input', () => {
        assert.equal(convertHandler.getNum('1/2L'), 0.5);
        assert.equal(convertHandler.getNum('-1/2L'), -0.5);
    });
    // convertHandler should correctly read a fractional input with a decimal.
    test('Fractional Input With Decimal', () => {
        assert.equal(convertHandler.getNum('1/2.5L'), 0.4);
        assert.equal(convertHandler.getNum('-1/2.5L'), -0.4);
    });
    // convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3).
    test('Double Fractional Input', () => {
        assert.equal(convertHandler.getNum('3/2/3L'), null);
    });
    // convertHandler should correctly default to a numerical input of 1 when no numerical input is provided.
    test('No Numerical Input', () => {        
        assert.equal(convertHandler.getNum('kg'), 1);
        assert.equal(convertHandler.getNum('L'), 1);
    });
    // convertHandler should correctly read each valid input unit.
    test('Valid Input Unit', () => {
        assert.equal(convertHandler.getUnit('gal'), 'gal');
        assert.equal(convertHandler.getUnit('l'), 'L');
        assert.equal(convertHandler.getUnit('L'), 'L');
        assert.equal(convertHandler.getUnit('mi'), 'mi');
        assert.equal(convertHandler.getUnit('km'), 'km');
        assert.equal(convertHandler.getUnit('lbs'), 'lbs');        
        assert.equal(convertHandler.getUnit('kg'), 'kg');
    });
    // convertHandler should correctly return an error for an invalid input unit.
    test('Invalid Input Unit', () => {
        assert.equal(convertHandler.getUnit('galL'), null);
        assert.equal(convertHandler.getUnit('mi L'), null);
        assert.equal(convertHandler.getUnit('lbskg'), null);
    });
    // convertHandler should return the correct return unit for each valid input unit.
    test('Return Unit', () => {
        assert.equal(convertHandler.getReturnUnit('gal'), 'L');
        assert.equal(convertHandler.getReturnUnit('l'), 'gal');
        assert.equal(convertHandler.getReturnUnit('L'), 'gal');
        assert.equal(convertHandler.getReturnUnit('mi'), 'km');
        assert.equal(convertHandler.getReturnUnit('km'), 'mi');
        assert.equal(convertHandler.getReturnUnit('lbs'), 'kg');
        assert.equal(convertHandler.getReturnUnit('kg'), 'lbs');
    });
    // convertHandler should correctly return the spelled-out string unit for each valid input unit.
    test('Spell Out Unit', () => {
        assert.equal(convertHandler.spellOutUnit('gal'), 'gallons');
        assert.equal(convertHandler.spellOutUnit('l'), 'liters');
        assert.equal(convertHandler.spellOutUnit('L'), 'liters');
        assert.equal(convertHandler.spellOutUnit('mi'), 'miles');
        assert.equal(convertHandler.spellOutUnit('km'), 'kilometers');
        assert.equal(convertHandler.spellOutUnit('lbs'), 'pounds');
        assert.equal(convertHandler.spellOutUnit('kg'), 'kilograms');
    });
    // convertHandler should correctly convert gal to L.
    test('Gal to L', () => {
        assert.approximately(convertHandler.convert(3, 'gal'), 11.35623, 0.1);
        assert.approximately(convertHandler.convert(10, 'gal'), 37.85, 0.1);
    });
    // convertHandler should correctly convert L to gal.
    test('L to Gal', () => {
        assert.approximately(convertHandler.convert(3, 'l'), 3/3.78, 0.1);
        assert.approximately(convertHandler.convert(10, 'L'), 10/3.78, 0.1);
    });
    // convertHandler should correctly convert mi to km.
    test('Mi to Km', () => {
        assert.approximately(convertHandler.convert(3, 'mi'), 4.82, 0.1);
        assert.approximately(convertHandler.convert(10, 'mi'), 16, 0.1);
    });
    // convertHandler should correctly convert km to mi.
    test('Km to Mi', () => {
        assert.approximately(convertHandler.convert(3, 'km'), 1.875, 0.1);
        assert.approximately(convertHandler.convert(10, 'km'), 6.25, 0.1);
    });
    // convertHandler should correctly convert lbs to kg.
    test('Lbs to Kg', () => {
        assert.approximately(convertHandler.convert(3, 'lbs'), 1.35, 0.1);
        assert.approximately(convertHandler.convert(10, 'lbs'), 4.5, 0.1);
    });
    // convertHandler should correctly convert kg to lbs.
    test('Kg to Lbs', () => {
        assert.approximately(convertHandler.convert(3, 'kg'), 6.62, 0.1);
        assert.approximately(convertHandler.convert(10, 'kg'), 22.065, 0.1);
    });
});
