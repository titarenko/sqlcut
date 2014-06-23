var _ = require('lodash');
var db = require('./db');

function build (tableName, columns) {
	return function (data) {
		data = _.isEmpty(columns) ? data : _.pick(data, columns);
		if (this.user) {
			data.creator_id = this.user.id;
			data.created_at = new Date();
		}
		return db.insert(tableName, data);
	};
}

module.exports = {
	build: build
};
