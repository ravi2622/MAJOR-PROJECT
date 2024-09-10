const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview);
    console.log("this is a listing := ", listing);

    listing.reviews.push(newreview);

    await newreview.save().then(res => { console.log(res) }).catch(err => { console.log(err) });
    await listing.save().catch(err => { console.log(err) });

    console.log("new review save!");
    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewsId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } }).then(res => { console.log(res) }).catch(err => { console.log(err) });
    await Review.findByIdAndDelete(reviewsId);

    req.flash("success", "Successfuly Review Deleted!");

    res.redirect(`/listings/${id}`);
};