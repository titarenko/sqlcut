var _ = require('lodash');

function ctor (db) {
	return function (tableName, columns) {
		return function (data) {
			data = _.isEmpty(columns) ? data : _.pick(data, columns);
			if (this.user) {
				data.updater_id = this.user.id;
				data.updated_at = new Date();
			}
			return db.update(tableName, data);
		};
	};
}

module.exports = ctor;
