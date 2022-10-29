# Lipa na Mpesa Online/STK push

## Pre-requirements
* npm install
* Update .env file with the following:
```
    NODE_ENV=development
    PORT=5000
    CONSUMER_KEY=******************
    CONSUMER_SECRET=***************
    PASSKEY=***************
    SHORTCODE=174379
```            
* In the app.js file, replace the url here ```"CallBackURL": "https://b671-102-219-208-18.ngrok.io"``` with your actual callback url. The endpoint needs to be exposed to the internet if it is to receive a payload from Safaricom.

## Running
* Make a POST request to the endpoint ```http://localhost:5000/mpesa``` with a JSON with the parameters as below:
```
{
 "phoneNumber":"254...",
 "amount":2
}
```