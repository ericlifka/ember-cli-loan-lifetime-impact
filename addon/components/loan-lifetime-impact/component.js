import Ember from 'ember';
import layout from './template';
let { Component, computed, observer, on } = Ember;

export default Component.extend({
  classNames: [ 'loan-lifetime-impact' ],
  layout,

  loanAmountInput: 132000,
  interestRateInput: 4.0,
  monthlyPaymentInput: 800,
  extraPaymentInput: 0,

  loanAmount: computed('loanAmountInput', function () {
    return parseFloat("" + this.get('loanAmountInput'));
  }),
  interestRate: computed('interestRateInput', function () {
    return parseFloat("" + this.get('interestRateInput'));
  }),
  monthlyPayment: computed('monthlyPaymentInput', function () {
    return parseFloat("" + this.get('monthlyPaymentInput'));
  }),
  extraPayment: computed('extraPaymentInput', function () {
    return parseFloat("" + this.get('extraPaymentInput'));
  }),

  monthlyInterestRate: computed('interestRate', function () {
    return this.get('interestRate') / 100.0 / 12;
  }),

  runCalculation: on('init', observer('loanAmount', 'interestRate', 'monthlyPayment', function () {
    let loanAmount = this.get('loanAmount');
    let startingBalance = loanAmount;
    let loan = {
      frames: []
    };
    let month = 1;

    while (startingBalance > 0) {
      let interestDecimal = this.get('monthlyInterestRate');
      let interestAmount = startingBalance * interestDecimal;
      let endingBalance = startingBalance + interestAmount - this.get('monthlyPayment');

      loan.frames.push(Ember.Object.create({
        loanAmount,
        startingBalance,
        interestAmount,
        endingBalance,
        month
      }));

      startingBalance = endingBalance;
      month++;
    }

    this.set('loan', Ember.Object.create(loan));
  }))
});
