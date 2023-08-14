const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../controllers/auth.controller.js')

// Redirect the user to the Google signin page
router.get('/', passport.authenticate('google', {
    scope: ['email', 'profile']
}));
router.get('/callback', passport.authenticate('google', { failureRedirect: '/auth/callback/failure' }), (req, res) => {
    res.redirect('/auth/callback/success');
});
// Success
router.get('/callback/success', (req, res) => {
    if (!req.user) res.redirect('/auth/callback/failure');
    req.flash('success', "Logged in successfully")
    res.redirect(`/profile/${req.user._id}`);
});

// failure
router.get('/callback/failure', (req, res) => {
    res.send("Error");
})
// logout
router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

module.exports = router