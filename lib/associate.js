var Promise = require('bluebird');
var _ = require('lodash');
var create = require('./create');

function ctor (db) {
	return function (tableName, masterName, slaveName) {
		var create = create(db)(tableName).bind(this);
		return function (masterValue, slaveValues) {
			return Promise.all(slaveValues.map(function (slaveValue) {
				var data = _.zipObject([masterName, slaveName], [masterValue, slaveValue]);
				return create(data);
			}));
		};
	};
}

module.exports = ctor;
