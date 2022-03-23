require('dotenv').config()

 module.exports = {
   development: {
     username: process.env.BDD_user,
     password: process.env.BDD_password,
     database: "groupomania",
     host: process.env.BDD_host,
     dialect: 'mysql'
   },
   test: {
     username: process.env.BDD_user,
     password: process.env.BDD_password,
     database: "database_test",
     host: process.env.BDD_host,
     dialect: 'mysql'
   },
   production: {
     username: process.env.BDD_user,
     password: process.env.BDD_password,
     database: "database_production",
     host: process.env.BDD_host,
     dialect: 'mysql'
   }
}