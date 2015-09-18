var Promise = require('bluebird');
var inquirer = require('inquirer');

module.exports = function prompt(questions) {
    return new Promise(function(resolve, reject) {
        inquirer.prompt(questions, resolve);
    });
}