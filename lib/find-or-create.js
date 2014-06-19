var _ = require('lodash');
var db = require('mypg');

function findOrCreate (tableName, discriminantName, discriminantValue) {
	var sql = ['select id from', tableName, 'where', discriminantName, '= $1'].join(' ');
	return db.querySingle(sql, [discriminantValue]).then(function (row) {
		if (row) return row.id;
		var props = _.zipObject([discriminantName], [discriminantValue]);
		return db.insert.call(this, tableName, props);
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
