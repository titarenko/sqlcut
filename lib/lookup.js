var db = require('./db');

function build (tableName, columnName) {
	columnName = columnName || 'name';
	var sql = [
		'select id,', columnName, 'from', tableName,
		'where', columnName, 'like ? order by', columnName
	].join(' ');
	return function (value) {
		return db.api.query(sql, ['%' + (value || '') + '%']);
	};
}

module.exports = {
	build: build
};
