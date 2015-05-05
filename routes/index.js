var express = require('express');
var Start = require('../controllers/start.js');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
// if user is authenticated in the session, call the next() to call the next request handler
// Passport adds this method to request object. A middleware is allowed to add properties to
// request and response objects
    if (req.isAuthenticated()){
        return next();
    }
// if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function(passport){
    /* GET login page. */
    router.get('/', function(req, res) {
// Display the Login page with any flash message, if any
        if(req.isAuthenticated()){
            res.redirect('/home');
        }
        res.render('index', { message: req.flash('message') });
    });
    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash : true
    }));
    /* GET Registration Page */
    router.get('/signup', function(req, res){
        if(req.isAuthenticated()){
            res.redirect('/home');
        }
        res.render('register',{message: req.flash('message')});
    });
    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash : true
    }));
    /* GET Home Page */
    router.get('/home', isAuthenticated, function(req, res){
        res.render('home', { user: req.user });
    });
    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    /* Facebook Oauth2.0 */
    router.get('/auth/facebook', passport.authenticate('facebook'));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash : true
    }));

    /* Scrap : 접근한 유저에게 정해진 스크랩 데이터와 키워드를 넣어준다.*/
    router.get('/Scrap-data', isAuthenticated, function(req,res){
        Start.createUsrData(req,res);
    });

    // 다음으로 DB정보를 자유롭게 가공해저 전달하는 컨트롤러들을 만들어본다.
    return router;
}