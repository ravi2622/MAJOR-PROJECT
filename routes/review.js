const express = require("express");
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

//reviews - post
router.post("/", validatereview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    console.log(newreview);
    console.log("this is a listing := ", listing);

    listing.reviews.push(newreview);

    await newreview.save().then(res => { console.log(res) }).catch(err => { console.log(err) });
    await listing.save().catch(err => { console.log(err) });

    console.log("new review save!");

    res.redirect(`/listings/${req.params.id}`);
}));

//delte review rout
router.delete("/:reviewsId", wrapAsync(async (req, res) => {
    let { id, reviewsId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } }).then(res => { console.log(res) }).catch(err => { console.log(err) });
    await Review.findByIdAndDelete(reviewsId);

    res.redirect(`/listings/${id}`);
}));

module.exports = router;