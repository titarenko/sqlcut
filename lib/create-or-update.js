var _ = require('lodash');
var create = require('./create');
var update = require('./update');

function ctor (db) {
	return function (tableName) {
		var createRecord = create(db)(tableName);
		var updateRecord = update(db)(tableName);
		return function (data) {
			return data.id ? updateRecord(data) : createRecord(data);
		};
	};
}

module.exports = ctor;
