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
const User = require('./models/User');
const facebookStrategy = require('passport-facebook').Strategy;

const options = {
  key: fs.readFileSync('localhost+1-key.pem'),
  cert: fs.readFileSync('localhost+1.pem'),
};

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(session({ secret: 'pornhub' }))
  .use(passport.initialize())
  .use(passport.session()); 
  
passport.use(new facebookStrategy({
    clientID        : process.env.APPID,
    clientSecret    : process.env.SECRET,
    callbackURL     : "http://localhost:5000/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']

}, (token, refreshToken, profile, done) => {
    // asynchronous
    process.nextTick(() => {
        // find the user in the database based on their facebook id
        User.findOne({'uid' : profile.id}, (err, user) => {
            if (err) return done(err);
            if (user) {
                console.log("user found")
                console.log(user)
                return done(null, user);
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
// used to deserialize the user
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.get('/profile', isLoggedIn, (req, res) => {
    console.log(req.user)
    res.render('profile', {
        user : req.user // get the user out of session and pass to template
    });
});

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

app.get('/auth/facebook', passport.authenticate('facebook', {scope : ['email','user_likes']}));
app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/'
}));
app.get('/',(req,res) => {
    res.render("index3");
})

// const server = https.createServer(options, app);
const http_server = http.createServer(app);
http_server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

  

