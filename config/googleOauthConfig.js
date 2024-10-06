const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user/auth");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://backend-coding-yousseftarek80s-projects.vercel.app/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let existingUser = await User.findOne({ email: profile.emails[0].value });
                if (existingUser) {
                    return done(null, existingUser);
                }
                const newUser = new User({
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    googleId: profile.id,
                    isPhoneVerified: true, 
                });
                await newUser.save();
                const mailOptions = {
                    from: process.env.MAIL_USER,
                    to: profile.emails[0].value,
                    subject: 'Signup Successfully',
                    text: `Your Signup Successfully`,
                    headers: { 'X-Custom-Header': 'Custom Email Header' }
                };
                await transporter.sendMail(mailOptions);
                done(null, newUser);
            } catch (err) {
                done(err, false);
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
