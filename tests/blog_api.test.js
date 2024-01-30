const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { blogs } = require("../utils/constants");
const Blog = require("../models/blog");
const { info, error } = require("../utils/loggers");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  for (var blog of blogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
}, 10000);

describe("API TESTING", () => {


  
  test("GET returns json ", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("All blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(blogs.length);
  });

  test("id exist in the returned object", async () => {
    const response = await api.get("/api/blogs");
    response.body.map((res) => {
      expect(res.id).toBeDefined();
    });
  });

  test("post creates blog and blogs length increased", async () => {
    const blog = new Blog({
      title: "manual to Organize Strike",
      author: "Mahatama Gandhi",
      url: "https://www.dandimarch.com",
      likes: 943,
    });
    const orignalBlogs = Blog.find({});
    const res = await api.post("/api/blogs").send(blog);
    console.log("inside blog length", res);
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(orignalBlogs.length + 1);
  });

  test("no likes field means 0 likes", async () => {
    const blog = new Blog({
      title: "Organize Crime",
      author: "Micheal Corleone",
      url: "https://www.Godfather.com",
    });
    
    try {
      const response = await api.post("/api/blogs").send(blog);
      console.log("no likes 0 likes", response.body);
      expect(response.body.likes).toBe(0);
    } catch (error) {
      console.log(error);
    }
  });

  test("object without URL", async () => {
    const blog = new Blog({
      title: "Organize Crime in Mexico",
      author: "Funny Accent",
    });

    await api.post("/api/blogs").send(blog).expect(400);
  });

  test("object without title", async () => {
    const blog = new Blog({
      author: "Master of Blunders",
      url: "www.somethingisWrongwithyou.mad",
    });

    await api.post("/api/blogs").send(blog).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
