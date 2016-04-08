import Ember from 'ember';
import layout from './template';
let { Component, computed, observer } = Ember;

export default Component.extend({
  classNames: [ 'loan-lifetime-impact' ],
  layout,

  loanAmount: 0,
  interestRate: 0,
  monthlyPayment: 0,

  monthlyInterestRate: computed('interestRate', function () {
    return this.get('interestRate') / 100.0 / 12;
  }),

  runCalculation: observer('loanAmount', 'interestRate', 'monthlyPayment', function () {
    let loanAmount = this.get('loanAmount');

    this.set('loanFrame', this.calculateNextFrame(loanAmount));
  }),

  calculateNextFrame(loanAmount) {
    let interestDecimal = this.get('monthlyInterestRate');
    let nextMonthInterest = loanAmount * interestDecimal;
    let endingBalance = loanAmount + nextMonthInterest - this.get('monthlyPayment');

    let frame = {
      loanAmount,
      interestDecimal,
      nextMonthInterest,
      endingBalance
    };

    frame.next = this.calculateNextFrame(endingBalance);

    return frame;
  }
});
