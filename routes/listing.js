const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validatelisting = (req, res, next) => {
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

router.get("/", wrapAsync(async (req, res, next) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
}));

router.get("/new", wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
}));

router.post("/", validatelisting, wrapAsync(async (req, res, next) => {

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

    res.redirect("/listings");
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    res.render("./listings/edit.ejs", { listing });
}));

router.put("/:id", validatelisting, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    console.log(id);

    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id).populate("reviews");
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}));

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
x   
    res.redirect("/listings");
}));

module.exports = router;