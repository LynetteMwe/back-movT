const express = require('express')
const connection = require('../connection')
const bcrypt = require('bcrypt')
const saltRounds = 10

const router = express.Router()


router.get('/', (req, res, next)=>{
  query = "SELECT * FROM clients"
  connection.query(query, (err, results)=>{
   if(!err){
    console.log(results)
    return res.status(200).json(results)
   }else{ 
    return res.status(500).json(err)
   }
  })
 })

router.get('/:client_id', (req, res, next)=>{
  const id = req.params.client_id;
  let clients = req.body
  query = "SELECT * FROM clients where client_id=?"
  connection.query(query, id,(err, results)=>{
    if(!err){
    console.log(results)
    return res.status(200).json(results)
    }else{ 
    return res.status(500).json(err)
    }
})
})
///////////////////register working without hashing
router.post('/register', (req, res)=>{
 let clients = req.body

 const username = req.params.username
 const password = req.params.password
 const contact = req.params.contact
 const email = req.params.email

 query = "insert into clients (contact, username, email, password) values(?, ?, ?, ?)"
 connection.query(query, [clients.contact, clients.username,  clients.email, clients.password], (err,results)=>{
  if(!err){
   return res.status(200).json({message:"Client Added Successfully"})
  }else{
   return res.status(500).json({message:err})
  }
 })

})

// /////register worked with hashing

//  bcrypt.hash(clients.password, saltRounds, (err, hash)=>{
//   if(err){
//    console.log(err)
//   }
//   query = "insert into clients (contact, username, email, password) values(?, ?, ?, ?)"
//   connection.query(query, [clients.contact, clients.username,  clients.email, hash], (err,results)=>{
//    if(!err){
//     return res.status(200).json({message:"Client Added Successfully"})
//    }else{
//     return res.status(500).json({message:err})
//    }
//   })
//  })
// })



///////////////////login working without hashing

router.post("/login",(req, res)=>{
 let clients = req.body

 query = "SELECT * FROM clients where username=? AND password=?"
 connection.query(query, [clients.username, clients.password],(err, results)=>{
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

// //////////////////////////////////////////////////////////login with hashing not working

// router.post("/login",(req, res)=>{
//  const username = req.params.username
//  const password = req.params.password

//  query = "SELECT * FROM clients where username=?"
//  connection.query(query, [username],(err, results)=>{
//   if(err){
//    res.send({err : err})
//   }
//   if (results.length > 0){
//    bcrypt.compare(password, saltRounds , results[0].password, (error, response)=>{
//     if (response){
//      res.send(results)
//     }else{
//      res.send({message: "Wrong username or password"})
//     }
//    })
//   }
//   else{
//    res.send({message: "User doesn't exist"})
//   }
   
//  })
// })

//update
router.patch('/update/:client_id', (req, res, next)=>{
 const id = req.params.client_id
 let clients = req.body
 query = "UPDATE clients set contact=?, username=?, email=?, password=? where id=?"
 connection.query(query, [clients.contact, clients.username,  clients.email, clients.password, id], (err,results)=>{
  if(!err){
   if(results.affectedRows == 0){
    return res.status(404).json({message:"Client id not found"})
   }
   return res.status(200).json({message:"Client updated successfully"})
  }
  else{ 
   return res.status(500).json(err)
  }
 })
})

//Delete user
router.delete('/delete/:client_id', (req, res, next)=>{
 const id = req.params.client_id;
 let clients = req.body
 query = "delete FROM clients where client_id=?"
 connection.query(query, [id],(err, results)=>{
  if(!err){
   if(results.affectedRows == 0){
    return res.status(404).json({message:"Client id not found"})
   }
   return res.status(200).json({message:"Client deleted successfully"})
  }
  else{ 
   return res.status(500).json(err)
  }
 })
})




// router.post('/create', (req, res, next)=>{
//  let clients = req.body
//  query = "insert into clients (contact, username, email, password) values(?, ?, ?, ?)"
//  connection.query(query, [clients.contact, clients.username,  clients.email, clients.password], (err,results)=>{
//   if(!err){
//    return res.status(200).json({message:"Client Added Successfully"})
//   }else{
//    return res.status(500).json(err)
//   }
//  })
// })

module.exports = router