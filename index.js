var adapter = require('./lib/db');

function feature (adapter, name) {
	return {
		build: require('./lib/' + name)(adapter)
	};
}

module.exports = function (databaseModuleName, systemUser) {
	var db = adapter(databaseModuleName);
	return _.extend(db, {
		aggregate: feature(db, 'aggregate'),
		associate: feature(db, 'associate'),
		create: feature(db, 'create'),
		findOrCreate: feature(db, 'find-or-create'),
		lookup: feature(db, 'lookup'),
		remove: feature(db, 'remove'),
		update: feature(db, 'update'),
		context: {
			system: {
				user: systemUser || {
					id: 1
				}
			}
		}
	});
};
