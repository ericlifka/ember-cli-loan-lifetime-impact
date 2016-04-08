import Ember from 'ember';
import layout from './template';
let { Component, computed, observer, on } = Ember;

export default Component.extend({
  classNames: [ 'loan-lifetime-impact' ],
  layout,

  loanAmountInput: 132000,
  interestRateInput: 4.0,
  monthlyPaymentInput: 800,

  loanAmount: computed('loanAmountInput', function () {
    return parseFloat("" + this.get('loanAmountInput'));
  }),
  interestRate: computed('interestRateInput', function () {
    return parseFloat("" + this.get('interestRateInput'));
  }),
  monthlyPayment: computed('monthlyPaymentInput', function () {
    return parseFloat("" + this.get('monthlyPaymentInput'));
  }),

  monthlyInterestRate: computed('interestRate', function () {
    return this.get('interestRate') / 100.0 / 12;
  }),

  runCalculation: on('init', observer('loanAmount', 'interestRate', 'monthlyPayment', function () {
    let startingBalance = this.get('loanAmount');
    console.log(typeof startingBalance);
    let frames = [];
    let month = 1;

    while (startingBalance > 0) {
      let interestDecimal = this.get('monthlyInterestRate');
      let interestAmount = startingBalance * interestDecimal;
      let endingBalance = startingBalance + interestAmount - this.get('monthlyPayment');

      frames.push(Ember.Object.create({
        startingBalance,
        interestAmount,
        endingBalance,
        month
      }));

      startingBalance = endingBalance;
      month++;
    }

    this.set('loanFrames', frames);
  }))
});
