'use strict';

module.exports = Soaj;

var http = require('http');

function Soaj(routes) {
    this.http = http.createServer();
    this.routes = Object.keys(routes);
    this.routesLen = this.routes.length;
    this.routesObject = routes;
    this.http.on('request', this.requestHandler.bind(this));
}

Soaj.prototype.listen = function() {
    return this.http.listen.apply(this.http, arguments);
};

Soaj.prototype.requestHandler = function(req, res) {
    var url = req.url;
    var routes = this.routes;
    var routesLen = this.routesLen;
    var route;
    for (var i = 0; i < routesLen; i++) {
        route = routes[i];
        if ((new RegExp(route)).test(url)) {
            this.proxyPass(req, res, this.routesObject[route]);
            return;
        }
    }

    // If no route is found
    error(res, 404, 'Page not found');
};

/**
 * "route" is an object of the following kind:
 * {
 *     "hostname": "127.0.0.1",
 *     "port": 1101
 * }
 */
Soaj.prototype.proxyPass = function(req, res, route) {
    var options = {
        headers: req.headers,
        hostname: route.hostname,
        port: route.port,
        path: req.url
    };

    // Special proxy headers
    var socket = req.socket;
    options.headers['X-Forwarded-For'] = socket.remoteAddress;
    options.headers['X-Forwarded-Port'] = socket.localPort;
    options.headers['X-Forwarded-Host'] = req.headers.host;

    var client = http.request(options, function(response) {
        res.statusCode = response.statusCode;
        var headers = response.headers;
        var data = '';
        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                res.setHeader(header, headers[header]);
            }
        }
        response.on('data', function(chunk) {
            data += chunk.toString();
        });
        response.on('end', function() {
            res.end(data);
        });
    });

    client.on('error', function(err) {
        error(res, 500);
    });

    console.log('Send the body too if there is one');
    console.log(req.trailers);
    /**
     * if (req.trailers) {
     *     client.write(req.trailers);
     * }
     * or something like this.
     */

    client.end();
};

function error(res, code, data) {
    res.statusCode = code;
    res.end(data);
}
