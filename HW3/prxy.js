var http      = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis')
var express = require('express')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})


client.del("redirects");

client.lpush("availablePorts",'3001')
client.lpush("availablePorts",'3002')

var ports = {};
var proxy   = httpProxy.createProxyServer(ports);
var server  = http.createServer(function(req, res)
{	client.rpoplpush('availablePorts','availablePorts',function(err,value) {
		if (err) throw err;
		proxy.web( req, res, {target: "http://127.0.0.1:"+value } );
		console.log("Redirecting to port :"+value)
	})
});

console.log("Proxy server listening on port: 3000");
server.listen(3000)
