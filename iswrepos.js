
var fs = require('fs');
var Git = require('nodegit');

// commands
var cmdListTeams = require('./cmdListTeams');


var data = JSON.parse(fs.readFileSync('./teams.json', 'utf8'));
var teams = data.teams;
//

// https://www.npmjs.com/package/commander
var cliOptions = require('commander');

cliOptions
  .version('0.1.0')
  .option('-t, --teams', 'shows teams info')
  .option('-s, --status', 'shows repositories status')
  // .option('-P, --pineapple', 'Add pineapple')
  // .option('-b, --bbq-sauce', 'Add bbq sauce')
  // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

if (cliOptions.teams) {
    cmdListTeams(teams);
}
if (cliOptions.status) {
    console.log('showing status ...');
}


// teams.forEach(function(team) {

//     var path = "./repositories/" + team.id + "-" + team.name + "/";

//     Git.Clone(team.repo, path).then(function(repository) {
//         console.log("done");

//         var recentCommit = repository.getBranchCommit("master");
//         console.log(recentCommit);
//         console.log(recentCommit.message());

//     });
// })


var getRepoCommitInfo = function(path) {
    return Git.Repository.open(path)
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

            // if(info.remoteCommit.id() != info.localCommit.id()) {
            //     console.log("El repositorio del grupo " + team.name + " necesita actualizarse.");
            // }
            return info;
        })
        .catch(function(error) {
            console.log(error);
        });
}

var cmdShowReposInfo = function(teams) {
    var gets = teams.map(function(team) {
        var path = "./repositories/" + team.id + "-" + team.name + "/";
        return getRepoCommitInfo(path);
    });

    Promise.all(gets)
        .then(values => {
            console.log(values);
        });
    // teams.forEach(function(team) {
    //     // console.log(team.name);
    //     // console.log(team.repo);




    // });
}




//cmdShowReposInfo(teams);