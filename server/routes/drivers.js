const express = require('express')
const connection = require('../connection')
const router = express.Router()

router.get('/', (req, res, next)=>{
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
 
router.get('/:driver_id', (req, res, next)=>{
const id = req.params.driver_id;
let drivers = req.body
query = "SELECT * FROM drivers where driver_id=?"
connection.query(query, id,(err, results)=>{
  if(!err){
  console.log(results)
  return res.status(200).json(results)
  }else{ 
  return res.status(500).json(err)
  }
})
})

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
  }
  else{
   res.send({message: "Wrong username or password"})
   }
   })
  }
)



module.exports = router