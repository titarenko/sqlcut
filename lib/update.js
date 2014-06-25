var _ = require('lodash');

function preprocess (columns, data) {
	data = _.isEmpty(columns) ? data : _.pick(data, columns);
	if (this.user) {
		data.updater_id = this.user.id;
		data.updated_at = new Date();
	}
	return data;
}

function ctor (db) {
	return function (tableName, columns) {
		return function (data) {
			data = _.isArray(data)
				? data.map(preprocess.bind(this, columns))
				: data = preprocess.call(this, columns, data);
			return db.update(tableName, data);
		};
	};
}

module.exports = ctor;
