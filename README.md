# mypg-tools

Tools for mypg lib.

# API

Methods require context (`this`) to have user property for audit reasons (convention of mypg).

## findOrCreate.build(tableName, discriminantName)

Builds function `findOrCreate(discriminantValue)` which promises extraction or creation of record which match discrimination condition.

```js
var findOrCreate = tools.findOrCreate.build('products', 'name');
findOrCreate('milk').then(console.log);
```

## associate.build(tableName, masterColumnName, slaveColumnName);

Builds function `associate(masterValue, slaveValuesArray)` which does association (many to many) of certain record with given children.

```js
var associate = tools.associate.build('ad_photos', 'ad_id', 'photo_id');
associate(12, [55, 12, 32]).then(function () {
	console.log('12th ad was associated with 55th, 12th and 32d photos.');
});
```

## aggregate.build(options)

Builds function `aggregate(query)` which does aggregation (grouping with further processing) with filtering option.

Options is object with following properties:

* `tableName` - name of target table
* `allowedGroupables` - optional, object where keys are columns that can participate in GROUP BY clause and values are additional fields that should be included in query

```js
{
	'date': null,
	'salesman': 'salesman_id',
	'country': 'country_id'
}
```

* `allowedFilterables` - optional, array of names of columns that can participate in WHERE clause

```js
[
	'salesman_id',
	'is_cold'
]
```

* `firstLevelColumns` - optional, columns that should be selected from table (often they are result of aggregation)
* `secondLevelColumns` - optional, columns that should be build on top of `firstLevelColumns` (for example, total averages)

Query is object with following properties:

* `date_range` - object with 2 properties: start and end which are dates in ISO format
* `groups` - array of column names
* `filters` - object: key is column name, value is array of allowed values

```
{"groups":["salesman"],"date_range":{"start":"2014-06-23T00:00:00.000Z","end":"2014-06-29T23:59:59.999Z"},"filters":{"salesman_id":["14"]}}
```

# License

BSD
