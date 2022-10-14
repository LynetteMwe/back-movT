const express = require("express");
const Truck = require("../models/Truck");

const router = express.Router();

const serverError = (res, error) => {
    // console.log(error);
    if(error?.original?.code === "ER_NO_REFERENCED_ROW_2"){
        
        res.statusCode = error?.original?.code === "ER_NO_REFERENCED_ROW_2" ? 400 : 500;

        let errors = []
        if(res.statusCode === 400) errors.push("No driver exists by that ID")

        if (errors.length > 0) return res.status(400).json({ errors })

    }

    if(error?.original?.code === "ER_DUP_ENTRY"){
        res.statusCode = error?.original?.code === 'ER_DUP_ENTRY' ? 400 : 500;

        let errors = []
        if(res.statusCode === 400) errors.push("There exists a truck with similar details")

        if (errors.length > 0) return res.status(400).json({ errors })

    }

};


router.get("/:truck_id(\\d+)", (req, res, next) => {
  Truck.findByPk(req.params.truck_id)
        .then(user => {
            if (!user)
                return res.status(404).json({
                    status: res.statusCode, // Not Found
                    error: "Truck not found!",
                });
            res.json((user));
        })
        .catch(error => (res, error));
});
  
// Get all users
router.get("/", async (req, res) => {
    const _ = await Order.findAll();
    users = _.map(user => (user));
    res.status(200).json(users);
}); 

// Create a new user
router.post("/", (req, res, next) => {
    const { truck_plate_no, service_type, DriverId } = req.body;

    let errors = []

    if(!req.body?.truck_plate_no) errors.push("The  truck's plate number is needed.")
    if(!req.body?.service_type) errors.push("Truck's service type needed.")
    if(!req.body?.DriverId) errors.push("Please include Driver ID.")
    if(errors.length > 0) return res.status(400).json({errors})

    Truck.create({
      truck_plate_no,
      service_type,
      DriverId
    })
        .then(user => {
            if (!user)
                return res.status(400).json({
                    status: res.statusCode, // Bad Request
                    error: "Provide truck_plate_no, service_type, driver_id",
                });
            res.json((user));
        })
        .catch(
            error => serverError(res, error),
            );
        
});

// Update a user
// ...

// Delete a user
// ...


module.exports = router;