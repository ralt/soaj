'use strict';

var mod_getopt = require('posix-getopt');
var Soaj = require('./lib/soaj');
var parser, option, ip, port;

parser = new mod_getopt.BasicParser('l:(listen)p:(port)h(help)', process.argv);

while ((option = parser.getopt()) !== undefined) {
    switch (option.option) {
        case 'l':
            ip = option.optarg || '127.0.0.1';
            break;
        case 'p':
            port = option.optarg || 2504;
            break;
        case 'h':
            console.log('Help required');
            break;
    }
}

if (parser.optind() >= process.argv.length) {
    console.error('missing required argument: routes file');
}

var file = require(process.argv[parser.optind()]);

(new Soaj(file)).listen(port, ip);
