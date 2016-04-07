/* jshint node: true */
'use strict';

var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var compileLess = require('broccoli-less-single');

module.exports = {
  name: 'ember-cli-loan-lifetime-impact',

  isDevelopingAddon: function () {
    return true;
  },

  treeForVendor: function (tree) {
    var lessFile = 'styles/' + this.name + '.less';
    var compiledFile = this.name + '.css';

    console.log('compiled css: ', compiledFile);

    var lessFunnel = new Funnel(path.join(this.nodeModulesPath, '../', 'app'));
    var lessTree = compileLess(lessFunnel, lessFile, compiledFile);
    return !!tree ? mergeTrees([tree, lessTree]) : lessTree;
  },

  included: function (app) {
    this._super.included(app);

    app.import('vendor/' + this.name + '.css');
  }
};
