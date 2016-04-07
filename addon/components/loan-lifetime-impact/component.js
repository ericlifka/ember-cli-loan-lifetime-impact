import Ember from 'ember';
import layout from './template';
let { Component, observer } = Ember;

export default Component.extend({
  classNames: [ 'loan-lifetime-impact' ],
  layout,

  loanAmount: 0,
  interestRate: 0,
  monthlyPayment: 0,

  runCalculation: observer('loanAmount', 'interestRate', 'monthlyPayment', function () {
    let interestDecimal = this.get('interestRate') / 100.0 / 12;
    let nextMonthInterest = this.get('loanAmount') * interestDecimal;
    let nextMonthPrincipal = this.get('monthlyPayment') - nextMonthInterest;

    this.set('nextMonthInterest', nextMonthInterest);
    this.set('nextMonthPrincipal', nextMonthPrincipal);
  })
});
