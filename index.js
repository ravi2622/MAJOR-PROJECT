let express = require("express");
let app = express();
let port = 8080;
let path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listSchema, reviewSchema } = require("./schema.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")

const mongoose = require('mongoose');

main().then(res => console.log("Connecstion Successful"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.listen(port, (req, res) => {
    console.log(`The port will be listune at port - '${port}'`);
});

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
};

app.get("/", (req, res) => {
    res.send("welcome to the wanderlust :)");
});

// app.get("/testinglist", async (req, res) => {
//     let sampleList = new Listing({
//         title: "my new villa",
//         description: "by the beach!",
//         price: 1200,
//         location: "Calangute Goa",
//         country: "India",
//     });

//     await sampleList.save();
//     console.log("the data was save");
//     // res.send("Success testing!");
//     let testing = await Listing.find();
//     res.send(testing);
// });

//listing Routes are here for learn :=

app.use("/listings", listings);

// app.get("/listings", wrapAsync(async (req, res, next) => {
//     let allListings = await Listing.find();
//     res.render("./listings/index.ejs", { allListings });
// }));

// app.get("/listings/new", wrapAsync(async (req, res) => {
//     res.render("./listings/new.ejs");
// }));

// app.post("/listings", validatelisting, wrapAsync(async (req, res, next) => {

//     // let {title, description, image, price, location, country} = req.body;
//     // let newListing = new Listing({
//     //     title: title,
//     //     description: description,
//     //     image: {
//     //         url: image,
//     //         filename: 'listingimage',
//     //     },
//     //     price: price,
//     //     location: location,
//     //     country: country,
//     // });

//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "Send valid data for listing");
//     // }

//     // let result = listSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error) {
//     //     throw new ExpressError(400, result.error);
//     // }

//     let newListing = new Listing(req.body.listing);

//     // if (!newListing.title) {
//     //     throw new ExpressError(400, "Title is missing!");
//     // }
//     // if (!newListing.description) {
//     //     throw new ExpressError(400, "description is missing!");
//     // }
//     // if (!newListing.price) {
//     //     throw new ExpressError(400, "price is missing!");
//     // }
//     // if (!newListing.location) {
//     //     throw new ExpressError(400, "location is missing!");
//     // }
//     // if (!newListing.country) {
//     //     throw new ExpressError(400, "country is missing!");
//     // }

//     newListing.save().then(res => {
//         console.log(res);
//     }).catch(err => {
//         console.log(err);
//     });

//     res.redirect("listings");
// }));

// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     console.log(listing);
//     res.render("./listings/edit.ejs", { listing });
// }));

// app.put("/listings/:id", validatelisting, wrapAsync(async (req, res, next) => {
//     let { id } = req.params;
//     console.log(id);

//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "Send valid data for listing");
//     // }

//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// }));

// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     console.log(id);
//     const listing = await Listing.findById(id).populate("reviews");
//     console.log(listing);
//     res.render("./listings/show.ejs", { listing });
// }));

// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndDelete(id);

//     res.redirect("/listings");
// }));

//review Routes are here for learn :=

app.use("/listings/:id/reviews", reviews);

// //reviews - post
// app.post("/listings/:id/reviews", validatereview, wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newreview = new Review(req.body.review);
//     console.log(newreview);

//     listing.reviews.push(newreview);

//     await newreview.save().then(res => { console.log(res) }).catch(err => { console.log(err) });
//     await listing.save().catch(err => { console.log(err) });

//     console.log("new review save!");

//     res.redirect(`/listings/${req.params.id}`);
// }));

// //delte review rout
// app.delete("/listings/:id/reviews/:reviewsId", wrapAsync(async (req, res) => {
//     let {id, reviewsId} = req.params;

//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewsId}}).then(res => {console.log(res)}).catch(err => {console.log(err)});
//     await Review.findByIdAndDelete(reviewsId);

//     res.redirect(`/listings/${id}`);
// }))

app.all("*", (req, res, next) => {
    console.log("new error!");
    throw new ExpressError(404, "Page Not Found!");
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    console.log(err.message);

    res.status(statusCode).render("errors.ejs", { err });

    // res.status(statusCode).send(message);
});