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

# License

BSD
