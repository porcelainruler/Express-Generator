// Modules Used
const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// Route for /dishes
dishRouter.route('/')
.all((req , res , next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type' , 'text/plain');
    next();
})
.get((req , res , next) => {
    res.end('Will send all the dishes to you!');
})
.post((req , res , next) => {
    res.end('Will add the Dish: ' + req.body.name +
        ' with Details: ' + req.body.description)
})
.put((req , res , next) => {
    res.statusCode = 403;
    res.end('PUT Method not supported on /dishes');
})
.delete((req , res , next) => {
    res.end('Deleting all the dishes!');
});

// Route for /dishes/:dishId
dishRouter.route('/:dishId')
.all((req , res , next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type' , 'text/plain');
    next();
})
.get((req , res , next) => {
    res.end('Will send the dish: ' + req.params.dishId + ' to you');
})
.post((req , res , next) => {
    res.statusCode = 403;
    res.end('POST Method not supported on /dishes/' + req.params.dishId);
})
.put((req , res , next) => {
   res.write('Updating the Dish: ' + req.params.dishId + '\n');
   res.end('Will update the Dish: ' + req.body.name +
   ' with Details: ' + req.body.description)
})
.delete((req , res , next) => {
    res.end('Deleting dish:' + req.params.dishId);
});

// Exporting Module
module.exports = dishRouter;