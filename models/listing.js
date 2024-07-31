const { default: mongoose, set } = require("mongoose");
let schema = mongoose.Schema;

let listSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    image: {
            type: String,
            default: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE2MjI1MjI0NDQ0MzYzMjM4Mg%3D%3D/original/ae3426d1-fba4-44d4-bed2-690426f25f7a.jpeg?im_w=1440&im_q=highq",
            set: (v) => v === "" ? "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE2MjI1MjI0NDQ0MzYzMjM4Mg%3D%3D/original/ae3426d1-fba4-44d4-bed2-690426f25f7a.jpeg?im_w=1440&im_q=highq" : v,
    },
    price: {
        type: Number,
        // required: true,
    },
    location: {
        type: String,
        // required: true,
    },
    country: {
        type: String,
        // required: true,
    },
});

const Listing = mongoose.model("Listing", listSchema);
module.exports = Listing;