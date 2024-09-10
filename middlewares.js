const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.validatelisting = (req, res, next) => {
    let { error } = listSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};

module.exports.validatereview = (req, res, next) => {
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

module.exports.isLoggdIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not a owner of the listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();    
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewsId } = req.params;
    let review = await Review.findById(reviewsId);
    console.log(review);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not a Author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
}