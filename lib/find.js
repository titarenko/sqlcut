function ctor (db) {
	return function () {
		var tableName = arguments[0];
		
		var discriminantNames = Array.prototype.slice.call(arguments, 1);
		if (discriminantNames.length == 0) {
			discriminantNames.push('id');
		}

		var sql = [
			'select id from', tableName,
			'where', discriminantNames.map(function (name) { return name + ' = ?'; }).join(' and ')
		].join(' ');
		
		return function () {
			var discriminantValues = Array.prototype.slice.call(arguments);
			return db.querySingle(sql, discriminantValues);
		};
	};
}

module.exports = ctor;
