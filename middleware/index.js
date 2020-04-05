const Comment = require('../models/comment');
const Campground = require('../models/campground');

module.exports = {
    checkCampgroundOwnership: function(req,res,next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id,(err,foundCampground)=>{
                if(!err && foundCampground){
                    if(foundCampground.author.id && foundCampground.author.id.equals(req.user.id)){
                        next();
                    } else {
                        req.flash("error", "Permission Denied!");
                        res.redirect('/campgrounds/'+req.params.id);
                    }
                } else {
                    req.flash("error", "Campground Does Not Exist!");
                    res.redirect('/campgrounds');
                }
            });
        } else {
            req.flash("error", "Permission Denied, Please Log In!");
            req.session.redirectTo = req.originalUrl;
            res.redirect('/login');
        }
    },

    checkCommentOwnership: function(req,res,next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,(err,foundComment)=>{
                if(!err && foundComment){
                    if(foundComment.author.id && foundComment.author.id.equals(req.user.id)){
                        next();
                    } else {
                        console.log("User not owner!");
                        res.redirect('back');
                    }
                } else {
                    req.flash("error", "Error Finding Specified Comment!");
                    res.redirect('back');
                }
            });
        } else {
            req.flash("error", "Please Log In First!");
            res.redirect('back');
        }
    },

    isLoggedIn: function(req,res,next){
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "Please Login First!");
        req.session.redirectTo = req.originalUrl;
        res.redirect("/login");
    }

}