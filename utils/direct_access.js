

var createDirectAccessList = function(input){

	var countryMap = [];
	var bufferList = [];

	// collect countries & check ordering
	var last = 0;
	var countries = {};
	var countryIndex = 0;
	input.forEach(function(item){
		if (item.from && item.to) {
			if (item.from > item.to || last > item.from) {
				throw new Error('the list is not sorted');			
			}
			if (!countries[item.country]) {
				countries[item.country] = countryIndex;
				countryIndex++;	
			}			
		}
	});	
	for (var i in countries) {
		countryMap[countries[i]] = i;
	}

	input.forEach(function(item){
		if (item.from && item.to) {
			var key = item.from >> 24;
			var from = item.from & 0xffffff;
			var to = item.to & 0xffffff;
			var buffer = bufferList[key];
			if (!buffer) {
				buffer = new Buffer(0xffffff*2);
				bufferList[key] = buffer;
			} 
			for (var i = from; i <= to; i++) {
				var idx = countries[item.country];
				buffer[i] = idx & 0xff;
				buffer[i*2] = idx >> 8;
			}
		}
	});	

	// var bufferUsed = 0;
	// bufferList.forEach(function(buffer, idx) {
	// 	if (buffer) {
	// 		bufferUsed++;
	// 	}
	// });
	// console.log('used buffers: ' + bufferUsed);

	return {
		find: function(ip){
				var buffer = bufferList[ip >> 24];
				if (!buffer) {
					return null;
				}
				var bufferIdx = ip & 0xffffff;
				var idx = (buffer[bufferIdx*2] << 8) + buffer[bufferIdx];
				return countryMap[idx];
			}
	};
};

exports.createDirectAccessList = createDirectAccessList;