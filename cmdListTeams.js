
var clc = require('cli-color');

var listTeams = function(teams) {
    console.log("Listing teams ...");

    teams.forEach(function(team) {
        console.log(clc.yellow(team.id + "-" + team.name));
        console.log(clc.bold("   Members: "));

        var table = [
            // [clc.bold("   Nombre"), clc.bold("email")]
        ]
        team.members.forEach(member => {
            table.push(["   " + member.name, member.mail]);
        });
        console.log(clc.columns(table));
        console.log(clc.bold("   Repository: ") + team.repo);
        console.log("--------------------------------------------------------------------------------");
    });

    console.log(clc.yellow("TOTAL: " + teams.length + " teams!"));

}

module.exports.list = listTeams;