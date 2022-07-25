require('dotenv').config();
const devcert = require('devcert');
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000 // 3000?
const app = new express();
const passport = require('passport');
const session = require('express-session');
const User = require('./models/user');
const Post = require('./models/post');
const mongoose = require('mongoose');
const facebookStrategy = require('passport-facebook').Strategy;

mongoose.connect("mongodb://localhost:27017/facebookauth", {
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(session({ secret: 'haHAA MaN' }))
  .use(passport.initialize())
  .use(passport.session()); 
  
passport.use(new facebookStrategy({
    clientID        : process.env.APPID,
    clientSecret    : process.env.SECRET,
    callbackURL     : "http://localhost:5000/facebook/callback",
    profileFields: ['picture.type(large)', 'id', 'displayName', 'name', 'gender','emails']

}, (token, refreshToken, profile, done) => {
    console.log(token);
    process.nextTick(() => {
        User.findOne({'uid' : profile.id}, (err, user) => {
            if (err) return done(err);
            if (user) {
                console.log("user found")
                user.token = token;
                user.save((err) => {
                    if (err) throw err;
                    return done(null, user);
                })
            }
            else {
                var newUser = new User();
                newUser.uid = profile.id;                  
                newUser.token = token;                    
                newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.email = profile.emails[0].value;
                newUser.gender = profile.gender
                newUser.pic = profile.photos[0].value
                newUser.save((err) => {
                    if (err) throw err;
                    return done(null, newUser);
                });
            }
        });
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())  {
        return next();
    }
    res.redirect('/login');
}

var unless = function(paths, middleware) {
    return function(req, res, next) {
        for (const path of paths) {
            console.log(path);
            if (req.path.includes(path)) {
                return next();
            }
        }
        return middleware(req, res, next);
    };
};

// app.use(unless(['login', 'logout', 'facebook', 'auth'] , isLoggedIn));

app.get('/profile', isLoggedIn, (req, res) => { // req: request, res response
    console.log(req.user)
    res.render('profile', {
        pageName : "profile",
        user : req.user, // get the user out of session and pass to template
    });
});

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
});

const fbScopes = [
    'email',
    'user_likes', 
    'user_gender', 
    'public_profile', 
    'user_friends', 
    'user_posts', 
    'user_photos', 
    'user_videos',
    'manage_pages',
];

app.get('/auth/facebook', passport.authenticate('facebook', {scope : fbScopes}));
app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/login'
}));
app.get('/login', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}, (req,res) => {
    res.render("login");
});
app.get('/', isLoggedIn, (req, res) => {
    res.render("home", {
        pageName : "home",
    });
});
app.get('/test', (req, res) => {
    res.render("sdk_test");
})

// const server = https.createServer(options, app);
const http_server = http.createServer(app);
http_server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

  

