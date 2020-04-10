'use strict';

var ecc = exports;

function randomArray(length, max) {
	var rmax = max || 256;
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * rmax);
    });
}

ecc.version = require('./package.json').version;
ecc.utils = require('./utils');
ecc.rand = randomArray;
ecc.curve = require('./curve');
ecc.curves = require('./curves');

// Protocols
ecc.ec = require('./ec');
ecc.eddsa = require('./eddsa');
