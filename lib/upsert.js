var _ = require('lodash');
var update = require('./update');
var create = require('./create');
var createIfNotExists = require('./create-if-not-exists');

function ctor (db) {
	return function (tableName, columns) {
		var updateRecord = update(db)(tableName, columns);
		var createRecord = create(db)(tableName, columns);
		var createRecordIfNotExists = createIfNotExists(db)(tableName, columns);
		return function (row) {
			var context = this;
			var isNew = _.isArray(row) && !row[0].id || !_.isArray(row) && !row.id;
			return isNew ? createRecord.call(context, row) : updateRecord.call(context, row).then(function () {
				return createRecordIfNotExists.call(context, row);
			});
		};
	};
}

module.exports = ctor;
