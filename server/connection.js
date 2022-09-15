require('dotenv').config({path: './.env'})

const mysql = require('mysql')
let connection = mysql.createConnection({
 // port:3306,
 // host:'localhost',
 database:'movt',
 user:"root",
 password: 'root',


 port: process.env.DB_PORT,
 host: process.env.DB_HOST,
 // database: process.env.DB_NAME
 // user:process.env.DB_USER ,
 // password: process.env.DB_PASSWORD,
 
})


connection.connect((err)=>{
 if(!err){
  console.log("Connected")
 }else{
  console.log(err)
 }
}) 

module.exports = connection