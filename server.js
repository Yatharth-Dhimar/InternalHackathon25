const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Account = require('./models/account.js');


let currentAccount;


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/CareerEngine');
}

main()
    .then(() => { console.log('connected to DB'); })
    .catch( err => {console.log(`Error : ${err}`);});


app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));


const port = 8080;

app.listen(port, () =>{
    console.log(`Listening at port : ${port}`);
});

app.get('/', (req, res) => {
    res.render('index.ejs', {currentAccount});
});

app.post('/login/logging-in', async (req, res) => {
    let {gmail, password} = req.body;

    let correctPassword;

    await Account.find({gmail: gmail})
    .then((res) => {
        correctPassword = res[0].password;
        currentAccount = res[0];
    })
    .catch(err => {
        console.log(err);
    });

    if(password == correctPassword){
        res.redirect('/');
    } else {
        res.redirect('/login');
        // alert('wrong password');
    }
});

app.get('/dashboard', (req , res) => {  
    res.render('dashboard.ejs');
});

app.get('/profile', (req, res) => {
    if(currentAccount){
        res.render('profile.ejs', {currentAccount});
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register/creating-account', (req, res) => {
    let {username, email, password, education} = req.body;

    let unformattedDate = new Date();
    let date = unformattedDate.toLocaleString('en-IN');

    let account = new Account({
        username: username,
        email: email,
        password: password,
        education: education,
        date: date,
    });

    account.save()
        .then(res => {
            console.log('successfully created account');
        })
        .catch(err => {
            console.log(err);
        });
        
    res.redirect('/login');
});

app.get('/logging-out', (req, res) => {
    currentAccount = undefined;
    res.redirect('/')
});