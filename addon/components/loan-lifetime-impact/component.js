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

  loan: computed(function () {
    return Ember.Object.create({
      frames: []
    });
  }),

  watchForRunCalculation: on('init', observer('loanAmount', 'interestRate', 'monthlyPayment', 'extraPayment', function () {
    Ember.run.debounce(this, this.runCalculation, 500);
  })),

  runCalculation() {
    let loan = this.get('loan');
    let loanAmount = this.get('loanAmount');
    let extraPayment = this.get('extraPayment');
    let monthlyPayment = this.get('monthlyPayment');
    let monthlyInterestRate = this.get('monthlyInterestRate');

    loan.set('extraPayment', extraPayment);
    loan.set('monthlyPayment', monthlyPayment);
    loan.set('monthlyInterestRate', monthlyInterestRate);
    loan.set('frames', this.calculateLoanFrames(loanAmount, monthlyInterestRate, monthlyPayment, extraPayment));
    loan.set('baseFrames', this.calculateLoanFrames(loanAmount, monthlyInterestRate, monthlyPayment, 0));

    let totalInterestPaid = this.calculateLoanInterest(loan.get('frames'));
    let baseInterestPaid = this.calculateLoanInterest(loan.get('baseFrames'));
    let interestSaved = this.truncTwoDecimals(baseInterestPaid - totalInterestPaid);
    loan.set('totalInterestPaid', totalInterestPaid);
    loan.set('baseInterestPaid', baseInterestPaid);
    loan.set('interestSaved', interestSaved);

    loan.set('monthsSaved', loan.get('baseFrames.length') - loan.get('frames.length'));
  },

  calculateLoanFrames(loanAmount, monthlyInterestRate, monthlyPayment, extraPayment) {
    let frames = [];
    let startingBalance = loanAmount;
    let month = 1;

    while (startingBalance > 0) {
      let interestAmount = startingBalance * monthlyInterestRate;
      let endingBalance = startingBalance + interestAmount - monthlyPayment - extraPayment;

      frames.push(Ember.Object.create({
        loanAmount,
        startingBalance,
        interestAmount,
        endingBalance,
        month
      }));

      startingBalance = endingBalance;
      month++;
    }

    return frames;
  },

  calculateLoanInterest(loanFrames) {
    let interestPaid = 0;
    loanFrames.forEach(frame => interestPaid += frame.get('interestAmount'));
    return interestPaid;
  },

  truncTwoDecimals(amnt) {
    return Math.round(amnt * 100) / 100;
  },

  actions: {
    addExtraPayment() {
      console.log(arguments);
    }
  }
});
