const express = require("express");
const Truck = require("../models/Truck");

const router = express.Router();

router.get("/:pk", (req, res, next) => {
  Truck.findByPk(req.params.pk)
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
    Truck.create({
      truck_plate_no,
      service_type,
      DriverId
    //   driver_id
    })
        .then(user => {
            if (!user)
                return res.status(400).json({
                    status: res.statusCode, // Bad Request
                    error: "Provide truck_plate_no, service_type, driver_id",
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