
var Printer = function(showMembers, showRepo) {
    this.showMembers = showMembers;
    this.showRepo = showRepo;
}
Printer.prototype.print = function(teams) {
    var self = this;

    teams.reduce(function(acum, team){
        return  acum.then(function() {
                        self.showMembers(team)
                        return team;
                    })
                    .then(self.showRepo)
                    .then(function() {
                        console.log("--------------------------------------------------------------------------------");
                    });
    }, Promise.resolve());
}

module.exports.Printer = Printer;