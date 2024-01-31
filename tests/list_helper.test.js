const { dummy, totalLikes, favouriteBlog } = require("../utils/list_helper");
const { blogs } = require("../utils/constants");
const { mostBlogs, mostLikes} = require('../utils/lodash_helper_fn');

describe("Helper", () => {
  test("dummy returns one", () => {
    const blogs = [];

    const result = dummy(blogs);
    expect(result).toBe(1);
  });

  test("test of totalLikes", () => {
    const result = totalLikes(blogs);
    expect(result).toBe(36);
  });

  test("check the favorite Blog", () => {
    const result = favouriteBlog(blogs);
    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    });
  });
});

describe('most likes and most blogs',()=>{
  test('author with most likes', ()=>{
    const result = mostLikes(blogs)
    expect(result).toEqual({
      "author": "Edsger W. Dijkstra",  
       "likes": 17,
    })
  })

  test('author with most Blogs', ()=>{
    const result = mostBlogs(blogs)
    expect(result).toEqual({
      "author": "Robert C. Martin",    
       "blogs": 3
    })
    
  })
})