'use strict';

var mod_getopt = require('posix-getopt');
var Soaj = require('./lib/soaj');
var parser, option, ip, port;
var fs = require('fs');

var ip = '127.0.0.1';
var port = 2504;

parser = new mod_getopt.BasicParser('l:(listen)p:(port)h(help)', process.argv);

while ((option = parser.getopt()) !== undefined) {
    switch (option.option) {
        case 'l':
            ip = option.optarg;
            break;
        case 'p':
            port = option.optarg;
            break;
        case 'h':
            console.log('Help required');
            break;
    }
}

if (parser.optind() >= process.argv.length) {
    console.error('missing required argument: routes file');
}

fs.readFile(process.argv[parser.optind()], 'utf-8', function(err, data) {
    if (err) throw err;
    var routes = JSON.parse(data);
    (new Soaj(routes)).listen(port, ip, function() {
        console.log('Listening on ' + ip + ':' + port);
    });
});
