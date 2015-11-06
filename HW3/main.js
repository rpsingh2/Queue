var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	// ... INSERT HERE.
	client.lpush("recenturl", req.url, function(err, reply) {
        client.ltrim("recenturl", 0, 9);
    });

	next(); // Passing the request to the next handler in the stack.
});


 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
   // console.log(req.body) // form fields
   // console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
 	  		//console.log(img);
			client.rpush('images', img);
 		});
 	}

    res.status(204).end()
}]);

app.get('/meow', function(req, res) {
 	{	
	  	res.writeHead(200, {'content-type':'text/html'});
 		//if (err) throw err
		client.rpop("images",function (err,imagedata){
			if (err) throw err;
		//			console.log(imagedata);
			if (imagedata)
			{	
			
 		        res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
			}
			else
			{	res.write("Error! No Image found");
			 
				}
			res.end();
 		})
    	//res.end();
 	}
 })

//Complete set/get
app.get('/set', function(req, res) {
    client.set("newkey", "this message will self-destruct in 10 seconds")
    client.expire("newkey", 10)
    res.send("New Key has been set.")
})

app.get('/get', function(req, res) {
    client.get("newkey", function(err, value) {
        res.send(value)
    });
})


app.get('/recent', function(req, res) {
    client.lrange("recenturl", 0, 4, function(err, urls) {
        res.send(urls);
    });
});
/*app.get('/', function (req, res) {
  res.send('Hello World!');
});
*/

// HTTP SERVER
 var server = app.listen(process.argv[2], function () {

   var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
 })

