var adapter = require('./lib/db');

function feature (adapter, name) {
	return {
		build: require('./lib/' + name)(adapter)
	};
}

module.exports = function (databaseModuleName, connectionParameters, systemUser) {
	var db = adapter(databaseModuleName, connectionParameters);
	
	db.context = {
		system: {
			user: systemUser || {
				id: 1
			}
		}
	};
	
	db.tools = {
		aggregate: feature(db, 'aggregate'),
		associate: feature(db, 'associate'),
		create: feature(db, 'create'),
		find: feature(db, 'find'),
		findOrCreate: feature(db, 'find-or-create'),
		createOrUpdate: feature(db, 'create-or-update'),
		lookup: feature(db, 'lookup'),
		remove: feature(db, 'remove'),
		update: feature(db, 'update')
	};

	return db;
};
