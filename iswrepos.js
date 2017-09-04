
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./repositories.json', 'utf8'));

console.log(data.repositories);

data.repositories.forEach(function(repository) {
    console.log(repository.name);
    console.log(repository.repo);
});
