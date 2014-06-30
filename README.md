# sqlcut

SQL shortcuts.

# Construction

```js
var sqlcut = require('sqlcut');
var db = sqlcut('sqlcut-pg', 'postgres://user:password@server/db');

db.query(
	'select * from users where email = ? and is_active = ?',
	'bobo@example.com',
	true
).then(console.log);
```

Note that API construction method takes DB adapter module name.
At the moment options are:

* [sqlcut-pg](https://github.com/titarenko/sqlcut-pg)
* [sqlcut-mysql](https://github.com/titarenko/sqlcut-mysql)
* [sqlcut-mssql](https://github.com/titarenko/sqlcut-mssql)

You can implement your own module,
the only requirement for it is to have `query(sql, paramsArray)` method
which returns promise with query results (special case is insert query, it must return `id` of inserted record).

# API

Notes: 

* "promises" means "returns promise"
* to enable audit, call methods with context containing `user` object (with `id` property)

## context.system

Predefined context for calling methods on behalf of system.

## query(sql, param1, param2, ...)

Promises query result. If `param1` is an array, its elements will be treated as params.

```js
db.query('select * from products where name = ?', ['beer']).then(console.log);
```
## querySingle(sql, param1, param2, ...)

Promises first row of results.

## insert(tableName, record)

Promises identifier of record that is being inserted.

```js
db.insert('products', { name: 'beer' }).then(console.log);
```

## update(tableName, record)

Promises identifier of record that is being updated. Record must have identifier value.

```js
db.update('products', { id: 20, name: 'fish' }).then(console.log);
```

## remove(tableName, id)

Promises removal of record with given identifier from specified table.

```js
db.remove('products', 20).then(function () {
	console.log('Product 20 was removed');
});
```

## find(tableName, id)

Promises record with given identifier taken from specified table.

# Extra API

## tools.aggregate.build(options)

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

```js
{
	"groups": ["salesman"],
	"date_range": {
		"start": "2014-06-23T00:00:00.000Z",
		"end": "2014-06-29T23:59:59.999Z"
	},
	"filters": {
		"salesman_id": ["14"]
	}
}
```

## tools.associate.build(tableName, masterColumnName, slaveColumnName);

Builds function `associate(masterValue, slaveValuesArray)` which does association (many to many) of certain record with given children.

```js
var associate = tools.associate.build('ad_photos', 'ad_id', 'photo_id');
associate(12, [55, 12, 32]).then(function () {
	console.log('12th ad was associated with 55th, 12th and 32d photos.');
});
```

## tools.create.build(tableName, columns)

Builds `create(row)` function which promises id of record which will be created. `Columns` argument defines list of allowed column names, can be omitted to skip such filtering.

## tools.findOrCreate.build(tableName, discriminantName1, discriminantName2, ...)

Builds function `findOrCreate(discriminantValue1, discriminantValue2, ..., newObject)` which promises extraction or creation of record which match discrimination condition. Note that `newObject` optional parameter is used for providing more properties for "create" part of function.

```js
var findOrCreate = tools.findOrCreate.build('products', 'name');
findOrCreate('milk').then(console.log);
```

## tools.lookup.build(tableName, columnName)

Builds function `lookup(value)` which promises array of id-value objects.

- `tableName` - name of table to look up
- `columnName` - optional column name ('name' by default)

## tools.remove.build(tableName)

Builds function `remove(id)` which promises record deletion by `id`.

## tools.update.build(tableName, columns)

Builds `update(record)` function which promises update of `record`, which must have `id` property among updated ones. `Columns` argument defines list of allowed column names, can be omitted to skip such filtering.

## tools.createOrUpdate.build(tableName)

Builds function `createOrUpdate(record)` which promises creation (if record doesn't have `id` property) or update of corresponding record in DB.

```js
var createOrUpdate = tools.createOrUpdate.build('products');
createOrUpdate({ name: 'milk' }).then(console.log);
```

# License

BSD
