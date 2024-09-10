const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
    // if(!req.isAuthenticated()) {
    //     req.flash("error", "you must be logged in to create listing!");
    //     return res.redirect("/login");
    // }
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    console.log(listing);

    if (!listing) {
        req.flash("error", "listing does not exsit!");
        res.redirect("/listings");
    } else {
        res.render("./listings/show.ejs", { listing });
    }

};

module.exports.createListing = async (req, res, next) => {

    // let {title, description, image, price, location, country} = req.body;
    // let newListing = new Listing({
    //     title: title,
    //     description: description,
    //     image: {
    //         url: image,
    //         filename: 'listingimage',
    //     },
    //     price: price,
    //     location: location,
    //     country: country,
    // });

    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

    // let result = listSchema.validate(req.body);
    // console.log(result);
    // if(result.error) {
    //     throw new ExpressError(400, result.error);
    // }

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // if (!newListing.title) {
    //     throw new ExpressError(400, "Title is missing!");
    // }
    // if (!newListing.description) {
    //     throw new ExpressError(400, "description is missing!");
    // }
    // if (!newListing.price) {
    //     throw new ExpressError(400, "price is missing!");
    // }
    // if (!newListing.location) {
    //     throw new ExpressError(400, "location is missing!");
    // }
    // if (!newListing.country) {
    //     throw new ExpressError(400, "country is missing!");
    // }

    newListing.save().then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });

    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);

    if (!listing) {
        req.flash("error", "listing does not exsit!");
        res.redirect("/listings");
    } else {
        res.render("./listings/edit.ejs", { listing });
    }

    // res.render("./listings/edit.ejs", { listing });
};

module.exports.UpdateListing = async (req, res, next) => {
    let { id } = req.params;
    console.log(id);

    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Successfuly Edit listing!");

    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
};