const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			res.render('./comments/new', { campground: foundCampground});
		}
	});
});

router.post('/', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, (err, newComment) => {
				if (err) {
					console.log(err);
					res.redirect('/campgrounds');
				} else {
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					foundCampground.comments.push(newComment);
					foundCampground.save();
					res.redirect('/campgrounds/' + req.params.id);
				}
			});
		}
	});
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req,res)=>{
	Campground.findById(req.params.id,(err, campground)=>{
		if(!err){
			Comment.findById(req.params.comment_id,(err, comment)=>{
				if(!err){
					res.render("./comments/edit", {campground: campground, comment: comment});
				} else {
					console.log(err);
					res.redirect("back");
				}
			});
		} else {
			console.log(err);
			res.redirect("back");
		}
	})
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req,res)=>{
	req.body.comment.author = {
		id: req.user._id,
		username: req.user.username
	};
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err)=>{
		if(err){
			console.log("ERROR UPDATING COMMENT");
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});

router.delete('/:comment_id', middleware.checkCommentOwnership, (req,res)=>{
	Campground.findById(req.params.id,(err,campground)=>{
		if(!err && campground){
			let updatedComments = [];
			campground.comments.forEach((comment)=>{
				if(!comment._id.equals(mongoose.Types.ObjectId(req.params.comment_id))){
					updatedComments.push(comment);
				}
			});
			campground.comments = updatedComments;
			campground.save();
		}
	});
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			console.log(err);
			res.redirect("/");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

module.exports = router;