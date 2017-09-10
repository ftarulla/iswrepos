
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
    .option('-i, --ids <ids>', 'filter teams by ids', (val) => { return val.split(',')})
    .option('-c, --clone', 'clones repositories')
    .option('-f, --force', 'force the given action')
    .parse(process.argv);

// filter teams by id?
if(cliOptions.ids && cliOptions.ids.length > 0) {
    teams = teams.filter(team => cliOptions.ids.includes(team.id));
}

//
if(cliOptions.teams && !cliOptions.status) {
    commands.listTeams(teams);
}
if(!cliOptions.teams && cliOptions.status) {
    commands.reposStatus(teams);
}
if(cliOptions.teams && cliOptions.status) {
    commands.listTeamsWithRepoStatus(teams);
}
if(cliOptions.clone) {
    commands.cloneRepos(teams, cliOptions.force);
}

