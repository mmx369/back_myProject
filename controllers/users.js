const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users.map((u) => u.toJSON()));
});

usersRouter.post("/", async (request, response, next) => {
  const body = request.body;
  console.log(3333, body);
  if (body.password === undefined || body.password.length < 5) {
    return response
      .status(400)
      .json({ error: "password must be at least 5 characters" });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      email: body.email,
      date: new Date(),
      passwordHash,
    });
    try {
      const savedUser = await user.save();
      response.json(savedUser.toJSON());
    } catch (exception) {
      next(exception);
    }
  }
});

module.exports = usersRouter;