var db = require('mypg');

function (tableName, columnName) {
	columnName = columnName || 'name';
	var sql = [
		'select id,', columnName, 'from', tableName,
		'where', columnName, 'like ? order by', columnName
	].join(' ');
	return function (value) {
		return db.query(sql, ['%' + (value || '') + '%']);
	}
}

module.exports = {
	build: build
};
