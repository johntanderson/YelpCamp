const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// GET - gets landing page
router.get('/', (req, res) => {
	res.render('landing');
});

// =============================
// AUTH ROUTES
// =============================
router.get('/register', (req, res) => {
	if(req.user){
		res.redirect("/campgrounds");
	}else{
		res.render('register');
	}
});

router.post('/register', (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err,user)=>{
		if(err){
			console.log(err);
			return res.redirect("/register");
		} else {
			passport.authenticate("local")(req,res, ()=>{
				res.redirect("/campgrounds");
			});
		}
	});
});

router.get("/login", (req,res)=>{
	if(req.user){
		res.redirect("/campgrounds");
	}else{
		res.render("login");
	}
});

router.post("/login", (req,res,next)=>{
	passport.authenticate('local', (err,user,info)=>{
		if(err) {return next(err); }
		if(!user) { return res.redirect('/login'); }
		req.logIn(user, (err)=>{
			if(err) { return next(err); }
			let redirectTo = req.session.redirectTo;
			delete req.session.redirectTo;
			req.flash("success", "Successfully Logged In!");
			return res.redirect(redirectTo || '/campgrounds');
		})
	})(req,res,next);
});

router.get("/logout", (req,res)=>{
	req.logout();
	req.flash("success", "Successfully Logged Out!");
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;