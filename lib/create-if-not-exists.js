var _ = require('lodash');
var Q = require('q');

function preprocess (columns, data) {
	data = _.isEmpty(columns) ? data : _.pick(data, columns);
	if (this.user) {
		data.creator_id = this.user.id;
		data.created_at = new Date();
	}
	return data;
}

function createIfNotExists (db, table, row) {
	var keys = _.keys(row).join(', ');
	var values = _.values(row);
	values.push(row.id);
	
	var placeholders = values.map(function () {
		return '?';
	}).join(', ');

	var sql = [
		'insert  into', table, '(', keys, ')',
		'select', placeholders, 'where not exists (select 1 from', table, 'where id = ?)'
	].join(' ');

	return db.query(sql, values);
}

function ctor (db) {
	return function (tableName, columns) {
		return function (data) {
			var context = this;

			if (!_.isArray(data)) {
				data = [data];
			}
			return Q.all(data.map(function (row) {
				row = preprocess.call(this, columns, row);
				return createIfNotExists(db, tableName, row);
			}));
		};
	};
}

module.exports = ctor;
