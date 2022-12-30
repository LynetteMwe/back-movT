# MoveIt logistics backend

Back end logic to a logistics app for goods and building materials delivery with authentication, M-PESA stk push and Expo notifications integrated.
Built using Node JS(Express) and used and MYSQL to store data.

## Installing dependencies

Run `npm install` in the project while in the root of the project directory to install any project dependencies first.
`cd back-movT`
`npm install`

## Available scripts

to start the servers, you can run these in the `project directory`:

### `npm run dev`

Runs the app in the development mode.

### `npm start`

## Folder Structure

### server directory

-   [middleware/](./server/middleware)
    -   [authenticate.js](./server/middleware/authenticate.js)
    -   [csrfCheck.js](./server/middleware/csrfCheck.js)
    -   [methodNotAllowed.js](./server/middleware/methodNotAllowed.js)
-   [models/](./server/models)
    -   [Client.js](./server/models/Client.js)
    -   [Driver.js](./server/models/Driver.js)
    -   [Notification.js](./server/models/Notification.js)
    -   [Order.js](./server/models/Order.js)
    -   [Session.js](./server/models/Session.js)
    -   [Transactions.js](./server/models/Transactions.js)
-   [routes/](./server/routes)
    -   [admin.js](./server/routes/admin.js)
    -   [authClients.js](./server/routes/authClients.js)
    -   [authDrivers.js](./server/routes/authDrivers.js)
    -   [clients.js](./server/routes/clients.js)
    -   [drivers.js](./server/routes/drivers.js)
    -   [index.js](./server/routes/index.js)
    -   [notifications.js](./server/routes/notifications.js)
    -   [orders.js](./server/routes/orders.js)
    -   [transactions.js](./server/routes/transactions.js)
-   [services/](./server/services)
    -   [mpesa.js](./server/services/mpesa.js)
    -   [notifications.js](./server/services/notifications.js)
-   [utils/](./server/utils)
    -   [utils.js](./server/utils/utils.js)
-   [connection.js](./server/connection.js)
-   [index.js](./server/index.js)
