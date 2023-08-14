const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../models/student')

passport.serializeUser(function (user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Your Credentials here.
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Credentials here.
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, async function (request, accessToken, refreshToken, profile, done) {
    try {
        //console.log(profile);
        const name = profile.displayName
        const email = profile.emails[0].value
        let existingUser = await User.findOne({ 'email': email });
        // if user exists return the user
        if (existingUser) {
            return done(null, existingUser);
        }
        // if user does not exist create a new user
          return request.res.redirect('/register');

    }
    catch (error) {
        return done(error, false)
    }

    // Token generation and verification are left
}
))