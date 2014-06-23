var db = require('./lib/db');

function Api () {
	this.aggregate = require('./lib/aggregate');
	this.associate = require('./lib/associate');
	this.create = require('./lib/create');
	this.findOrCreate = require('./lib/find-or-create');
	this.lookup = require('./lib/lookup');
	this.remove = require('./lib/remove');
	this.update = require('./lib/update');

	this.__defineSetter__('db', function (api) {
		db.api = api;
	});
	this.__defineGetter__('db', function () {
		return db.api;
	});
}

module.exports = new Api();
