const blogsRouter = require("express").Router();
const Blog = require("../models/bloglist.js");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { request, response } = require("express");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(response.token, process.env.SECRET);

  if (!response.token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    content: body.content,
    likes: 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog.toJSON());
});

blogsRouter.put("/:id", async (request, response) => {
  console.log(3393939393939, request.body);

  if (!response.token) {
    return response.status(401).json({ error: "token missing" });
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(response.token, process.env.SECRET);
  } catch (e) {
    response.status(401).json({ error: e });
  }
  if (!response.token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const likes = request.body.likes;

  const blog = await Blog.findById(request.params.id);

  if (decodedToken.id === blog.user.toString()) {
    const newResponse = await Blog.findByIdAndUpdate(request.params.id, {
      likes: likes,
    });
    console.log(99999999, newResponse);

    const blogsList = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    console.log(99999999, blogsList);
    response.json(blogsList);
  } else {
    response.status(401).json({ error: "wrong user" });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!response.token) {
    return response.status(401).json({ error: "token missing" });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(response.token, process.env.SECRET);
  } catch (e) {
    response.status(401).json({ error: e });
  }

  if (!response.token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blog = await Blog.findById(request.params.id);

  if (decodedToken.id === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    console.log(12345, request.params.id);
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    console.log(2345, blogs);
    response.json(blogs.map((blog) => blog.toJSON()));
  } else {
    response.status(401).json({ error: "wrong user" });
  }
});

module.exports = blogsRouter;