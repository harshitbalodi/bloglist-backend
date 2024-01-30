const { dummy, totalLikes, favouriteBlog } = require("../utils/list_helper");
const { blogs } = require("../utils/constants");

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
