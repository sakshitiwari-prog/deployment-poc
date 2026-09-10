const express = require("express");
const router = require("./Routes/index");
const fs = require("fs");
const session = require("express-session");
const { MongoClient } = require("mongodb");
const cookieParser = require("cookie-parser");
const promiseFs = require("fs/promises");
const cors = require("cors");
const multer = require("multer");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
// mongoose 
const mongoose = require("mongoose");
app.use(cookieParser());
async function connectdb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (e) {
    console.log("error in connecting to db");
    console.log(e);
  }
}

// to allow json request
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
// cors middleware
const allowedOrigins = [
    "http://localhost:3000",
    "http://3.84.180.85:3000",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);
// const visitors = {};

// app.use((req, res, next) => {
//   let visitorId = req.cookies.visitorId;

//   if (!visitorId) {
//     visitorId = Date.now().toString();

//     visitors[visitorId] = {
//       visits: 0,
//       carts: [],
//     };

//     res.cookie("visitorId", visitorId, {
//       httpOnly: true,
//     });
//   }

//   req.visitorId = visitorId;

//   // IMPORTANT: initialize if missing (safety fix)
//   if (!visitors[visitorId]) {
//     visitors[visitorId] = { visits: 0, carts: [] };
//   }

//   next();
// });

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // true only when using HTTPS
//     },
//   }),
// );
app.post("/test", (req, res) => {
  res.json({
    message: "POST is working",
  });
});
app.use("/", router);
// app.get("/cart", (req, res) => {
//   const user = visitors[req.visitorId];

//   res.json({
//     cart: user.carts,
//   });
// });
// // test for multer middleware
// app.post("/upload", upload.single("profilePic"), (req, res) => {
//   res.send({
//     msg: "ok",
//   });
// });
// // test for url encoded middleware
// app.post("/register", (req, res) => {
//   res.json({
//     msg: "ok",
//   });
// });
// app.post("/cart", (req, res) => {
//   const user = visitors[req.visitorId];
//   user.carts.push(req.body.item);

//   res.json({
//     cart: user.carts,
//   });
// });
connectdb();
// error middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
console.log(process.env.PORT, "process.env.PORT");
app.listen(process.env.PORT, () => {
  console.log("connnected");
});
