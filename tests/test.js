var assert = require('assert');
var Q = require('q');
var parsingUtils = require('../src/utils/parsing_utils');
var binaryList = require('../src/utils/binary_list');

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



	it ('should parse ip', function(){
		var ip = parsingUtils.parseIp("2037380272");
		assert.deepEqual([121,111,244,176], ip);
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
				var result = list.find(2001406478);
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
				var result = list.find(2001406470);
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
				var result = list.find(2001406479);
				assert.equal(null, result);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});
	});

	it.only('performence test', function(done){
		var dataPromise = parsingUtils.parseFile(testBigFilePath);
		var data = [];
		
		dataPromise.then(function(){			

			stopwatch('starting');
			var list = binaryList.createBinaryList(data, false);
			stopwatch('building binary list');
			var result = list.find(2002534209);
			stopwatch('warm up');
			for (var i = 0; i < 1000000; i++) {
				var result = list.find(2002534209);
			}
			stopwatch('test for 1.000.000 calls');
			assert.equal("PHILIPPINES", result.country);
			done();

		}, function(){
		}, function(item) {
			data.push(item);
		})
		.catch(function(e) { done(e); });
		
	});




});

