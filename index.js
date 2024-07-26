let express = require("express");
let app = express();
let port = 8080;
let path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");

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

app.get("/listings", async (req, res) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
});

app.get("/listings/new", async (req, res) => {
    res.render("./listings/new.ejs");
});

app.post("/listings", async (req, res) => {

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

    let newListing = new Listing(req.body.listing);

    newListing.save().then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });

    res.redirect("listings");
});

app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    res.render("./listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
});

app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
});