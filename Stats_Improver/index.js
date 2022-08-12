#!/usr/bin/env node

require('dotenv').config(); // for process.env.
const devcert = require('devcert');
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const path = require('path');
const HTTP_PORT = process.env.HTTP_PORT || 5000 // 3000?
const HTTPS_PORT = process.env.HTTPS_PORT
const app = new express();
const passport = require('passport');
const session = require('express-session');
const User = require('./models/User');
const Post = require('./models/Post');
const InactivePost = require('./models/InactivePost');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const internal = require('stream');
const user = require('./models/User');
const facebookStrategy = require('passport-facebook').Strategy;
const regexurlpattn = new RegExp(".+facebook\.com/.+");
const crypto = require('crypto');
const CryptoJS = require("crypto-js");
const parse = require('node-html-parser');
const { Server } = require('socket.io');
const { use } = require('passport');
const { post } = require('request');
const ENCRYPTION_IV = "6268890F-9B58-48";
const privateKey  = fs.readFileSync('./server.key', 'utf8');
const certificate = fs.readFileSync('./server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

mongoose.connect("mongodb+srv://nhdtxdy:tombeo01@cluster0.1nwrmhp.mongodb.net/bigbrothers", {
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

function createNonce() {
    return crypto.randomBytes(16).toString('base64');
}

// app.enable('trust proxy');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'haHAA MaN' }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended : false}));

  
passport.use(new facebookStrategy({
    clientID        : process.env.APPID,
    clientSecret    : process.env.SECRET,
    callbackURL     : `/facebook/callback`,
    // callbackURL     : `http:///facebook/callback`,

    profileFields: ['picture.type(large)', 'id', 'displayName', 'name'/*, 'gender','emails'*/]
}, (token, refreshToken, profile, done) => {
    User.findOne({'uid' : profile.id}, (err, user) => {
        if (err) return done(err);
        if (user) {
            user.token = token;
            user.nonce = createNonce();
            user.pic = profile.photos[0].value;
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
            newUser.pic = profile.photos[0].value;
            newUser.nonce = createNonce();
            newUser.save((err) => {
                if (err) throw err;
                return done(null, newUser);
            });
        }
    });
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
            if (req.path.includes(path)) {
                return next();
            }
        }
        return middleware(req, res, next);
    };
};

app.get('/profile', isLoggedIn, async (req, res) => { // req: request, res response
    let posts = [];
    let inactivePosts = [];
    for (const postId of req.user.posts) {
        let post = await Post.findById(postId);
        if (post) posts.push(post);
    }
    for (const postId of req.user.inactivePosts) {
        let inactivePost = await InactivePost.findById(postId);
        if (inactivePost) inactivePosts.push(inactivePost);
    }
    // put this last in the poll queue
    res.render('profile', {
        pageName : "profile",
        user : req.user, // get the user out of session and pass to template
        posts : posts,
        inactivePosts : inactivePosts,
    });
});
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
});
app.get('/postnow', isLoggedIn, (req, res) => {
    res.render("postnow", {
        pageName: "postnow",
        user: req.user,
    })
});
app.get('/topup', isLoggedIn, (req, res) => {
    res.render("topup", {
        pageName: "topup",
        user: req.user,
    })
});

app.get('/privacy_policy', (req, res) => {
    res.render("privacy_policy", {
        pageName: "privacy_policy",
        user: req.user,
    })
});

const fbScopes = [
    // 'email',
    // 'user_likes', 
    // 'user_gender', 
    'public_profile',
    // 'user_posts',
    // 'pages_manage_engagement',
    // 'pages_manage_posts',
    // 'pages_read_engagement',
    // 'manage_pages',
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
    Post.find({_id : {$nin : req.user.likedPosts}}).sort({createdAt : -1}).limit(10).exec((err, posts) => {
       if (err) throw err;
       res.render('home', {
        pageName : 'home',
        posts : posts,
        user : req.user,
       });
    });
});

app.get('/test', (req, res) => {
    res.render("sdk_test");
});

app.get('/post', isLoggedIn, (req, res) => {
    const id = req.query.id;
    Post.findById(id, (err, post) => {
        if (err) throw err;
        if (post) {
            // res.set('Cache-Control', 'public, max-age=60');
            res.render('singlePost', {
                post : post,
                user : req.user,
                pageName : "singlePost",
            });           
        }
        else {
            res.render('404');
        }
    })
});

app.get('/extension_required', (req, res) => {
    res.render('extension_required');
});

app.get("/download", function (req, res) {
    res.download(__dirname + "/files/Stats Improver Extension Obfuscated.zip", function (err) {
      if (err) {
        console.log(err);
      }
    });
  });
  

app.post('/post', isLoggedIn, (req, res) => {
    const data = req.body;
    console.log(data);
    const amount = parseInt(data.amount);
    if (!req.user.admin && (req.user.nonce != data.nonce || amount <= 0 || parseInt(data.goal) <= 0 || amount > req.user.balance || amount % parseInt(data.goal) != 0 || !regexurlpattn.test(data.href))) {
        console.log("DCMM");
        res.end("Learn to read, noob!");
        return;
    }
    console.log(data.href);
    console.log(regexurlpattn.test(data.href));
    req.user.balance -= amount;
    var newPost = new Post();
    newPost.reward = amount;
    newPost.goal = data.goal;
    newPost.href = data.href;
    newPost.available = data.goal; 
    newPost.description = data.message;
    newPost.opName = req.user.name;
    newPost.opPic = req.user.pic;
    newPost.createdAt = Date.now();
    newPost.opUid = req.user.uid;
    if (data.hideContent == 'on') newPost.hidden = true;
    newPost.save((err) => {
        if (err) throw err;
    });
    req.user.nonce = createNonce();
    req.user.posts.push(newPost._id);
    req.user.save((err) => {
        if (err) throw err;
    });
    res.redirect('/');
});

