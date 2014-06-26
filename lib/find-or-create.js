var _ = require('lodash');
var create = require('./create');

function ctor (db) {
	function findOrCreate (tableName, discriminantNames, discriminantValues, newObject) {
		var sql = [
			'select id from', tableName,
			'where', discriminantNames.map(function (name) { return name + ' = ?'; }).join(' and ')
		].join(' ');
		var createInstance = create(db)(tableName).bind(this);
		return db.querySingle(sql, discriminantValues).then(function (row) {
			if (row) { 
				return row.id;
			}
			var data = _.zipObject(discriminantNames, discriminantValues);
			return createInstance(_.extend(data, newObject));
		});
	}

	return function () {
		var tableName = arguments[0];
		var discriminantNames = Array.prototype.slice.call(arguments, 1);
		
		return function () {
			var discriminantValues = Array.prototype.slice.call(arguments);
			var newObject;
			if (discriminantValues.length == discriminantNames.length + 1) {
				newObject = discriminantValues.pop();
			}
			return findOrCreate.call(this, tableName, discriminantNames, discriminantValues, newObject);
		};
	};
}

module.exports = ctor;
