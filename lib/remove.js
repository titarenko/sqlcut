var Promise = require('bluebird');
var _ = require('lodash');

function ctor (db) {
	return function (tableName) {
		var remove = function (id) {
			if (_.isArray(id)) {
				return Promise.all(id.map(remove.bind(this)));
			}
			return (this.user ? db.update(tableName, {
				id: id,
				remover_id: this.user.id,
				removed_at: new Date()
			}) : Promise.resolve()).then(function () {
				return db.remove(tableName, id);
			});
		};
		return remove;
	};
}

module.exports = ctor;
