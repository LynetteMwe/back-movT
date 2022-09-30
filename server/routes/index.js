const authRoute = require("./auth");
const authClientRoute = require("./authClients");
const authDriverRoute = require("./authDrivers");
const clientRoute = require("./clients");
const driverRoute = require("./drivers");
const ordersRoute = require("./orders");
const notificationsRoute = require("./notifications");
const truckRoute = require("./trucks");
const userRoute = require("./user");

module.exports = {
    authRoute,
    authClientRoute,
    authDriverRoute,
    clientRoute,
    driverRoute,
    ordersRoute,
    notificationsRoute,
    truckRoute,
    userRoute,
};
