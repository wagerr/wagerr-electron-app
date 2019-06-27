// Betting Converters
// import fractional from 'fractional-arithmetic'
import constants from '../../main/constants/constants';
const Fraction = require('fractional-arithmetic').Fraction;
var OddsConverter = OddsConverter || {};

// Todo: all must be converted with divisor, need to remove duplication

function toDecimal(decimal){
  return decimal / constants.ODDS_DIVISOR;
}

function toFraction(decimal){
  decimal = decimal - 10000; // -1
  decimal = decimal / constants.ODDS_DIVISOR;
  return new Fraction(decimal).simplify();
}
// American rounded off to 1 not 2
function toAmerican(decimal){
  let american;
  if (decimal >= 20000) {
    decimal = decimal - 10000; // -1
    decimal = decimal / 10000; // odds_division to get to decimal
    american = decimal * 100;
    american = Math.round(american * 10) / 10; // scaling solution for rounding off
    american = (american < 0 ? "" : "+") + american
  } else {
    decimal = decimal - 10000; // -1
    american = (-100*10000)/decimal;
    american = Math.round(american * 10) / 10; // scaling solution for rounding off
    american = (american < 0 ? "" : "+") + american;
  } 
  return american;
}

export {
  toDecimal,
  toFraction,
  toAmerican
}
