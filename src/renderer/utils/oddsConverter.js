// Betting Converters
import { bettingParams } from '../../main/constants/constants';

const OddsConverter = {
  gcd: function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    let temp;
    while (b > 0) {
      temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  },

  // Todo: all must be converted with divisor, need to remove duplication
  toDecimal: function toDecimal(decimal) {
    return Math.round((decimal / bettingParams.ODDS_DIVISOR) * 100) / 100;
  },

  toFraction: function toFraction(decimal) {
    decimal -= 10000; // -1
    decimal /= bettingParams.ODDS_DIVISOR;
    let n;
    let d;
    const ns = `${decimal}`;
    const decimals = ns.length - ns.indexOf('.') - 1;
    n = parseInt(ns.replace('.', ''));
    d = Math.pow(10, decimals);

    // simplify
    if (d < 0) {
      n *= -1;
      d *= -1;
    }
    const g = this.gcd(n, d);
    return g == 1 ? `${n}/${d}` : `${parseInt(n / g)}/${parseInt(d / g)}`;
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
