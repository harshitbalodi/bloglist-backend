const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { blogs } = require("../utils/constants");
const Blog = require("../models/blog");
const User = require('../models/user');
const { info, error } = require("../utils/loggers");
const api = supertest(app);

beforeAll(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  for (var blog of blogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
}, 10000);

describe('Acquiring data from the api',()=>{
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
})

describe('Posting and updating in api',()=>{
  let token;
  beforeEach(async()=>{
    await api
      .post('/api/users')
      .send({
        "username":"greatkhali",
        "password":"greatkhali",
        "name":"Great Khali"
      })
    const response = await api
      .post('/api/login')
      .send({
        "username":"greatkhali",
        "password":"greatkhali"
    })
    info(response.body);
    token = response.body.token;
  })

  test("post creates blog and blogs length increased", async () => {
    const blog = {
      title: "manual to Organize Strike",
      author: "Mahatama Gandhi",
      url: "https://www.dandimarch.com",
      likes: 943,
    }
    const orignalBlogs =await Blog.find({});
    const res = await 
    api
      .post("/api/blogs")
      .set('Authorization', `Bearer ${token}`)
      .send(blog);
    console.log("inside blog length", res);
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(orignalBlogs.length + 1);
  });

  test("no likes field means 0 likes", async () => {
    const blog = {
      title: "Organize Crime",
      author: "Micheal Corleone",
      url: "https://www.Godfather.com",
    }
    
    try {
      const response = await api.post("/api/blogs").set('Authorization', `Bearer ${token}`).send(blog);
      console.log("no likes 0 likes", response.body);
      expect(response.body.likes).toBe(0);
    } catch (error) {
      console.log(error);
    }
  });

  test("object without URL", async () => {
    const blog = {
      title: "Organize Crime in Mexico",
      author: "Funny Accent",
    }

    await api.post("/api/blogs").set('Authorization', `Bearer ${token}`).send(blog).expect(400);
  });

  test("object without title", async () => {
    const blog = {
      author: "Master of Blunders",
      url: "www.somethingisWrongwithyou.mad",
    }

    await api.post("/api/blogs").set('Authorization', `Bearer ${token}`).send(blog).expect(400);
  });

})

describe('Post request without token',()=>{

  test('PUT request without token should return 401', async(request, response)=>{
    const blog = {
      title:"The Open Society",
      author:"Gorege Soros",
      url:"www.opensocityfoundation.org",
      liked:-69
    }
    await api.post('/api/blogs').send(blog).expect(401);
  },15000)

  test('DELETE request without token should return 401', async(request, response)=>{
    await api.delete('/api/blogs/0987654456789').expect(401);
  }, 15000)
})


  afterAll(async () => {
    await mongoose.connection.close();
  });