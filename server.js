const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const port = 8080;

let userName = undefined;


app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.listen(port, () =>{
    console.log(`Listening at port : ${port}`);
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/dashboard', (req , res) => {
    res.render('dashboard.ejs');
});

app.get('/profile', (req, res) => {
    if(userName){
        res.render('profile.ejs');
    } else {
        res.render('register.ejs');
    }
});