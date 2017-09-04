
var fs = require('fs');
var Git = require('nodegit');


var data = JSON.parse(fs.readFileSync('./teams.json', 'utf8'));
console.log(data.teams);


data.teams.forEach(function(team) {
    console.log(team.name);
    console.log(team.repo);

    var path = "./repositories/" + team.id + "-" + team.name + "32/";

    Git.Repository.open(path)
        .then(function(repository) {
            console.log("Repository found!!");
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
        })
        .then(function(info) {

            console.log(info.repo);
            console.log(info.remoteCommit.id());
            console.log(info.localCommit.id());

            if(info.remoteCommit.id() != info.localCommit.id()) {
                console.log("El repositorio del grupo " + team.name + " necesita actualizarse.");
            }
        })
        .catch(function(error) {
            console.log(error);
        });

    // Git.Clone(team.repo, path).then(function(repository) {
    //     console.log("done");

    //     var recentCommit = repository.getBranchCommit("master");
    //     console.log(recentCommit);
    //     console.log(recentCommit.message());

    // });
});
