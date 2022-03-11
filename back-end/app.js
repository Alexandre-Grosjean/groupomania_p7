const express = require('express');
const path = require('path');


const app = express();


app.use(express.json());

//routes
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');


//multer directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// cors header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Content-Type, Access-Control-Allow-Headers");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// route for auth & profil
app.use('/api/auth', userRoutes);
//route for posts
app.use('/api/posts', postRoutes);

//export to server

module.exports = app;