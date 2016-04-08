import Ember from 'ember';
import layout from './template';
let { Component, computed, observer } = Ember;

export default Component.extend({
  classNames: [ 'lli-loan-frame' ],
  layout,

  percentComplete: computed('frame.{loanAmount,endingBalance}', function () {
    let loanAmount = this.get('frame.loanAmount');
    let endingBalance = this.get('frame.endingBalance');

    return `${endingBalance / loanAmount * 100}`.slice(0, 4) + '%';
  }),

  loanRemainingStyle: computed('percentComplete', function () {
    return `width: ${this.get('percentComplete')}`;
  })
});
