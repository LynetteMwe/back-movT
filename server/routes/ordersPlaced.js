const express = require("express");
const PlacedOrder = require("../models/PlacedOrder");

const router = express.Router();

router.get("/:pk", (req, res, next) => {
  PlacedOrder.findByPk(req.params.pk)
        .then(user => {
            if (!user)
                return res.status(404).json({
                    status: res.statusCode, // Not Found
                    error: "Placed Order not found!",
                });
            res.json((user));
        })
        .catch(error => (res, error));
});

router.get("/", async (req, res) => {
    const _ = await Order.findAll();
    users = _.map(user => (user));
    res.status(200).json(users);
});


// Update a user
// ...

// Delete a user
// ...


module.exports = router;