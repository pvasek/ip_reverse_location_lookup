var assert = require('assert');
var Q = require('q');
var parsingUtils = require('../utils/parsing_utils');
var binaryList = require('../utils/binary_list');
var directAcccess = require('../utils/direct_access');

var start = process.hrtime();

var stopwatch = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}

var testFilePath = './data/test.csv';
var testBigFilePath = './data/partial.csv';
var testVectorFilePath = './data/test_vector.csv';

describe('utils module', function(){

	describe('parsing', function() {
		it('should read whole file', function(done){
			this.timeout(5000);
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res
				.then(function(){
					assert.equal(100, data.length);
					done();
				}, function(){
				}, function(item) {
					data.push(item);
				})
				.catch(function(e) { done(e); });
		});



		it ('should construct ip from integer', function(){
			var ip = parsingUtils.numberToIp("2037380272");
			assert.deepEqual([121,111,244,176], ip);
		});

		it ('should parse valid ip', function(){
			var ip = parsingUtils.parseIp('121.111.244.176');
			assert.equal(2037380272, ip);
		});

		it ('should not parse invalid ip', function(){
			var ip = parsingUtils.parseIp('121.111.344.176');
			assert.equal(null, ip);
		});
	});


	describe('binary list', function(){

		it('should find a direct match (low area)', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = binaryList.createBinaryList(data);
				var result = list.find(2001406464);
				assert.equal("B", result.country);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});

		it('should find a direct match (high area)', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = binaryList.createBinaryList(data);
				var result = list.find(2001406478, true);
				assert.equal("B", result.country);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});

		it('should find in-direct match', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = binaryList.createBinaryList(data);
				var result = list.find(2001406470, true);
				assert.equal("B", result.country);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});

		it('should not found anything for missing ip', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = binaryList.createBinaryList(data);
				var result = list.find(2001406479, true);
				assert.equal(null, result);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});

		it('should find last item on the list', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = binaryList.createBinaryList(data);
				var result = list.find(2037380272, true);
				assert.equal("Z", result.country);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});
	});

	describe('direct access', function(){

		it('should find a direct match (low area)', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = directAcccess.createDirectAccessList(data);
				var result = list.find(2001406464);
				assert.equal("B", result);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});

		it('should find a direct match (high area)', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = directAcccess.createDirectAccessList(data);
				var result = list.find(2001406478, true);
				assert.equal("B", result);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});

		it('should find in-direct match', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = directAcccess.createDirectAccessList(data);
				var result = list.find(2001406470, true);
				assert.equal("B", result);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});

		it('should not found anything for missing ip', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = directAcccess.createDirectAccessList(data);
				var result = list.find(2001406479, true);
				assert.equal(null, result);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});

		it('should find last item on the list', function(done) {
			var res = parsingUtils.parseFile(testFilePath);
			var data = [];
			res.then(function(){

				var list = directAcccess.createDirectAccessList(data);
				var result = list.find(2037380272, true);
				assert.equal("Z", result);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});
	});

	describe.skip('should be performant enough', function(){

		it('binary search', function(done){
			this.timeout(20000);
			
			var dataPromise = parsingUtils.parseFile(testBigFilePath);
			var data = [];

			dataPromise.then(function(){			

				stopwatch('starting binary list WITHOUT precalculated initials');
				var list = binaryList.createBinaryList(data, false);
				stopwatch('building binary list');
				var result = list.find(2002534209);
				stopwatch('warm up');
				for (var i = 0; i < 1000000; i++) {
					var result = list.find(2002534209);
				}
				stopwatch('test for 1.000.000 calls');
				console.log();

				stopwatch('starting binary list WITH precalculated initials');
				var list = binaryList.createBinaryList(data, true);
				stopwatch('building binary list');
				var result = list.find(2002534209);
				stopwatch('warm up');
				for (var i = 0; i < 1000000; i++) {
					var result = list.find(2002534209);
				}
				stopwatch('test for 1.000.000 calls');
				console.log();

				stopwatch('starting binary list WITHOUT precalculated initials');
				var list = binaryList.createBinaryList(data, false);
				stopwatch('building binary list');
				var result = list.find(2002534209);
				stopwatch('warm up');
				for (var i = 0; i < 1000000; i++) {
					var result = list.find(2002534209);
				}
				stopwatch('test for 1.000.000 calls');
				console.log();
				var result = list.find(2037380272);
				assert.equal("JAPAN", result.country);

				stopwatch('starting binary list WITH precalculated initials');
				var list = binaryList.createBinaryList(data, true);
				stopwatch('building binary list');
				var result = list.find(2002534209);
				stopwatch('warm up');
				for (var i = 0; i < 1000000; i++) {
					var result = list.find(2002534209);
				}
				stopwatch('test for 1.000.000 calls');
				assert.equal("PHILIPPINES", result.country);

				console.log();
				stopwatch('starting direct access');
				var list = directAcccess.createDirectAccessList(data);
				stopwatch('building direct access list');
				var result = list.find(2002534209);
				stopwatch('warm up');
				for (var i = 0; i < 1000000; i++) {
					var result = list.find(2002534209);
				}
				stopwatch('test for 1.000.000 calls');

				assert.equal("PHILIPPINES", result);

				done();

			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });	
		});

	});

	describe('aditional tests', function(){
		it.skip ('can exceed 1GB limit', function(){
			this.timeout(200000);

			var bufferList = [];
			for (var i = 0; i < 0xff; i++) {
				var buff = new Buffer(0xffffff);
				bufferList[i] = buff;
				for (var j = 0; j < 0xffffff; j++) {
					buff[j] = 0;
				}
			}
			assert.equal(0, bufferList[0xff-1][0xffffff-1]);
		})
	})

	
});

