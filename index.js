const express = require('express');
const bodyParser = require('body-parser');

const server = express();

//Middleware
server.use(bodyParser.json());

// Import and use the routes from route.js
const route = require('./route');
server.use('/api', route);

//Server running on below port details
const PORT = 3000; // we can use env port here in real time projects
server.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})
