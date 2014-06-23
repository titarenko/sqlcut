function get (module) {
	try {
		require.resolve(module)
		return require(module);
	} catch (e) {
		return null;
	}
}

module.exports = {
	api: get('mypg') || get('mymysql') || get('mymssql') || {
		query: function (sql, params) {
			return Q([]);
		},
		querySingle: function (sql, params) {
			return Q({});
		},
		find: function (tableName, id) {
			return Q({});
		},
		create: function (tableName, data) {
			return Q(1);
		},
		update: function (tableName, data) {
			return Q();
		},
		remove: function (tableName, id) {
			return Q();
		}
	}
};
