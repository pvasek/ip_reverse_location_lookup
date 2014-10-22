var fs = require('fs');
var readline = require('readline');
var Q = require('q');

var numberToIp = function(ipNumberString) {
	var i = parseInt(ipNumberString, 10);
	return [
		(i >> 24) & 0xff,
		(i >> 16) & 0xff,
		(i >> 8) & 0xff,
		i & 0xff
	];
};

var parseIp = function(ipText) {
	var parts = ipText
		.split('.')
		.map(function(i){ return parseInt(i, 10); });

	if (parts.length != 4) {
		return null;		
	}
	var result = 0;
	var invalid = false;
	parts.forEach(function(i){
		if (i === NaN || i > 255) {
			invalid = true;
		}
		result = result << 8;
		result += i;		
	});
	
	return invalid ? null : result;
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
			fromArray: numberToIp(array[0]),
			toArray: numberToIp(array[1]),
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
exports.numberToIp = numberToIp;