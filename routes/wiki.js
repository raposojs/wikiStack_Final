var express = require('express')
var router = express.Router()
var models = require('../models')
var Page = models.Page;
var User = models.User;



router.get('/', function(req,res,next){
	Page.findAll({})
		.then(function(thePages){
			res.render('index',{
				pages:thePages
			});
		})
		.catch(next)
})

// receive info to build page
router.post('/', function(req,res,next){ // dont forget "next" for error
	console.log(req.body)

	User.findOrCreate({
		where:{
			email:req.body.authorEmail,
			name:req.body.authorName
		}
	})
		.spread(function(user, wasCreatedBool){
			return Page.create({
				title:req.body.title,
				content:req.body.content,
				status:req.body.status
			})
			.then(function(createdPage){
				return createdPage.setAuthor(user)
			})
		})
		.then(function(createdPage){
			res.redirect(createdPage.route)
		})
		.catch(next)


})

router.get('/add', function(req,res){
	res.render('addpage')
})

router.get('/:url', function(req,res,next){

	var pageUrl = req.params.url

	Page.find({
		where:{
			urlTitle: pageUrl
		}
	})
	.then(function(page){
		if(page === null){
			return next(Error ('Page was not found'))
		}

		page.getAuthor()
			.then(function(author){
				
				page.author = author;
				console.log(page)
				res.render('wikipage',{
					page:page
				});

			})
	})
	.catch(next)
})

module.exports = router;