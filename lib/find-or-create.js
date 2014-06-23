var _ = require('lodash');
var db = require('./db');
var create = require('./create');

function findOrCreate (tableName, discriminantName, discriminantValue) {
	var sql = ['select id from', tableName, 'where', discriminantName, '= ?'].join(' ');
	var create = create.build(tableName).bind(this);
	return db.api.querySingle(sql, [discriminantValue]).then(function (row) {
		if (row) { 
			return row.id;
		}
		var data = _.zipObject([discriminantName], [discriminantValue]);
		return create(tableName, data);
	});
}

function buildFindOrCreate (tableName, discriminantName) {
	return function (discriminantValue) {
		return findOrCreate.call(this, tableName, discriminantName, discriminantValue);
	};
}

module.exports = {
	build: buildFindOrCreate
};
