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

 const truck_plate_no = req.params.truck_plate_no
 const driver_id = req.params.driver_id
 const service_type = req.params.service_type

 query = 
 "insert into trucks (truck_plate_no, driver_id, service_type) values(?, ?, ?)"
 connection.query(query, [trucks.truck_plate_no, trucks.driver_id,  trucks.service_type], (err,results)=>{
  if(!err){
   return res.status(200).json({message:"Truck Added Successfully"})
  }else{
   return res.status(500).json({message:err})
  }
 })

})

module.exports = router