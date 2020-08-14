const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");
const mongoose = require("mongoose");
const User = require("../models/user");
const Book = require("../models/book");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const book = require("../models/book");
const e = require("express");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const pdfFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(pdf|PDF)$/)) {
    req.fileValidationError = "Only PDF files are allowed!";
    return cb(new Error("Only files are allowed!"), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage });
const uploadBoth = function (req, file, cb) {
  // Accept images only
  uploadBookImage.single("bookImage");
  uploadPdf.single("bookPdf");
};
// const upload = multer({ storage: storage, fileFilter: pdfFilter });
// const uploadBookImage = multer({ storage: storage, fileFilter: imageFilter });
router.post(
  "/uploadBooks",
  upload.fields([
    {
      name: "bookImage",
      maxCount: 1,
    },
    {
      name: "bookPdf",
      maxCount: 1,
    },
  ]),
  (req, res, next) => {
    console.log(req.files.bookImage[0]);

    const books = new Book({
      name: req.body.bookname,
      bookPdf: req.files.bookPdf[0],
      bookImage: req.files.bookImage[0],
      _id: new mongoose.Types.ObjectId(),
    });
    books.save().then((result) => {
      if (result != null) {
        res.send(`Book Uploaded Successfully...Go Back`);
      } else {
        res.send(`File not uploaded`);
      }
    });
  }
);

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(401).json({
          message: "Auth Failed",
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            res.status(401).json({
              message: "Incorrect password",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
                userType: "User",
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );
            //   req.session.user = user[0];
            return res.redirect("http://localhost:3001/mainpage.html");
            //  res.status(200).json({
            //     message: "Auth Successful",
            //     token: token,
            //     UserDetails: user[0],
            //   });
          } else {
            res.status(500).json({
              message: "Auth Failed",
            });
          }
        });
      }
    });
});
router.post("/register", (req, res, next) => {
  console.log(req.body.email);

  bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
    const passwordHashed = hashedPassword;
    if (err) {
      res.json({
        error: err,
      });
    } else {
      console.log(passwordHashed);
      const user = new User({
        email: req.body.email,
        password: passwordHashed,
        _id: new mongoose.Types.ObjectId(),
      });
      User.findOne({ email: req.body.email })
        .exec()
        .then((result) => {
          if (result == null) {
            user
              .save()
              .then((result) => {
                console.log(user);
                res.send("registration success");
                res.status(200).json({
                  error: "registration success",
                });
              })
              .catch((error) => {
                res.send("registration failed");
                res.status(400).json({
                  error: "error in registration",
                });
                console.log(error);
              });
          } else {
            res.send("Already Exists");
            res.status(401).json({
              error: "already exists",
            });
          }
        });
    }
  });
});
router.get("/getBooks", (req, res, next) => {
  Book.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      const response = {
        count: docs.length,
        books: docs.map((docs) => {
          res.send(docs.bookImage.path);
          return docs;
        }),
      };
      res.status(200).json(response);
     
    
    });
    
});

module.exports = router;
