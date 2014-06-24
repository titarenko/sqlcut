var _ = require('lodash');

function ctor (db) {
	function build (options) {

		var tableName = options.tableName;
		var allowedGroupables = options.allowedGroupables || {};
		var allowedFilterables = options.getAllowedFilterables || [];
		var firstLevelColumns = options.firstLevelColumns || [];
		var secondLevelColumns = options.secondLevelColumns || ['*'];
		
		function getAllowedGroupables(groupables) {
			return _.pick(allowedGroupables, groupables);
		}

		function getAllowedFilterables (query) {
			return _(query).pick(allowedFilterables).pick(function (value) {
				return value && value.length;
			}).valueOf();
		}

		function getColumns (query) {
			return _.map(query.groupByColumns, function (extra, column) {
				return extra ? [column, ', max(', extra, ') as ', extra].join('') : column;
			}).concat(firstLevelColumns).join(', ');
		}

		function getInClause (values, column) {
			var questionMarks = new Array(values.length + 1).join(', ?').slice(2);
			return [column, ' in (', questionMarks, ')'].join('');
		}

		function getNullCaseClause (values, column) {
			var hasNull = _.any(values, function (v) {
				return v === null;
			});
			return [column, ' is null and 1 = ', hasNull ? '1' : '0'].join('');
		}

		function getFilter (query) {
			return _(query.filterByColumnsValues).pairs().map(function (pair) {
				var column = pair[0];
				var values = pair[1];
				return ['and (', getInClause(values, column), ' or ', getNullCaseClause(values, column), ')'].join('');
			}).valueOf().join(' ');
		}

		function getGroupByStatement (query) {
			var groupColumns = _.keys(query.groupByColumns).join(', ');
			var sortColumns = _.map(query.groupByColumns, function (extra, column) {
				return extra || column;
			}).join(', ');
			return ['group by', groupColumns, 'order by', sortColumns].join(' ');
		}

		function getDateRange (query) {
			if (!query.date_range) {
				return null;
			}

			var start = query.date_range.start.slice(0, 10);
			var end = query.date_range.end.slice(0, 10);
			return {
				start: start,
				end: end
			};
		}

		function prepareQuery (query) {
			var groupables = getAllowedGroupables(query.groups);
			return {
				groupByColumns: groupables,
				filterByColumnsValues: getAllowedFilterables(query.filters),
				period: getDateRange(query)
			};
		}

		function getSql (query) {
			return [
				'select', secondLevelColumns.join(', '), 'from (select', getColumns(query),
				'from', tableName, 'where', query.period ? 'date >= ? and date <= ?' : '',
				getFilter(query), getGroupByStatement(query), ')'
			].filter(Boolean).join(' ');
		}

		function getQueryParams (query) {
			var filterValues = _.values(query.filterByColumnsValues);
			return [query.period.start, query.period.end].concat(_.flatten(filterValues));
		}

		return function (query) {
			query = prepareQuery(query);

			var sql = getSql(query);
			var params = getQueryParams(query);

			return db.query(sql, params);
		};
	};
}

module.exports = ctor;
