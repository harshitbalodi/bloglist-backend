const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try{
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                //   user = new User({
                //     googleId: profile.id,
                //     name: profile.displayName,
                //     image: profile.photos[0].value,
                //     provider: "google",
                //   });
                //   await user.save();
                console.log("profile",profile);
                // const email = profile.emails[0].value;
                let username = profile.name['familyName'].toLowerCase()+profile.name['givenName'].toLowerCase();
                console.log('username', username);
                // Ensure the username is unique
                let userExists = await User.findOne({ username });
                let uniqueId = 1;
                
                while (userExists) {// Ensure the username is unique
                  username = `${username}${uniqueId}`;
                  userExists = await User.findOne({ username });
                  uniqueId++;
                }
      
                user = new User({
                  googleId: profile.id,
                  name: profile.displayName,
                  image: profile.photos[0].value,
                  provider: "google",
                  username: username,
                });
      
                await user.save();
                }
        
                return done(null, user);
            }catch(err){
                return done(err,false);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
});

module.exports = passport;