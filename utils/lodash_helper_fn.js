const _ = require('lodash');

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCounts = _.countBy(blogs, 'author');
  const maxAuthor = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author]);

  return {
    author: maxAuthor,
    blogs: authorCounts[maxAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorLikes = _.groupBy(blogs, 'author');
  const maxAuthor = _.maxBy(Object.keys(authorLikes), (author) =>
    _.sumBy(authorLikes[author], 'likes')
  );

  return {
    author: maxAuthor,
    likes: _.sumBy(authorLikes[maxAuthor], 'likes'),
  };
};

module.exports = {
    mostBlogs, mostLikes
}
