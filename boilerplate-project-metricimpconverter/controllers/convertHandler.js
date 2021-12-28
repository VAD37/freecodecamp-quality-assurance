function ConvertHandler() {

  this.getNum = function (input) {
    //regex there is no number and only string return 1.
    if (input.match(/^[a-zA-Z]+$/))
      return 1;

    // if contains char '/' 1 times then it is a fraction that can be converted
    let fractionMatch = input.match(/\//g);
    if (fractionMatch && fractionMatch.length == 1) {
      //regex convert 2 fractional numbers to decimal
      if (input.match(/^[+-]?\d*\.?\d+\/\d*\.?\d+/)) {
        var fraction = input.split('/');
        return parseFloat(fraction[0]) / parseFloat(fraction[1]);
      }
    }
    else if (!fractionMatch) {
      //regex string get the decimal number or whole number from input
      var num = input.match(/^[+-]?\d*\.?\d+/);
      if (num)
        return parseFloat(num[0]);
    }

    return null;
  };

  this.getUnit = function (input) {
    //regex get the unit from input
    // if lowercase unit match the valid unit gal, l, mi, km, lbs, kg then return them
    var words = input.match(/[a-zA-Z]+/g);
    if (words && words.length == 1) {
      var unit = words[0].toLowerCase().match(/^(gal|l|mi|km|lbs|kg)$/);
      if (unit) {
        if (unit[0] == 'l')
          return "L";
        return unit[0];
      }
    }
    return null;
  };

  this.getReturnUnit = function (initUnit) {
    // Switch case from valid unit to return unit
    switch (initUnit.toLowerCase()) {
      case 'gal':
        return 'L';
      case 'l':
        return 'gal';
      case 'mi':
        return 'km';
      case 'km':
        return 'mi';
      case 'lbs':
        return 'kg';
      case 'kg':
        return 'lbs';
    }
  };

  this.spellOutUnit = function (unit) {
    // Switch case from valid unit to return unit
    switch (unit.toLowerCase()) {
      case 'gal':
        return 'gallons';
      case 'l':
        return 'liters';
      case 'mi':
        return 'miles';
      case 'km':
        return 'kilometers';
      case 'lbs':
        return 'pounds';
      case 'kg':
        return 'kilograms';
    }
  };

  
  this.convert = function (initNum, initUnit) {
    // Switch case from valid unit to return unit
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    switch (initUnit.toLowerCase()) {
      case 'gal':
        return initNum * galToL;
      case 'l':
        return initNum / galToL;
      case 'mi':
        return initNum * miToKm;
      case 'km':
        return initNum / miToKm;
      case 'lbs':
        return initNum * lbsToKg;
      case 'kg':
        return initNum / lbsToKg;
    }
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    // Return string
    return initNum.toString() + ' ' + this.spellOutUnit(initUnit) + ' converts to ' + returnNum.toString() + ' ' + this.spellOutUnit(returnUnit);
  };

}

module.exports = ConvertHandler;
