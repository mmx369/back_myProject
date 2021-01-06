const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require('express-validator')
const loginRouter = require("express").Router();
const User = require("../models/user");


// /api/login/

loginRouter.post("/",
  [
    check('username', 'Username not found').exists(),
    check('password', 'Enter password').exists()
  ],

  async (request, response) => {
    try {
      const errors = validationResult(request)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Wrong username or password' })
      }

      const { username, password } = request.body
      const user = await User.findOne({ username });
      if (!user) {
        return response.status(400).json({ message: 'User not found' })
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash)

      if (!isMatch) {
        return res.status(401).json({ error: 'Wrong password, try again' })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

      response
        .status(200)
        .send({ token, username: user.username, name: user.name });

    } catch (e) {
      response.status(500).json({ message: 'Something goes wrong, try again' })
    }
  });

module.exports = loginRouter;