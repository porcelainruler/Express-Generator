var express = require('express');
var favoriteRouter = express.Router();
var User = require('../models/user');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Favorite = require('../models/favorite');
const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');


favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.all(authenticate.verifyUser)
//Get all favorite dishes
.get(function(req, res, next) {
  Favorite.findOne({
    })
    .populate('user')
    .populate('dishes')
  .exec(function(err, favorite) {
    if (err) {
      return next(err);
    }
    res.json(favorite);
  });
})
//Post various favorite dishes
.post(function(req, res, next) {
  console.log(req.body);
  Favorite.findOneAndUpdate({
    user: req.user
  }, {
    $addToSet: {
      dishes: req.body
    }
  }, {
    upsert: true,
    new: true
  }, function(err, favorite) {
    if (err) return next(err);
    console.log('Favorite dish list updated');
    res.json(favorite);
  });
})
//Delete All favorite dishes
.delete(function(req, res, next) {
  Favorite.findOneAndRemove({
    user: req.user
  }, function(err, resp) {
    if (err) return next(err);
    console.log('All favorites dishes were deleted');
    res.json(resp);
  });
});


favoriteRouter.route('/:dishId')
.all(authenticate.verifyUser)
//Post a specific favorite dish
.post(function(req, res, next) {
  console.log(req.body);
  Favorite.findOneAndUpdate({
    user: req.user
  }, {
    $addToSet: {
      dishes: req.params.dishId
    }
  }, {
    upsert: true,
    new: true
  }, function(err, favorite) {
    if (err) return next(err);
    console.log('Favorite dish list updated');
    res.json(favorite);
  
  });
})
//Delete a specific favorite dish
.delete(function(req, res, next) {
  Favorite.findOneAndUpdate({
    user: req.user
  }, {
    $pull: {
      dishes: req.params.dishId
    }
  }, {
    new: true
  }, function(err, favorite) {
    if (err) return next(err);
    console.log('Favorite dish: ' + req.params.dishId + ' was deleted');
    res.json(favorite);
  });
});
	
module.exports = favoriteRouter;