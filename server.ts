import http from 'http';
import fs from 'fs';
import mime from 'mime-types'; // third-party module

let lookup = mime.lookup; // alias for the lookup function

const port = process.env.PORT || 3000;

// Creates a Server Instance (Immutable)
const server = http.createServer(function(req, res)
{
  let path = req.url as string;

  if(path == "/")
  {
    path = "/index.html";
  }

  let mime_type = lookup(path.substring(1)) as string;

  console.log(path);

  fs.readFile(__dirname + path, function(err, data)
  {
    if (err) {
      res.writeHead(404);
      res.end("ERROR: 404 - File Note Found! " + err.message);
      return;
    }
    res.setHeader("X-Content-Type-Options", "nosniff"); // security
    res.writeHead(200, { "Content-Type": mime_type });
    res.end(data);
  });
});

// add an event listener
server.listen(port, function() 
{
  console.log(`Server running on Port: ${port}`);
});