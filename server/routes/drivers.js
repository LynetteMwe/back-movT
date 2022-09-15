const express = require('express')
const connection = require('../connection')
const router = express.Router()

//register
router.post('/register', (req, res)=>{
 let drivers = req.body

 const username = req.params.username
 const password = req.params.password
 const contact = req.params.contact
 const email = req.params.email

 query = "insert into drivers (contact, username, email, password) values(?, ?, ?, ?)"
 connection.query(query, [drivers.contact, drivers.username,  drivers.email, drivers.password], (err,results)=>{
  if(!err){
   return res.status(200).json({message:"Driver Added Successfully"})
  }else{
   return res.status(500).json({message:err})
  }
 })

})

//Login
router.post("/login",(req, res)=>{
 let drivers = req.body

 query = "SELECT * FROM drivers where username=? AND password=?"
 connection.query(query, [drivers.username, drivers.password],(err, results)=>{
  if(err){
   res.send({err : err})
  }
  if (results.length > 0){
    return res.status(200).json({message:"Login Successful"})
  //  res.send(results)
  }
  else{
   res.send({message: "Wrong username or password"})
   }
   })
  }

)

//Get all users
// router.get('/read', (req,res)=> res.json(users))
router.get('/read', (req, res, next)=>{
 query = "SELECT * FROM drivers"
 connection.query(query, (err, results)=>{
  if(!err){
  //  console.log(results)
   return res.status(200).json(results)
  }else{ 
   return res.status(500).json(err)
  }
 })
})

//Get one user
router.get('/read/:id', (req, res, next)=>{
 const id = req.params.id;
 let drivers = req.body
 query = "SELECT * FROM drivers where id=?"
 connection.query(query, id,(err, results)=>{
  if(!err){
   console.log(results)
   return res.status(200).json(results)
  }else{ 
   return res.status(500).json(err)
  }
 })
})



module.exports = router