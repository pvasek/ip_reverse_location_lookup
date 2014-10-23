var express = require('express');
var directAccess = require('./../utils/direct_access');
var parsingUtils = require('./../utils/parsing_utils');

var router = express.Router();
var list = null;

var initialize = function() {
	console.log('initializing...');
	var dataPromise = parsingUtils.parseFile('./data/partial.csv');
	var data = [];

	dataPromise.then(function(){			
		list = directAccess.createDirectAccessList(data);
		console.log('initialized');
	}, function(){
	}, function(item) {
		data.push(item);
	});
};

initialize();

router.get('/ip/:ip', function(req, res) {
	var ip = parsingUtils.parseIp(req.params.ip);

	var result = {};
	if (ip === null) {
		result = {country: '', error: 'ip address is in incorect format'};
	} else {
		console.log(ip);
		var country = list.find(ip);
		console.log(country);
		if (country === null) {			
			result = {country: '', error: 'ip address not found'};
		} else {
			result = { country: country };
		}
	}
	
	// remove for testing
	// this will not be chaning too often, just cache it everywhere for 1 hours
	//res.setHeader('Cache-Control', 'public, max-age=3600');
    //res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());

    res.send(result);
});

module.exports = router;
