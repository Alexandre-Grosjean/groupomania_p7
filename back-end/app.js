const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

app.use(cors());
app.use(helmet(
  { crossOriginResourcePolicy: false, }
));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//routes
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const likeRoutes = require('./routes/like.routes');
const commentRoutes = require('./routes/comment.routes')

//multer directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// cors header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Access-Control-Allow-Headers");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// route for auth & profil
app.use('/api/auth', userRoutes);
//route for posts
app.use('/api/posts', postRoutes);
//route for likes
app.use('/api/likes', likeRoutes);
//route for comment
app.use('/api/comment', commentRoutes);

//export to server

module.exports = app;