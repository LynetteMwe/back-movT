const authClientRoute = require("./authClients");
const authDriverRoute = require("./authDrivers");
const clientRoute = require("./clients");
const driverRoute = require("./drivers");
const ordersRoute = require("./orders");
const notificationsRoute = require("./notifications");
const transactionsRoute = require('./transactions')


module.exports = {
    authClientRoute,
    authDriverRoute,
    clientRoute,
    driverRoute,
    ordersRoute,
    notificationsRoute,
    transactionsRoute
};
