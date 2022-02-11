const router = require("express").Router();
const User = require("../models/User.model");
const express = require("express");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.get("/users/signup", (req, res) => {
  res.render("users/signup.hbs");
});

router.post("/users/signup", (req, res) => {
  let errors = [];

  if (!req.body.email) {
    res.json("You did not enter an email!");

    //res.send - same thing
  }
  if (!req.body.password) {
    res.json("You need a password!");
  }
  if (errors.length > 0) {
    res.json(errors);
  }

  const salt = bcryptjs.genSaltSync(saltRounds);
  const hashedPass = bcryptjs.hashSync(req.body.password, salt);

  User.create({
    email: req.body.email,
    fullName: req.body.fullName,
    password: hashedPass,
  })
    .then((createdUser) => {
      console.log("User was created", createdUser);
      req.session.user = createdUser;
      res.render("profile.hbs");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
      res.json(err);
    });
});

//LOG IN
router.get("/users/login", (req, res) => {
  res.render("users/login");
});

router.post("/users/login", (req, res) => {
  let errors = [];

  if (!req.body.email) {
    errors.push("You did not enter a email!");
  }
  if (!req.body.password) {
    errors.push("You need a password!");
  }
  if (errors.length > 0) {
    res.renders(errors);
  }

  User.findOne({ email: req.body.email }).then((foundUser) => {
    if (!foundUser) {
      return res.render("Email not found");
      //return since we have nested checks- the app would continue instead of saying stop here
    }

    const match = bcryptjs.compareSync(req.body.password, foundUser.password);

    if (!match) {
      res.render("Incorrect password");
    }

    req.session.user = foundUser;
    console.log("user logged in");
    res.render("profile", { user: req.session.user });
    //user: req.session.user - user is what will be indentified in the views page.
  });
});

// router.get("/test-session", (req, res) => {
//   console.log("Req session", req.session);
//   if (req.session?.user?.username) {
//     res.json(`Hi ${req.session.user.username}!`);
//   } else {
//     res.json("You are not logged in");
//   }
// });

// router.get("/users//logout", (req, res) => {
//   req.session.destroy();
//   console.log("This is the session", req.session);
//   res.render("You are logged out");
// });

module.exports = router;
