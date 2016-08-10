var express = require('express')
var router = express.Router()
var models = require('../models')
var Page = models.Page;
var User = models.User;


router.get('/',function(res,req,next){
	User.findAll({})
		.then(function(theUsers){
			res.render('users',{
				users:theUsers
			})
		})
		.catch(next)
})

module.exports = router
