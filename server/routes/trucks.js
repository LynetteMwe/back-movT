const express = require('express')
const connection = require('../connection')
const router = express.Router()

router.get('/', (req, res, next)=>{
 query = "SELECT * FROM trucks"
 connection.query(query, (err, results)=>{
  if(!err){
   return res.status(200).json(results)
  }else{ 
   return res.status(500).json(err)
  }
 })
})

router.get('/:truck_id', (req, res, next)=>{
 const id = req.params.truck_id;
 let trucks = req.body
 query = "SELECT * FROM trucks where truck_id=?"
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
 let trucks = req.body

 const plateNum = req.params.truck_plate_no
 const driver_id = req.params.driver_id
 const serviceType = req.params.service_type

 query = 
 "insert into trucks (truck_plate_no, driver_id, service_type) values(?, ?, ?)"
 connection.query(query, [trucks.plateNum, trucks.driver_id,  trucks.serviceType], (err,results)=>{
  if(!err){
   return res.status(200).json({message:"Truck Added Successfully"})
  }else{
   return res.status(500).json({message:err})
  }
 })

})

module.exports = router