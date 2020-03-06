const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// GET- get all campgrounds
router.get('/', (req, res) => {
	// Find campgrounds in mongodb and render all of them
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('./campgrounds/index', { campgrounds: allCampgrounds});
		}
	});
});

// CREATE - Route used to create new campground
router.post('/', isLoggedIn, (req, res) => {
	// Create a new campground and save to DB
	let newCampground = new Campground({
		name: req.body.name,
		image: req.body.image,
		description: req.body.description,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	});
	newCampground.save((err, campground) => {
		if (err) {
			console.log(err);
		} else {
			console.log(campground);
			res.redirect('/campgrounds');
		}
	});
});

// GET - get page to create new campground
router.get('/new', isLoggedIn, (req, res) => {
	res.render('./campgrounds/new.ejs');
});

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
	Campground.findById(req.params.id)
		.populate('comments')
		.exec((err, foundCampground) => {
			if (err) {
				console.log(err);
				res.redirect('/campgrounds');
			} else {
				res.render('./campgrounds/show', { campground: foundCampground});
			}
		});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;