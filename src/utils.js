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

var createBinaryList = function(input, withRoutingTable) {
	// assume is already sorted
	var last = 0;
	var data = [];
	input.forEach(function(i){
		if (i.from && i.to) {
			if (i.from > i.to || last > i.from) {
				throw new Error('the list is not sorted');
			}
			last = i.to;
			data.push({value: i.from, country: i.country, routeKey: i.from >> 32});
			data.push({value: i.to, country: i.country, routeKey: i.to >> 32});
		}
	});

	var routingTable = {};
	if (withRoutingTable) {

	} else {
		routingTable.get = function() { 
			return { lo: 0, hi: data.length, mid: Math.floor(data.length / 2)}; 
		};
	}

	return {
		data: data,
		find: function(ip){
			var lastMid = 0;
			var initialValues = routingTable.get();
			var mid = initialValues.mid;
			var lo = initialValues.lo;
			var hi = initialValues.hi;

			while (true){
				var current = data[mid];
				var value = current.value;				
				if (value == ip) {
					return current;
				}
				if (ip < value) {
					hi = mid;
				} else {
					lo = mid;
				}
				mid = lo + Math.floor((hi - lo) / 2);
				
				if (lastMid == mid) {
					return current;
				}
				lastMid = mid;
			}			
		}
	};
}

exports.parseFile = parseFile;
exports.parseIp = parseIp;
exports.createBinaryList = createBinaryList;