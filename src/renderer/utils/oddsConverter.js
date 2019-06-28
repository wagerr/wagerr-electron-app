// Betting Converters
// import fractional from 'fractional-arithmetic'
import constants from '../../main/constants/constants';

const { Fraction } = require('fractional-arithmetic');

const OddsConverter = {
  // Todo: all must be converted with divisor, need to remove duplication
  toDecimal: function toDecimal(decimal) {
    return decimal / constants.ODDS_DIVISOR;
  },
  toFraction: function toFraction(decimal) {
    decimal -= 10000; // -1
    decimal /= constants.ODDS_DIVISOR;
    return new Fraction(decimal).simplify();
  },

  toAmerican: function toAmerican(decimal) {
    let american;
    if (decimal >= 20000) {
      decimal -= 10000; // -1
      decimal /= 10000; // odds_division to get to decimal
      american = decimal * 100;
      american = Math.round(american); // scaling solution for rounding off
      american = (american < 0 ? '' : '+') + american;
    } else {
      decimal -= 10000; // -1
      american = (-100 * 10000) / decimal;
      american = Math.round(american); // scaling solution for rounding off
      american = (american < 0 ? '' : '+') + american;
    }
    return american;
  }
};
export default OddsConverter;
