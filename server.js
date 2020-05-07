const express = require('express'); // importing a CommonJS module
const morgan = require("morgan");
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// global middleware
server.use(express.json());  // built in middleware, no need to npm install it
server.use(morgan("tiny"));


server.use('/api/hubs', gate, role("dwarf"), hubsRouter);

function role(roleName) {
  return function(req, res, next){
    let role = req.headers.role;

  if (role === roleName){
    next();
  } else {
    res.status(403).json({ you: 'you have no power here' });
  }
};
}


// three amigas
server.use(function (req, res, next) {
  const today = new Date().toISOString();
  console.log(`[${today}] ${req.method} to ${req.url}`);
  next();
});

// server.use(gate);
  

server.get('/moria', (req, res) => {
  res.status(200).json({ welcome: "friends" });
});

function addMe(req, res, next){
  req.name = 'Cole';
  next();
}

server.get('/', addMe, (req, res) => {
  const name = req.name || "stranger";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${name} to the Lambda Hubs API</p>
    `);
});

function gate(req, res, next) {
  const password = req.headers.password;
  if(password) {
    if(password === 'mellon') {
      next();
    } else {
      res.status(401).json({ you: "cannot pass!"})
    }

  } else {
    res.status(400).json({ message: "speak friend and enter" })
  }
}

/*
  check the headers to see if there is a password property
  if there is, check that it is "mellon"
  if it is, call next();
  otherwise return status 401 and { you: "cannont pass!" }
  if there is no password, return status 400 and { message: "speak friend and enter" }
*/

module.exports = server;
