const jwt = require("jsonwebtoken");
const passport = require("passport");
const loginWithGoogle=passport.authenticate("google", { scope: ["profile", "email"] })
const CallbackFromGoogle = (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/login" }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect("/login");
        const token = jwt.sign({ userid: user._id }, "keysecret");
        res.header("x-token", token);
        const redirectUrl = `yourapp://callback?token=${token}`;
        res.redirect(redirectUrl);

        // res.send({ message: "Login successful", token, user });
    })(req, res, next);
};
module.exports={
    loginWithGoogle,
    CallbackFromGoogle
}