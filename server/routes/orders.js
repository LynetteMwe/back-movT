const express = require('express')
const connection = require('../connection')
const router = express.Router()

router.get('/', (req, res, next)=>{
 query = "SELECT * FROM orders"
 connection.query(query, (err, results)=>{
  if(!err){
   return res.status(200).json(results)
  }else{ 
   return res.status(500).json(err)
  }
 })
})

router.get('/:order_id', (req, res, next)=>{
 const id = req.params.order_id;
 let orders = req.body
 query = "SELECT * FROM orders where order_id=?"
 connection.query(query, id,(err, results)=>{
   if(!err){
   console.log(results)
   return res.status(200).json(results)
   }else{ 
   return res.status(500).json(err)
   }
 })
 })

router.post('/add', (req, res)=>{
 let orders = req.body

 const client_id = req.params.client_id
 const driver_id = req.params.driver_id
 const description = req.params.item_description
 const origin = req.params.pick_up_from
 const destination = req.params.destination
 const amount = req.params.amount


 query = 
 "insert into orders (client_id, driver_id, item_description, pick_up_from, destination, amount) values(?, ?, ?, ?, ?, ?)"
 connection.query(query, [orders.client_id, orders.driver_id,  orders.description, orders.origin, orders.destination, orders.amount], (err,results)=>{
  if(!err){
   return res.status(200).json({message:"Order Added Successfully"})
  }else{
   return res.status(500).json({message:err})
  }
 })

})

module.exports = router