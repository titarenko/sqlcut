var db = require('mypg');
var _ = require('lodash');

function build (tableName, columns) {
	return function (data) {
		data = _.isEmpty(columns) ? data : _.pick(data, columns);
		return db.update.call(this, tableName, data);
	};
}

module.exports = {
	build: build
};
