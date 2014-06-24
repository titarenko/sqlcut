var _ = require('lodash');

function ctor (db) {
	return function (tableName, columns) {
		return function (data) {
			data = _.isEmpty(columns) ? data : _.pick(data, columns);
			if (this.user) {
				data.creator_id = this.user.id;
				data.created_at = new Date();
			}
			return db.insert(tableName, data);
		};
	};
}

module.exports = ctor;
