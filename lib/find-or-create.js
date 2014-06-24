var _ = require('lodash');
var create = require('./create');

function ctor (db) {
	function findOrCreate (tableName, discriminantName, discriminantValue) {
		var sql = ['select id from', tableName, 'where', discriminantName, '= ?'].join(' ');
		var create = create(tableName).bind(this);
		return db.querySingle(sql, discriminantValue).then(function (row) {
			if (row) { 
				return row.id;
			}
			var data = _.zipObject([discriminantName], [discriminantValue]);
			return create(data);
		});
	}

	return function (tableName, discriminantName) {
		return function (discriminantValue) {
			return findOrCreate.call(this, tableName, discriminantName, discriminantValue);
		};
	};
}

module.exports = ctor;
