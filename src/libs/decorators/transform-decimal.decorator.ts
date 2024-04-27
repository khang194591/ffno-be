import Decimal from 'decimal.js';

export class DecimalNumber extends Decimal {
  constructor(value = 0) {
    super(value);
  }
}
