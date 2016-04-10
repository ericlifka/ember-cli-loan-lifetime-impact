import Ember from 'ember';
import layout from './template';
let { Component, computed, observer } = Ember;

export default Component.extend({
  classNames: [ 'lli-loan-frame' ],
  layout,

  loanRemainingDisplay: computed('frame.endingBalance', function () {
    return this.truncTwoDecimals(this.get('frame.endingBalance'));
  }),

  percentComplete: computed('frame.{loanAmount,endingBalance}', function () {
    let loanAmount = this.get('frame.loanAmount');
    let endingBalance = this.get('frame.endingBalance');

    return this.truncTwoDecimals(endingBalance / loanAmount * 100);
  }),

  loanRemainingStyle: computed('percentComplete', function () {
    return `width: ${this.get('percentComplete')}%`;
  }),

  totalPayment: computed('loan.{monthlyPayment,extraPayment}', function () {
    console.log(this.get('loan'));
    console.log(this.get('loan.monthlyPayment'), this.get('loan.extraPayment'));
    return this.get('loan.monthlyPayment') + this.get('loan.extraPayment');
  }),

  interestPercentage: computed('totalPayment', 'frame.interestAmount', function () {
    let interestAmount = this.get('frame.interestAmount');
    let totalPayment = this.get('totalPayment');

    return this.truncTwoDecimals(interestAmount / totalPayment * 100);
  }),

  interestPercentageStyle: computed('interestPercentage', function () {
    return `width: ${this.get('interestPercentage')}%`;
  }),

  truncTwoDecimals(amnt) {
    return Math.round(amnt * 100) / 100;
  },

  actions: {
    toggleExtraPaymentForm() {
      this.toggleProperty('addingPayment');
    },
    addExtraPayment() {
      this.attrs.addExtraPayment(this.get('frame.month'), parseFloat(this.get('extraPaymentInput')));
    },
    removeExtraPayment() {
      this.attrs.removeExtraPayment(this.get('frame.month'));
    }
  }
});
