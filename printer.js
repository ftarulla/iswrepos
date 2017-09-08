
var Printer = function(showMembers, showRepo) {
    this.showMembers = showMembers;
    this.showRepo = showRepo;
}
Printer.prototype.print = function(teams) {

    teams.reduce((acum, team) => {
        return  acum.then(() => {
                        this.showMembers(team)
                        return team;
                    })
                    .then(this.showRepo)
                    .then(function() {
                        console.log("--------------------------------------------------------------------------------");
                    });
    }, Promise.resolve());
}

module.exports.Printer = Printer;