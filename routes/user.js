const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/singnup", (req, res) => {
    res.render("./users/singnup.ejs");
});

router.post("/singnup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.flash("success", "Welcome to Wanderlust");

        res.redirect("/listings");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/singnup");
    }
}));

router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
});

router.post("/login", passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), wrapAsync( async (req, res) => {
        req.flash("success", "Welcome to Wanderlust! You are logged in!");
        res.redirect("/listings");
}));

module.exports = router;