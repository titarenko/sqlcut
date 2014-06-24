var _ = require('lodash');

function ctor (databaseModuleName, connectionParameters) {
	var adapterBuilder = require(databaseModuleName);
	var queryNative = adapterBuilder(connectionParameters);

	function query (sql) {
		var params = arguments[1];
		if (params && !_.isArray(params)) {
			params = Array.prototype.slice.call(arguments, 1);
		}
		return queryNative(sql, params);
	}
	
	function querySingle () {
		return query.apply(this, arguments).then(function (rows) {
			return rows && rows[0];
		});
	}

	function insert (table, row) {
		var keys = _.keys(row).join(', ');
		var values = _.values(row);
		var placeholders = values.map(function () {
			return '?';
		}).join(', ');

		var sql = [
			'insert into', table, '(', keys, ')',
			'values (', placeholders, ')'
		].join(' ');

		return query(sql, values);
	};

	function update (table, row) {
		if (!row.id) {
			throw new Error('Can\'t update row without id.');
		}

		var pairs = _.pairs(row).filter(function (pair) {
			return pair[0] != 'id';
		});
		var placeholders = pairs.map(function (pair) {
			return pair[0] + ' = ?';
		});
		var values = pairs.map(function (pair) {
			return pair[1];
		});
		values.push(row.id);

		var sql = [
			'update', table, 'set', placeholders.join(', '),
			'where id = ?'
		].join(' ');
		
		return query(sql, values);
	};

	function find (table, id) {
		var sql = ['select * from', table, 'where id = ?'].join(' ');
		return db.query(sql, id);
	}

	function remove (table, id) {
		var sql = ['delete from', table, 'where id = ?'].join(' ');
		return db.query(sql, id);
	}

	return {
		query: query,
		querySingle: querySingle,
		insert: insert,
		update: update,
		find: find,
		remove: remove
	};
}

module.exports = ctor;
