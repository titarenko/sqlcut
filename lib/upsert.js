var _ = require('lodash');
var update = require('./update');
var createIfNotExists = require('./create-if-not-exists');

function ctor (db) {
	return function (tableName, columns) {
		var updateRecord = update(db)(tableName, columns);
		var createRecord = createIfNotExists(db)(tableName, columns);
		return function (row) {
			var context = this;
			return updateRecord.call(context, row).then(function () {
				return createRecord.call(context, row);
			});
		};
	};
}

module.exports = ctor;
