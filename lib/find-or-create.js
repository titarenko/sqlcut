var _ = require('lodash');
var find = require('./find');
var create = require('./create');

function ctor (db) {
	return function () {
		var tableName = arguments[0];
		var discriminantNames = Array.prototype.slice.call(arguments, 1);

		var findRecord = find(db)(tableName, discriminantNames);
		var createRecord = create(db)(tableName).bind(this);

		return function () {
			var discriminantValues = Array.prototype.slice.call(arguments);
			var newObject;
			if (discriminantValues.length == discriminantNames.length + 1) {
				newObject = discriminantValues.pop();
			}
			var context = this;
			return findRecord.apply(context, discriminantValues).then(function (row) {
				if (row) {
					return row.id;
				}
				var data = _.zipObject(discriminantNames, discriminantValues);
				return createRecord.call(context, _.extend(data, newObject));
			});
		};
	};
}

module.exports = ctor;
