# soaj

SOA in JavaScript.

Easily have a central application to dispatch URLs to the correct services.

## Description

With a simple JSON configuration, define the routes and the HTTP services
behind them. For example:

```json
{
    "/users": {
        "hostname": "10.0.0.24",
        "port": 443,
        "https": true
    },
    "/articles": {
        "hostname": "10.0.0.25",
        "port": 80
    }
}
```

Will send all the requests matching `/users` to `10.0.0.24:80` and all the
requests matching `/articles` to `10.0.0.25:80`.

## Features

- HTTP fully supported
- HTTPS services supported
- JavaScript regular expressions supported for route definitions (the route
  is passed to `new RegExp()`)

Notable missing features:

- HTTPS server not supported

## Installation

    npm install soaj # to install the library only
    npm install -g soaj # to install the application

## Usage

### Binary usage

    $ soaj --help
    Usage: soaj [OPTION...] ROUTES_FILE

        -l IP_ADDRESS, --listen=IP_ADDRESS
            Define the IP address on which the application must listen to.
            Default value: 127.0.0.1

        -p PORT, --port=PORT
            Define the port on which the application must listen to.
            Default value: 2504

### API usage

```javascript
var Soaj = require('soaj');
var routes = require('./routes.json');
var port = 2504;
var ip = '127.0.0.1';
(new Soaj(routes)).listen(port, ip, function() {
    console.log('Listening on ' + ip + ':' + port);
});
```

## Contributors

- [Florian Margaine](http://margaine.com)

## License

MIT License
