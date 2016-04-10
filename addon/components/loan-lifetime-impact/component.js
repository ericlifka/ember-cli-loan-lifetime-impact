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
      frames: [],
      discretePayments: []
    });
  }),

  watchForRunCalculation: on('init', observer('loanAmount', 'interestRate', 'monthlyPayment', 'extraPayment', 'loan.discretePayments.[]', function () {
    Ember.run.debounce(this, this.runCalculation, 500);
  })),

  runCalculation() {
    this.set('neverEndingLoanError', false);

    let loan = this.get('loan');
    let loanAmount = this.get('loanAmount');
    let extraPayment = this.get('extraPayment');
    let monthlyPayment = this.get('monthlyPayment');
    let monthlyInterestRate = this.get('monthlyInterestRate');
    let discretePayments = this.convertPaymentsToObject(loan.get('discretePayments'));

    loan.set('extraPayment', extraPayment);
    loan.set('monthlyPayment', monthlyPayment);
    loan.set('monthlyInterestRate', monthlyInterestRate);
    loan.set('frames', this.calculateLoanFrames(loanAmount, monthlyInterestRate, monthlyPayment, extraPayment, discretePayments));
    loan.set('baseFrames', this.calculateLoanFrames(loanAmount, monthlyInterestRate, monthlyPayment, 0, {}));

    let totalInterestPaid = this.truncTwoDecimals(this.calculateLoanInterest(loan.get('frames')));
    let baseInterestPaid = this.calculateLoanInterest(loan.get('baseFrames'));
    let interestSaved = this.truncTwoDecimals(baseInterestPaid - totalInterestPaid);
    let totalLoanCost = this.truncTwoDecimals(this.calculateTotalCost(loan.get('frames')));
    loan.set('totalInterestPaid', totalInterestPaid);
    loan.set('baseInterestPaid', baseInterestPaid);
    loan.set('interestSaved', interestSaved);
    loan.set('totalLoanCost', totalLoanCost);

    loan.set('monthsSaved', loan.get('baseFrames.length') - loan.get('frames.length'));
  },

  calculateLoanFrames(loanAmount, monthlyInterestRate, monthlyPayment, extraPayment, discretePayments) {
    let frames = [];
    let startingBalance = loanAmount;
    let month = 1;

    while (startingBalance > 0) {
      let interestAmount = startingBalance * monthlyInterestRate;
      let discretePayment = discretePayments[ month ] || 0;
      let totalPayment = monthlyPayment + extraPayment + discretePayment;
      let endingBalance = startingBalance + interestAmount - totalPayment;

      if (endingBalance > startingBalance) {
        this.set('neverEndingLoanError', true);
        return;
      }

      if (endingBalance < 0) {
        totalPayment += endingBalance;
        endingBalance = 0;
      }

      frames.push(Ember.Object.create({
        loanAmount,
        startingBalance,
        interestAmount,
        totalPayment,
        discretePayment,
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
    loanFrames.forEach(frame => {
      interestPaid += frame.get('interestAmount');
    });
    return interestPaid;
  },

  calculateTotalCost(loanFrames) {
    let totalPaid = 0;
    loanFrames.forEach(frame => {
      totalPaid += frame.get('totalPayment');
    });
    return totalPaid;
  },

  truncTwoDecimals(amnt) {
    return Math.round(amnt * 100) / 100;
  },

  convertPaymentsToObject(paymentsArray) {
    let obj = { };
    paymentsArray.forEach(payment => {
      obj[payment.month] = payment.amount;
    });
    return obj;
  },

  actions: {
    addExtraPayment(month, amount) {
      this.get('loan.discretePayments').push({ month, amount });
      Ember.run.scheduleOnce('afterRender', this, this.runCalculation);
    },
    removeExtraPayment(month) {
      let payments = this.get('loan.discretePayments');
      let index = payments.findIndex(payment =>  payment.month === month);
      payments.splice(index, 1);

      Ember.run.scheduleOnce('afterRender', this, this.runCalculation);
    }
  }
});
