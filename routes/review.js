const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validatereview, isLoggdIn, isReviewAuthor } = require("../middlewares.js");

// const validatereview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     console.log(error);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }
//     else {
//         next();
//     }
// }

// --> With controller and normal call backs
const reviewController = require("../controllers/review.js");

//reviews - post
// // router.post("/", validatereview, isLoggdIn, wrapAsync(async (req, res) => {
// //     let listing = await Listing.findById(req.params.id);
// //     let newreview = new Review(req.body.review);
// //     newreview.author = req.user._id;
// //     console.log(newreview);
// //     console.log("this is a listing := ", listing);

// //     listing.reviews.push(newreview);

// //     await newreview.save().then(res => { console.log(res) }).catch(err => { console.log(err) });
// //     await listing.save().catch(err => { console.log(err) });

// //     console.log("new review save!");
// //     req.flash("success", "New Review Created!");

// //     res.redirect(`/listings/${req.params.id}`);
// // }));
// router.post("/", validatereview, isLoggdIn, wrapAsync(reviewController.createReview));

//delte review rout
// // router.delete("/:reviewsId", isLoggdIn, isReviewAuthor,wrapAsync(async (req, res) => {
// //     let { id, reviewsId } = req.params;

// //     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } }).then(res => { console.log(res) }).catch(err => { console.log(err) });
// //     await Review.findByIdAndDelete(reviewsId);

// //     req.flash("success", "Successfuly Review Deleted!");

// //     res.redirect(`/listings/${id}`);
// // }));
// router.delete("/:reviewsId", isLoggdIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

//--> Router.route form and Uper code is comment before this code and two time commint a normal callbacks
router.route("/")
    .post(validatereview, isLoggdIn, wrapAsync(reviewController.createReview));

router.route("/:reviewsId")
    .delete(isLoggdIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;