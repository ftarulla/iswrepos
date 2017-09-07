
var Git = require('nodegit');
var clc = require('cli-color');

var showTeamMembers = function(team) {
    var promise = new Promise(function(resolve, reject) {

        console.log(clc.yellow(team.id + "-" + team.name));

        console.log(clc.bold("   Members: "));
        var table = [
        // [clc.bold("   Nombre"), clc.bold("email")]
        ]
        team.members.forEach(member => {
            table.push(["   " + member.name, member.mail]);
        });

        console.log(clc.columns(table));

        resolve(team);
    });

    return promise;
}

var showRepository = function(team) {
    console.log(clc.bold("   Repository: ") + team.repo);
}

var showRepositoryWithStatus = function(team) {

    return getRepoCommitInfo("./repositories/" + team.id + "-" + team.name + "/")
        .then(repoInfo => {

            var status = repoInfo.remoteCommit.id() == repoInfo.localCommit.id()
                            ? clc.green(" is up-to-date")
                            : clc.red(" is out-dated");

            console.log(clc.bold("   Repository: ") + team.repo + status);
        })
        .catch(function(error) {
            reject(error);
        });
}

///////////////////////////////////////////////////////////////////////////////
//
var getRepoCommitInfo = function(localPathToRepo) {
    return Git.Repository.open(localPathToRepo)
        .then(function(repository) {
            var info = {
                repo: repository,
            };
            return info;
        })
        .then(function(info) {
            return info.repo.getReferenceCommit('origin/master').then(function(commit) {
                info.remoteCommit = commit;
                return info;
            });
        })
        .then(function(info) {
            return info.repo.getReferenceCommit('master').then(function(commit) {
                info.localCommit = commit;
                return info;
            });
        });
}

module.exports.teamMembers = showTeamMembers;
module.exports.repository = showRepository;
module.exports.repositoryWithStatus = showRepositoryWithStatus;
