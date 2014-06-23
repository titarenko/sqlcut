var Q = require('q');
var _ = require('lodash');
var create = require('./create');

function buildAssociate (tableName, masterName, slaveName) {
	var create = create.build(tableName);
	return function (masterValue, slaveValues) {
		var context = this;
		return Q.all(slaveValues.map(function (slaveValue) {
			var data = _.zipObject([masterName, slaveName], [masterValue, slaveValue]);
			return create.call(context, data);
		}));
	};
}

module.exports = {
	build: buildAssociate
};
