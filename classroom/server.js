const express = require("express");
const app = express();
const path = require("path");
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


// //cookies for learn

const cookieParser = require("cookie-parser");

// // app.use(cookieParser());
// app.use(cookieParser("anysecretcod"));

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("origin", "India");
//     res.send("we send you a cookies!");
// });

// app.get("/greet", (req, res) => {
//     let { name = "anonymous" } = req.cookies;
//     res.send(`Hi, ${name}`);
// });

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("color", "red", { signed: true });
//     res.send("Done!");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.cookies);
//     console.log(req.signedCookies);
//     res.send(req.signedCookies);
// });

// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Hi, I am root!");
// });

// app.use("/users", users);
// app.use("/posts", posts);


//for the learn sesstions

// app.use(session({
//     secret: 'mysupersecretstring',
//     resave: false,
//     saveUninitialized: true,
//     // cookie: { secure: true }
//   }));

// app.get("/test", (req, res) => { //-> khali browserma sesstion id send thay che te jova mate banaviu che.
//     res.send("test sucsessfully");
// });

// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     };

//     res.send(`you are a send requvest ${req.session.count} time`);
// });

const sesstionOpstion = { //-> aa veriybal no use jo aapde futerma koi extra session ne add karva hoy to banaviu che jene aapde app.use() middelvar ma mokalsu.
    secret: 'mysupersecretstring',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}

app.use(session(sesstionOpstion));
app.use(flash());

app.use((req, res, next) => {
    res.locals.sucessMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");

    next();
});

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    console.log(req.session);
    req.session.name = name;
    console.log(req.session.name);

    // req.flash("success", "user registered succesfully");

    if (name === "anonymous") {
        req.flash("error", "user not registered!");
    } else {
        req.flash("success", "user registered succesfully");
    }

    // res.send(name);
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    // res.render("page.ejs", { name: req.session.name, msg: req.flash("success") });

    // res.locals.sucessMsg = req.flash("success"); //-> dayerect pass karvani have jaroor nathi auto metic page.ejs ma save thay jay che.
    // res.locals.errorMsg = req.flash("error");

    res.render("page.ejs", { name: req.session.name });
});

app.listen(3000, () => {
    console.log("Server is listening to 3000");
});