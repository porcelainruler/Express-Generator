// Module Used
const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// Route for /leaders
leaderRouter.route('/')
.all((req , res , next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type' , 'text/plain');
    next();
})
.get((req , res , next) => {
    res.end('Will send all the leaders to you!');
})
.post((req , res , next) => {
    res.end('Will add the Leader: ' + req.body.name +
        ' with Details: ' + req.body.description)
})
.put((req , res , next) => {
    res.statusCode = 403;
    res.end('PUT Method not supported on  leaders');
})
.delete((req , res , next) => {
    res.end('Deleting all the leaders!');
});

// Route for /leaders/:leaderId
leaderRouter.route('/:leaderId')
.all((req , res , next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type' , 'text/plain');
    next();
})
.get((req , res , next) => {
    res.end('Will send the leader: ' + req.params.leaderId + ' to you');
})
.post((req , res , next) => {
    res.statusCode = 403;
    res.end('POST Method not supported on  leaders/' + req.params.leaderId);
})
.put((req , res , next) => {
   res.write('Updating the Leader: ' + req.params.leaderId + '\n');
   res.end('Will update the Leader: ' + req.body.name +
   ' with Details: ' + req.body.description)
})
.delete((req , res , next) => {
    res.end('Deleting leader:' + req.params.leaderId);
});

// Exporting Module
module.exports = leaderRouter;