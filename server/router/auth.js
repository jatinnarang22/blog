const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Jwt_secret } = require("../middleware/middleware");

router.post("/create", async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmpassword) {
      console.log("jatin");
      return res.status(400).send({ error: "Passwords do not match" });
    }

    // console.log(req.body.password);
    const { username, email, password } = req.body;

    // Validate user input
    // if (!(username && email && password )) {
    //   return res.status(400).send({ error: "All input fields are required" });
    // }

    // Check if user already exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send({ error: "User has already registered" });
    }

    // Hash the password
    const encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await User.create({
      username,
      email,
      password: encryptedUserPassword,
    });

    return res.send({ success: "Registration successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/create-session", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.findOne({ email });

    // console.log(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ _id: user._id, email: user.email }, Jwt_secret, {
        expiresIn: "30d",
      });
      // console.log(token._id);
      return res.send({ success: token });
    } else {
      return res.send({ error: "error u have to first login" });
    }
  } catch (err) {
    return res.send({ error: "Internal server error" });
  }
});

module.exports = router;
