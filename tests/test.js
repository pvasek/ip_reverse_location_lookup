var assert = require('assert');
var utils = require('../src/utils');

var start = process.hrtime();

var stopwatch = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}

describe('utils module', function(){

	it('should read whole file', function(done){
		this.timeout(5000);
		var res = utils.parseFile('./../data/test.csv');
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
		var ip = utils.parseIp("2037380272");
		assert.deepEqual([121,111,244,176], ip);
	});


	describe('binary list', function(){

		it('search direct match', function(done) {
			var res = utils.parseFile('./../data/test.csv');
			var data = [];
			res.then(function(){

				var list = utils.createBinaryList(data);
				var result = list.find(2001406464);
				assert.equal("B", result.country);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});

		it('search in-direct match', function(done) {
			var res = utils.parseFile('./../data/test.csv');
			var data = [];
			res.then(function(){

				var list = utils.createBinaryList(data);
				var result = list.find(2001406470);
				assert.equal("B", result.country);
				done();
			}, function(){
			}, function(item) {
				data.push(item);
			})
			.catch(function(e) { done(e); });
		});
	});

	it.skip('performence test', function(done){
		var res = utils.parseFile('./../data/partial.csv');
		var data = [];
		res.then(function(){

			stopwatch('building list..');
			var list = utils.createBinaryList(data);
			stopwatch('find1');
			var result = list.find(2002534209);
			stopwatch('find2');
			var result = list.find(2002534209);
			stopwatch('end');
			console.log('looking for: ' + 2002534209);
			console.log('got:');
			console.log(result);
			assert.equal("PHILIPPINES", result.country);
			done();
		}, function(){
		}, function(item) {
			data.push(item);
		})
		.catch(function(e) { done(e); });
	});




});

