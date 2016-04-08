import Ember from 'ember';
import layout from './template';
let { Component, computed, observer } = Ember;

export default Component.extend({
  classNames: [ 'lli-loan-frame' ],
  layout,

  loanTotalDisplay: computed('frame.endingBalance', function () {
    return this.truncTwoDecimals(this.get('frame.endingBalance'));
  }),

  percentComplete: computed('frame.{loanAmount,endingBalance}', function () {
    let loanAmount = this.get('frame.loanAmount');
    let endingBalance = this.get('frame.endingBalance');

    return this.truncTwoDecimals(endingBalance / loanAmount * 100) + '%';
  }),

  loanRemainingStyle: computed('percentComplete', function () {
    return `width: ${this.get('percentComplete')}`;
  }),

  truncTwoDecimals(amnt) {
    return Math.round(amnt * 100) / 100;
  }
});