app.post('/delete', isLoggedIn, (req, res) => {
    if (req.body.opUid != req.user.uid || req.body.nonce != req.user.nonce) {
        res.end("You don't have permission to delete that post!");
        return;
    }
    Post.findByIdAndDelete(req.body.postId, (err, post) => {
        if (err) throw err;
        if (post) {
            var inactive = new InactivePost();
            inactive.href = post.href;
            inactive.opUid = post.opUid;
            inactive.reward = post.reward;
            inactive.description = post.description;
            inactive.createdAt = post.createdAt;
            inactive.goal = post.goal;
            inactive.available = post.available;
            req.user.inactivePosts.push(inactive._id);
            req.user.nonce = createNonce();
            User.updateOne({_id : req.user._id}, {
                $pullAll: {
                    posts: [{_id : post._id}],
                },
            });
            inactive.save((err) => {
                if (err) throw err;
            })
            req.user.save((err) => {
                if (err) throw err;
                res.redirect('/profile');
            })
        }
    });
});

app.post('/restore', isLoggedIn, (req, res) => {
 // TODO
    if (req.body.opUid != req.user.uid || req.body.nonce != req.user.nonce) {
        res.end("You don't have permission to restore that post!");
        return;
    }
    InactivePost.findByIdAndDelete(req.body.postId, (err, inactivePost) => {
        if (err) throw err;
        if (inactivePost) {
            User.updateOne({_id : req.user._id}, {
                $pullAll: {
                    inactivePosts: [{_id : inactivePost._id}],
                },
            });
            var post = new Post();
            post.href = inactivePost.href;
            post.description = inactivePost.description;
            post.reward = inactivePost.reward;
            post.goal = inactivePost.goal;
            post.available = inactivePost.available;
            post.createdAt = Date.now();
            post.opName = req.user.name;
            post.opPic = req.user.pic;
            post.opUid = req.user.uid;
            post.save((err) => {
                if (err) throw err;
            });
            req.user.posts.push(post._id);
            req.user.nonce = createNonce();
            req.user.save((err) => {
                if (err) throw err;
                res.redirect('/profile');
            })
        }
    });
});

app.post('/validate', (req, res) => {
    console.log("validate for id: " + req.body.id);
    let data = {success : false};
    User.findById(req.body.id, (err, user) => {
        if (user) {
            const ciphertext = req.body.ciphertext;
            const postId = req.body.postId;
            const bytes = CryptoJS.AES.decrypt(ciphertext, String(user.nonce), {iv: ENCRYPTION_IV});     
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (decrypted == "hidden_elem") {
                Post.findById(postId, (err, post) => {
                    if (post) {
                        if (user.likedPosts.includes(postId)) {
                            res.json(data);
                            return;
                        }
                        console.log("here");
                        data['success'] = true;
                        user.likedPosts.push(postId);
                        user.balance += post.reward / post.goal;
                        post.available -= 1;
                        if (post.available <= 0) {
                            // remove the post
                            var inactivePost = new InactivePost();
                            inactivePost.href = post.href;
                            inactivePost.opUid = post.opUid;
                            inactivePost.description = post.description;
                            inactivePost.reward = post.reward;
                            inactivePost.createdAt = post.createdAt;
                            inactivePost.goal = post.goal;
                            inactivePost.available = post.available;
                            inactivePost.save((err) => {
                                if (err) throw err;
                                User.findOne({uid : post.opUid}, (err, OP) => {
                                    if (err) throw err;
                                    if (OP) {
                                        User.updateOne({_id : OP._id}, {
                                            $pullAll: {
                                                posts: [{_id : post._id}],
                                            },
                                        });
                                        OP.inactivePosts.push(inactivePost._id);
                                        OP.save((err) => {
                                            if (err) throw err;
                                        })
                                    }
                                    post.remove((err) => {
                                        if (err) throw err;
                                    });
                                });
                            });
                        }
                        else {
                            post.save((err) => {
                                if (err) throw err;
                            });
                        }
                        user.nonce = createNonce();
                        user.save((err) => {
                            if (err) throw err;
                        });
                    }
                    res.json(data);
                });
                return;
            }
        }
        res.json(data);
    })
});

// const http_server = http.createServer(app);
const https_server = https.createServer(credentials, app);

// const io = new Server(http_server);

// io.on('connection', (socket) => {
//     console.log('A user connected to socket.io');
// })

// http_server.listen(HTTP_PORT, () => {
//   console.log(`Server is listening on http://localhost:${HTTP_PORT}`);
// });

https_server.listen(HTTPS_PORT, () => {
    console.log(`Https server is listening on https://localhost:${HTTPS_PORT}`);
})
// Ok
// Test change 3

