var _ = require('lodash');
var db = require('mypg');

function buildAssociate (tableName, masterName, slaveName) {
	return function (masterValue, slaveValues) {
		return slaveValues.map(function (slaveValue) {
			var props = _.zipObject([masterName, slaveName], [masterValue, slaveValue]);
			return db.insert.call(this, tableName, props);
		}.bind(this));
	};
}

module.exports = {
	build: buildAssociate
};
