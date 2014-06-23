var _ = require('lodash');
var db = require('./db');

function build (tableName, columns) {
	return function (data) {
		data = _.isEmpty(columns) ? data : _.pick(data, columns);
		if (this.user) {
			data.updater_id = this.user.id;
			data.updated_at = new Date();
		}
		return db.api.update(tableName, data);
	};
}

module.exports = {
	build: build
};
