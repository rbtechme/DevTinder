const express = require("express");

const {connectDB} = require("./config/database");

const app = express();


connectDB()
.then(()=> {
    console.log("database connection connected");
    app.listen(7777, () => {
        console.log("Server started on port: http://localhost:7777");
    });
})
.catch(() => {
    console.error("connect can not connected");
});