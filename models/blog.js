// const mongoose = require('mongoose');

// // mongoose.set('strictQuery', false);

// const blogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   author: String,
//   url: {
//     type: String,
//   },
//   content:{
//     type:String
//   },
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   }],
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   comments: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     comment: {
//       type: String,
//       required: true,
//       minlength: 3
//     },
//     replies: [{
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//       reply: {
//         type: String,
//         required: true,
//         minlength: 3
//       },
//       nestedReplies: [{
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User',
//         },
//         reply: {
//           type: String,
//           required: true,
//           minlength: 3
//         }
//       }]
//     }]
//   }]
// });

// blogSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   }
// });

// const Blog = mongoose.model('Blog', blogSchema);

// module.exports = Blog;

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  url: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comment: {
      type: String,
      required: true,
      minlength: 3
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reply: {
        type: String,
        required: true,
        minlength: 3
      },
      nestedReplies: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reply: {
          type: String,
          required: true,
          minlength: 3
        }
      }]
    }]
  }],
  type: {
    type: String,
    enum: ['post', 'article'],
    required: true,
  }
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
