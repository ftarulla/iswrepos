
var Git = require('nodegit');
var clc = require('cli-color');

var inquirer = require('inquirer');

//
var Printer = require('./printer').Printer;
var show = require('./shows');


var listTeams = function(teams) {
    var printer = new Printer(show.teamMembers, show.repositoryDont);
    printer.print(teams);
}

var reposStatus = function(teams) {
    var printer = new Printer(show.teamMembersDont, show.repositoryWithStatus);
    printer.print(teams);
}

var listTeamsWithRepoStatus = function(teams) {
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

    var Progresser = function(callback) {
        this.dotdotdot = "";
        this.continue = true;
        this.callback = callback;
    };
    Progresser.prototype.stop = function() {
        this.continue = false;
    };
    Progresser.prototype.start = function() {
        setTimeout(() => {
            if(this.dotdotdot == "    ") {
                this.dotdotdot = "";
            }
            this.dotdotdot = this.dotdotdot + ".";
            if(this.dotdotdot == "....") {
                this.dotdotdot = "    ";
            }
            this.callback();

            if(this.continue) {
                this.start();
            }
        }, 500);
    };

    question
        .then(function(answer) {
            if(!answer.continue) {
                return;
            }

            teams.reduce(function(acum, team){

                return acum.then(function() {

                    // var cloneOptions = {
                    //     fetchOpts: {
                    //         callbacks: {
                    //             transferProgress: function(value) {
                    //                 console.log(value.receivedObjects() + " of " + value.totalObjects());
                    //                 // console.log(value.indexedDeltas());
                    //                 // console.log(value.indexedObjects());
                    //                 // console.log(value.localObjects());
                    //                 // console.log(value.receivedBytes());
                    //                 // console.log(value.receivedObjects());
                    //                 // console.log(value.totalDeltas());
                    //                 // console.log(value.totalObjects());
                    //             }
                    //         }
                    //     },
                    //     checkoutOpts: new Git.CheckoutOptions({
                    //         progressCb: function(value) {
                    //             console.log(value);
                    //         }
                    //     })
                    // }
                    // return Git.Clone(team.repo, "./repositories/" + team.id + "-" + team.name + "/", cloneOptions)
                    var progresser = new Progresser(function() {
                        process.stdout.write(clc.bold("Cloning " + team.id + "-" + team.name + "'s repository" + this.dotdotdot + " \r"));
                    });
                    progresser.start();

                    return Git.Clone(team.repo, "./repositories/" + team.id + "-" + team.name + "/")
                                .then(function(repository) {
                                    progresser.stop();
                                    console.log(clc.bold("Cloning " + team.id + "-" + team.name + "'s repository...") + clc.green("done"));
                                })
                                .catch(function(error) {
                                    console.log(clc.red(" error: " + error));
                                    //console.log("Error on repository clone: " + error);
                                });
                });

            }, Promise.resolve());
        });
}

var pullRepos = function(teams, isForce) {

    teams.reduce(function(acum, team){

        return acum.then(function() {

            return Git.Repository.open("./repositories/" + team.id + "-" + team.name + "/")
                    .then(function(repository) {
                        return repository.fetchAll()
                                    .then(function() {
                                        return repository;
                                    });
                    })
                    .then(function(repository) {
                        return repository.mergeBranches("master", "origin/master");
                    })
                    .then(function(repository) {
                        console.log("Done pull for team: " + team.id);
                    })
                    .catch(function(error) {
                        console.log("Error on repository clone: " + error + " (team: " + team.id + ")");
                    });
        });

    }, Promise.resolve());

}

module.exports.listTeams = listTeams;
module.exports.reposStatus = reposStatus;
module.exports.cloneRepos = cloneRepos;
module.exports.pullRepos = pullRepos;
module.exports.listTeamsWithRepoStatus = listTeamsWithRepoStatus;