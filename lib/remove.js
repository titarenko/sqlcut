var Q = require('q');

function ctor (db) {
	return function (tableName) {
		return function (id) {
			return (this.user ? db.update(tableName, {
				id: id,
				remover_id: this.user.id,
				removed_at: new Date()
			}) : Q()).then(function () {
				return db.remove(tableName, id);
			});
		};
	};
}

module.exports = ctor;
