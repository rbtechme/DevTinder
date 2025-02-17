const express = require("express");
const {connectDB} = require("./config/database");
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/', require('./router/auth'));
app.use('/', require('./router/profile'));
app.use('/', require('./router/request'));

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