const express = require('express');


const app = express();


app.use(express.json());

//routes
const userRoutes = require('./routes/user.routes');

// cors header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Content-Type, Access-Control-Allow-Headers");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// route for auth & profil
app.use('/api/auth', userRoutes);

//export to server

module.exports = app;