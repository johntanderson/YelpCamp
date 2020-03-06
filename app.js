// =============================
// IMPORTED MODULES
// =============================
const express = require('express'),
    path = require('path'),
	mongoose = require('mongoose'),
	seedDB = require('./seeds'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	methodOverride = require('method-override'),
	User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');

// =============================
// EXPRESS SETUP
// =============================
const app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// =============================
// MONGOOSE SETUP
// =============================
const options = {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true
};
mongoose.connect('mongodb://localhost:27017/yelp_camp', options, () => {
	console.log('Database connected');
	// seedDB(); // Seed database
});

// =============================
// AUTHENTICATION MIDDLEWARE
// =============================
app.use(
	require('express-session')({
		secret:
			'7ruvjF+?sP6^Lv!Mx!?YB$ZJ?gmdA8JpN$n_FsQtR5JjUp&%U5$vSUztvV7Vr&D4D?Ry4n6T$8U9bDVtwb7PJeF-kM5X7nnJ^!G4=Da?Cdw7UWFy?_EhQU32F=fX-_GLP4c!?SQghfk37?UM9j=pB59%p?@Q8aSj8@rXU?KC?WCM?b?+@?93LL$TxfeQCVr-Q@gq!t76_fWJKTRT3@M8WDL2gKa+x92cp9sVym6Yh&guduML?!SP%^Rry!ms!eWc',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// =============================
// START SERVER LISTENER
// =============================
app.listen(5000, () => {
	console.log('Local Server Started On Port 5000');
	console.log('Ensure NGINX proxies 127.0.0.1:5000');
});
