
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

module.exports.listTeams = listTeams;
module.exports.reposStatus = reposStatus;