const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

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
router.post('/', middleware.isLoggedIn, (req, res) => {
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
			res.redirect('/campgrounds');
		}
	});
});

// GET - get page to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('./campgrounds/new.ejs');
});

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
	Campground.findById(req.params.id)
		.populate('comments')
		.exec((err, foundCampground) => {
			if (!err && foundCampground) {
				res.render('./campgrounds/show', { campground: foundCampground});
			} else {
				req.flash("error", "Campground Does Not Exist!");
				res.redirect('/campgrounds');
			}
		});
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if(!err){
			res.render('campgrounds/edit', {campground: foundCampground});
		} else {
			console.log(err);
			res.redirect('back');
		}
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground)=>{
		if(err){
			console.log(err);
			res.redirect('/');
		} else{
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err, campground)=>{
		if(!err && campground){
			Comment.deleteMany({
				"_id": {
					$in: campground.comments
				}
			}, (err)=>{
				if(!err){
					res.redirect("/campgrounds");
				} else {
					console.log(err);
					res.redirect("/");
				}
			});
		} else {
			console.log(err);
			res.redirect("/");
		}
	});
});

module.exports = router;