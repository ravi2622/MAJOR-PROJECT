const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

// --> With controller and normal call backs
const userController = require("../controllers/user.js");

// // router.get("/singnup", (req, res) => {
// //     res.render("./users/singnup.ejs");
// // });
// router.get("/singnup", userController.renerSingupForm);

// // router.post("/singnup", wrapAsync(async (req, res) => {
// //     try {
// //         let { username, email, password } = req.body;
// //         const newUser = new User({ email, username });

// //         const registeredUser = await User.register(newUser, password);
// //         console.log(registeredUser);

// //         req.login(registeredUser, (err) => {
// //             if (err) {
// //                 return next(err);
// //             }
// //             req.flash("success", "Welcome to Wanderlust!");
// //             res.redirect("/listings");
// //         });

// //     } catch (error) {
// //         req.flash("error", error.message);
// //         res.redirect("/singnup");
// //     }
// // }));
// router.post("/singnup", wrapAsync(userController.singup));

// // router.get("/login", (req, res) => {
// //     res.render("./users/login.ejs");
// // });
// router.get("/login", userController.renerLoginForm);

// // router.post("/login", saveRedirectUrl, passport.authenticate("local", {
// //     failureRedirect: "/login",
// //     failureFlash: true
// // }), wrapAsync(async (req, res) => {
// //     console.log(req.user);
// //     req.flash("success", "Welcome to Wanderlust! You are logged in!");
// //     let redirectUrl = res.locals.redirectUrl || "/listings";
// //     res.redirect(redirectUrl);
// // }));
// router.post("/login", saveRedirectUrl, passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true
// }), wrapAsync(userController.login));

// // router.get("/logout", (req, res) => {
// //     req.logout((err) => {
// //         if (err) {
// //             return next(err);
// //         }
// //         req.flash("success", "logged you out");
// //         res.redirect("/listings");
// //     });
// // });
// router.get("/logout", userController.logout);

//--> Router.route form and Uper code is comment before this code and two time commint a normal callbacks
router.route("/singnup")
    .get(userController.renerSingupForm)
    .post(wrapAsync(userController.singup));

router.route("/login")
    .get(userController.renerLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), wrapAsync(userController.login));

router.route("/logout")
    .get(userController.logout);

module.exports = router;