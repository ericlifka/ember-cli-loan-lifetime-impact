import Ember from 'ember';
import layout from './template';
let { Component, computed, observer, on } = Ember;

export default Component.extend({
  classNames: [ 'loan-lifetime-impact' ],
  layout,

  loanAmount: 132000,
  interestRate: 4.0,
  monthlyPayment: 800,

  monthlyInterestRate: computed('interestRate', function () {
    return this.get('interestRate') / 100.0 / 12;
  }),

  runCalculation: on('init', observer('loanAmount', 'interestRate', 'monthlyPayment', function () {
    let loanAmount = this.get('loanAmount');
    let loanFrames = this.calculateNextFrame(loanAmount);
    console.log(loanFrames);
    this.set('loanFrames', loanFrames);
  })),

  calculateNextFrame(startingBalance) {
    let interestDecimal = this.get('monthlyInterestRate');
    let interestAmount = startingBalance * interestDecimal;
    let endingBalance = startingBalance + interestAmount - this.get('monthlyPayment');
    console.log(startingBalance, interestAmount, endingBalance);

    let frame = Ember.Object.create({
      startingBalance,
      interestAmount,
      endingBalance
    });

    if (endingBalance > 0) {
      frame.next = this.calculateNextFrame(endingBalance);
    }

    return frame;
  }
});
