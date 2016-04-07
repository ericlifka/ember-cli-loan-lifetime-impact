import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  classNames: [ 'loan-lifetime-impact' ],
  layout,

  loanAmount: 0,
  interestRate: 0,
  monthlyPayment: 0
});
