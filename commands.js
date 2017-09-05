
var clc = require('cli-color');


var showTeamMembers = function(members) {
    console.log(clc.bold("   Members: "));

    var table = [
    // [clc.bold("   Nombre"), clc.bold("email")]
    ]
    members.forEach(member => {
        table.push(["   " + member.name, member.mail]);
    });
    console.log(clc.columns(table));
}

var showRepository = function(repo) {
    console.log(clc.bold("   Repository: ") + repo);
}


var Printer = function(showMembers, showRepo) {
    this.showMembers = showMembers;
    this.showRepo = showRepo;
}
Printer.prototype.print = function(teams) {
    teams.forEach(team => {
        console.log(clc.yellow(team.id + "-" + team.name));
        this.showMembers(team.members);
        this.showRepo(team.repo);
        console.log("--------------------------------------------------------------------------------");
    });
}



var listTeams = function(teams) {
    var printer = new Printer(showTeamMembers, showRepository);
    printer.print(teams);
}

module.exports.listTeams = listTeams;