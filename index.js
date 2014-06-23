var lookup = require('./lib/lookup');
var findOrCreate = require('./lib/find-or-create');
var update = require('./lib/update');
var associate = require('./lib/associate');
var aggregate = require('./lib/aggregate');

module.exports = {
	lookup: lookup,
	findOrCreate: findOrCreate,
	update: update,
	associate: associate,
	aggregate: aggregate
};
