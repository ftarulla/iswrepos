
var fs = require('fs');

//
var commands = require('./commands');


var data = JSON.parse(fs.readFileSync('./teams.json', 'utf8'));
var teams = data.teams;
//


// https://www.npmjs.com/package/commander
var cliOptions = require('commander');

cliOptions
  .version('0.1.0')
  .option('-t, --teams', 'shows teams info')
  .option('-s, --status', 'shows repositories status')
  .parse(process.argv);

if (cliOptions.teams) {
    commands.listTeams(teams);
}
if (cliOptions.status) {
    commands.reposStatus(teams);
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




//cmdShowReposInfo(teams);