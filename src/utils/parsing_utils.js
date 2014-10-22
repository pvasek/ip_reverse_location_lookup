var fs = require('fs');
var readline = require('readline');
var Q = require('q');

var parseIp = function(ipNumberString) {
	var i = parseInt(ipNumberString, 10);
	return [
		(i >> 24) & 0xff,
		(i >> 16) & 0xff,
		(i >> 8) & 0xff,
		i & 0xff
	];
};

var parseFile = function(filePath){

	var deferred = Q.defer();

	var rd = readline.createInterface({
	    input: fs.createReadStream(filePath),
	    terminal: false
	});	

	rd.on('line', function(line) {
		var array = line
				.split(',')
				.map(function(i){
					return i.replace(/"/g, '');
				});
		var item = {
			from: parseInt(array[0], 10),
			to: parseInt(array[1], 10),
			fromArray: parseIp(array[0]),
			toArray: parseIp(array[1]),
			country: array[3], 
			countryPart: array[4],
			city: array[5]
		};
		deferred.notify(item);
	});

	rd.on('close', function(){
		deferred.resolve();
	});

	return deferred.promise;
};

exports.parseFile = parseFile;
exports.parseIp = parseIp;