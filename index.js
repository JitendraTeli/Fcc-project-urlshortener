require('dotenv').config();
const express = require('express');
const dns = require('dns');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { URL } = require('url');


// Basic Configuration
const port = process.env.PORT || 3000;

let links = [];

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req,res,next) => {
  console.log(req.body.url);
   const urlObj = new URL(req.body.url);
   dns.lookup(urlObj.hostname, (err,address,family) => {
    console.log(err,address,family);
    if(err) return res.json({error: "invalid url"});
    
    next();
  });
})
app.post("/api/shorturl",(req,res) => {
  
  console.log(req.body.url);
  links.push(req.body.url);
  res.json({
    original_url: req.body.url,
    short_url: links.length - 1
  })
});

app.get("/api/shorturl/:short_url", (req,res) => {
  console.log(links[req.params.short_url])
  res.redirect(links[req.params.short_url]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
