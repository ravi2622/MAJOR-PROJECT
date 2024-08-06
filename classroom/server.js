const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

// app.use(cookieParser());
app.use(cookieParser("secretcode"));

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste");
    res.cookie("origin", "India");
    res.send("we send you a cookies!");
});

app.get("/greet", (req, res) => {
    let { name = "anonymous" } = req.cookies;
    res.send(`Hi, ${name}`);
});

app.get("/getsignedcookie", (req, res) => {
    res.cookie("color", "red", { signed: true });
    res.send("Done!");
});

app.get("/verify", (req, res) => {
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.send(req.signedCookies);
});

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, I am root!");
});

app.use("/users", users);
// app.use("/posts", posts);

app.listen(3000, () => {
    console.log("Server is listening to 3000");
});
