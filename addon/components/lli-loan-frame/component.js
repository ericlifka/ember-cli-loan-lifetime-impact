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

  interestPercentage: computed('frame.totalPayment', 'frame.interestAmount', function () {
    let interestAmount = this.get('frame.interestAmount');
    let totalPayment = this.get('frame.totalPayment');

    return this.truncTwoDecimals(interestAmount / totalPayment * 100);
  }),

  interestPercentageStyle: computed('interestPercentage', function () {
    return `width: ${this.get('interestPercentage')}%`;
  }),

  truncTwoDecimals(amnt) {
    return Math.round(amnt * 100) / 100;
  },

  actions: {
    showExtraPaymentForm() {
      this.set('addingPayment', true);
      Ember.run.scheduleOnce('afterRender', () => {
        this.$('.lli-extra-payment-input').focus();
      });
    },
    hideExtraPaymentForm() {
      this.set('addingPayment', false);
    },
    addExtraPayment() {
      this.attrs.addExtraPayment(this.get('frame.month'), parseFloat(this.get('extraPaymentInput')));
    },
    removeExtraPayment() {
      this.attrs.removeExtraPayment(this.get('frame.month'));
    }
  }
});
