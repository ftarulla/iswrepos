
var Git = require('nodegit');
var clc = require('cli-color');

var inquirer = require('inquirer');

//
var Printer = require('./printer').Printer;
var show = require('./shows');


var listTeams = function(teams) {
    var printer = new Printer(show.teamMembers, show.repository);
    printer.print(teams);
}

var reposStatus = function(teams) {
    var printer = new Printer(show.teamMembers, show.repositoryWithStatus);
    printer.print(teams);
}

var cloneRepos = function(teams, isForce) {

    var question = Promise.resolve({continue: true});

    if(isForce) { // delete local repositories before Clone
        question = inquirer.prompt([{
            type: 'confirm',
            name: 'continue',
            message: 'You are about to delete all existing local repositories before cloning. Continue?',
            default: false
        }]);
    };

    question
        .then(function(answer) {
            if(!answer.continue) {
                return;
            }

            teams.reduce(function(acum, team){

                return acum.then(function() {
                    return Git.Clone(team.repo, "./repositories/" + team.id + "-" + team.name + "/")
                                .then(function(repository) {
                                    console.log("Done");
                                })
                                .catch(function(error) {
                                    console.log("Error on repository clone: " + error);
                                });
                });

            }, Promise.resolve());
        });
}

module.exports.listTeams = listTeams;
module.exports.reposStatus = reposStatus;
module.exports.cloneRepos = cloneRepos;