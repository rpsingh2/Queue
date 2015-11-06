Cache, Proxies, Queues
=========================

### Setup

* Clone [this repo](https://github.com/CSC-DevOps/Queues.git).
* run `npm install`.
* Install redis and run on localhost:6379

### A simple web server

Use [express](http://expressjs.com/) to install a simple web server.

	var server = app.listen(3000, function () {
	
	  var host = server.address().address
	  var port = server.address().port
	
	  console.log('Example app listening at http://%s:%s', host, port)
	})

Express uses the concept of routes to use pattern matching against requests and sending them to specific functions.  You can simply write back a response body.

	app.get('/', function(req, res) {
	  res.send('hello world')
	})

### Redis

You will be using [redis](http://redis.io/) to build some simple infrastructure components, using the [node-redis client](https://github.com/mranney/node_redis).

	var redis = require('redis')
	var client = redis.createClient(6379, '127.0.0.1', {})

In general, you can run all the redis commands in the following manner: client.CMD(args). For example:

	client.set("key", "value");
	client.get("key", function(err,value){ console.log(value)});

### An expiring cache

Create two routes, `/get` and `/set`.

When `/set` is visited, set a new key, with the value:
When `/get` is visited, fetch that key, and send value back to the client: 

    app.get('/set', function(req, res)
    {
    client.set("newkey", "this message will self-destruct in 10 seconds")
    client.expire("newkey", 10)
    res.send("New Key has been set.")
    })


    app.get('/get', function(req, res) 
    {
        client.get("newkey", function(err, value)
         {
             res.send(value)
         });
    })


### Recent visited sites

Create a new route, `/recent`, which will display the most recently visited sites.

    app.get('/recent', function(req, res) 
    {
     client.lrange("recenturl", 0, 4, function(err, urls) 
     {
     res.send(urls);
     });
    });

### Cat picture uploads: queue

Implement two routes, `/upload`, and `/meow`.
 
A stub for upload and meow has already been provided.

Use curl to help you upload easily.

	curl -F "image=@./img/morning.jpg" localhost:3000/upload

Have `upload` store the images in a queue.  Have `meow` display the most recent image to the client and *remove* the image from the queue.

### Proxy server

Bonus: How might you use redis and express to introduce a proxy server?
See [rpoplpush](http://redis.io/commands/rpoplpush)

## [Screencast Link](https://www.youtube.com/watch?v=67CjheQHxKU)
