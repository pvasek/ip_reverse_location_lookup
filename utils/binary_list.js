var precalculateInitalValues = function(data) {

	var startIdx = 0;
	var startKey = -1;
	var result = new Array(0xffff);

	data.forEach(function (i, idx) {
		if (startKey === -1) {
			startKey = i.routeKey;
			startIdx = 0;
		}
		if (startKey !== i.routeKey || idx === data.length-1) {
			result[startKey] = {lo: startIdx, hi: idx, key: startKey};
			startIdx = idx;
			startKey = i.routeKey;
		}
	});
	return result;
};

var getKey = function(ip) {
	return ip >> 16;
}

var createBinaryList = function(input, withRoutingTable) {
	// assume is already sorted
	var last = 0;
	var data = [];

	var previousKey = -1;
	var previousKeyIndex = 0;

	input.forEach(function(i){
		if (i.from && i.to) {
			if (i.from > i.to || last > i.from) {
				throw new Error('the list is not sorted');
			}
			last = i.to;
			loKey = getKey(i.from);
			hiKey = getKey(i.to);
			data.push({value: i.from, low: true, country: i.country, routeKey: loKey});
			data.push({value: i.to, low: false, country: i.country, routeKey: hiKey});
		}
	});	

	var routingTable = {};
	if (withRoutingTable) {
		var precalculatedInitials = precalculateInitalValues(data);

		// var keyCount = 0;
		// precalculatedInitials.forEach(function(i) {
		// 	if (i) {
		// 		console.log(i);
		// 		keyCount++;
		// 	}
		// });
		// console.log("keyCount: " + keyCount);

		routingTable.get = function(index) {
			return precalculatedInitials[index];
		}
	} else {
		routingTable.get = function() { 
			return { lo: 0, hi: data.length }; 
		};
	}

	return {
		data: data,
		find: function(ip){
			var lastMid = 0;
			var initialValues = routingTable.get(getKey(ip));
			var mid = initialValues.lo + Math.floor((initialValues.hi-initialValues.lo) / 2);
			var lo = initialValues.lo;
			var hi = initialValues.hi;

			var numberOfIterations = 0;
			while (true){
				var current = data[mid];
				var value = current.value;				
				if (value === ip) {
					current.numberOfIterations = numberOfIterations;
					return current;
				}
				if (ip < value) {
					hi = mid;
				} else {
					lo = mid;
				}
				mid = lo + Math.floor((hi - lo) / 2);
				numberOfIterations++;
				if (lastMid == mid) {
					if (data[hi].low && data[hi].value === value || !data[lo].low && data[lo].value === value) {
						return null;
					}
					current.numberOfIterations = numberOfIterations;
					return current;
				}
				lastMid = mid;
			}			
		}
	};
}

exports.createBinaryList = createBinaryList;