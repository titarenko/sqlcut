var _ = require('lodash');
var create = require('./create');

function ctor (db) {
	function findOrCreate (tableName, discriminantName, discriminantValue, newObject) {
		var sql = ['select id from', tableName, 'where', discriminantName, '= ?'].join(' ');
		var create = create(tableName).bind(this);
		return db.querySingle(sql, discriminantValue).then(function (row) {
			if (row) { 
				return row.id;
			}
			var data = _.zipObject([discriminantName], [discriminantValue]);
			return create(_.extend(data, newObject));
		});
	}

	return function (tableName, discriminantName) {
		return function (discriminantValue, newObject) {
			return findOrCreate.call(this, tableName, discriminantName, discriminantValue, newObject);
		};
	};
}

module.exports = ctor;
