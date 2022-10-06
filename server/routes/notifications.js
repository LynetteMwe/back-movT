const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// Get single notification by id
router.get("/:pk", (req, res, next) => {
  Notification.findByPk(req.params.pk)
        .then(user => {
            if (!user)
                return res.status(404).json({
                    status: res.statusCode, // Not Found
                    error: "Notification not found!",
                });
            res.json((user));
        })
        .catch(error => (res, error));
});

// Get all notifications
router.get("/", async (req, res) => {
    const _ = await Notification.findAll();
    users = _.map(user => (user));
    res.status(200).json(users);
});

// Create a new notification
router.post("/", (req, res, next) => {
    const {  ClientId, DriverId, message, status } = req.body;
    Notification.create({
        ClientId,        
        DriverId,
        message, 
        status
    })
        .then(user => {
            if (!user)
                return res.status(400).json({
                    status: res.statusCode, // Bad Request
                    error: "Provide ClientId, DriverId, message, status",
                });
            res.json((user));
        })
        // .catch(error => serverError(res, error));
});

// Update a user
// ...

// Delete a user
// ...


module.exports = router;









// const express = require('express')
// const connection = require('../connection')
// const router = express.Router()

// router.get('/', (req, res, next)=>{
//  query = "SELECT * FROM notifications"
//  connection.query(query, (err, results)=>{
//   if(!err){
//    return res.status(200).json(results)
//   }else{ 
//    return res.status(500).json(err)
//   }
//  })
// })

// router.get('/:notf_id', (req, res, next)=>{
//  const id = req.params.notf_id;
//  let notifications = req.body
//  query = "SELECT * FROM notifications where notf_id=?"
//  connection.query(query, id,(err, results)=>{
//    if(!err){
//    console.log(results)
//    return res.status(200).json(results)
//    }else{ 
//    return res.status(500).json(err)
//    }
//  })
//  })

// router.post('/add', (req, res)=>{
//  let notifications = req.body

//  const client_id = req.params.client_id
//  const driver_id = req.params.driver_id
//  const message = req.params.message

//  query = 
//  "insert into notifications (client_id, driver_id, message) values(?, ?, ?)"
//  connection.query(query, [notifications.client_id, notifications.driver_id,  notifications.message], (err,results)=>{
//   if(!err){
//    return res.status(200).json({message:"Notification Added Successfully"})
//   }else{
//    return res.status(500).json({message:err})
//   }
//  })

// })

// module.exports = router