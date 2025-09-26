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

app.post('/', (req, res) => {
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
    res.redirect('/');
});

app.get('/contactus', (req, res) => {
    res.render('contactus.ejs', {currentAccount});
});

app.get('/education', (req, res) => {
    res.render('education.ejs', {currentAccount});
});

app.post('/stream', async (req, res) =>{
    let {education} = req.body;


    const { GoogleGenAI } = require("@google/genai");
    
    const ai = new GoogleGenAI({ apiKey : ""});

//     const streamSchema = {
//   type: "array",
//   items: {
//     type: "object",
//     properties: {
//       name: { type: "string", description: "The name of the academic stream." },
//       description: { type: "string", description: "A brief description of the stream's focus." }
//     },
//     required: ["name", "description"]
//   }
// };
    
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: `Give me list of streams to pursue after ${education}. Provide me the list in a list format for JavaScript.Only give me the code and nothing else. Also remove the const streams =. just give in format [a, b, c, ...] where a is an object with name and description as keys.Do not use any markdown formatting, including code fences or backticks . Output only the raw, runnable code.`,
//       config: {
//         thinkingConfig: {
//           responseMimeType: "application/json",
//           responseSchema: streamSchema,
//         },
//       }
//     });

// const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: `give me the working of AI`,
    //   config: {
    //     thinkingConfig: {
    //       responseMimeType: "application/json",
    //       responseSchema: streamSchema,
    //     },
    //   }
    // });
    // let streams = response.text;
    // // let streams = [];
    // // let unparsedJSON = response.text;
    // // streams = JSON.parse(unparsedJSON);
    // console.log(streams);

    const streamSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string", description: "The name of the academic stream." },
      description: { type: "string", description: "A brief description of the stream's focus." }
    },
    required: ["name", "description"]
  }
};

// async function generateStreams(ai) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Give me list of streams to pursue after ${education}. Provide me the list in a list format for JavaScript.Only give me the code and nothing else. Also remove the const streams =. just give in format [a, b, c, ...] where a is an object with name and description as keys.Do not use any markdown formatting, including code fences or backticks . Output only the raw, runnable code.`,
    config: {
      // 1. Force the model to output valid JSON
      responseMimeType: "application/json",
      // 2. Guide the model to use the array/object structure defined above
      responseSchema: streamSchema, 
    },
  });

  let jsonString = response.text;
  let streams = JSON.parse(jsonString);
    

    res.render('stream.ejs', {education, streams, currentAccount});
});

app.get('/skills', (req, res) => {
    res.render('skill.ejs', {currentAccount});
});

app.post('/career', async (req, res) =>{
    let {skills} = req.body;


    const { GoogleGenAI } = require("@google/genai");
    
    const ai = new GoogleGenAI({ apiKey : "AIzaSyAy6YT83qtNUNwQgxOHMT6Cm8EcGUR44ZI"});

    const streamSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string", description: "The name of the career stream." },
      description: { type: "string", description: "A brief description of the stream's focus." }
    },
    required: ["name", "description"]
  }
};
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Give me list of career paths to pursue for skills ${skills}. Provide me the list in a list format for JavaScript.Only give me the code and nothing else. Also remove the const careers =. just give in format [a, b, c, ...] where a is an object with name and description as keys.Do not use any markdown formatting, including code fences or backticks . Output only the raw, runnable code.`,
      config: {
        thinkingConfig: {
          responseMimeType: "application/json",
          responseSchema: streamSchema,
        },
    // contents: `Suggest a list of career paths to pursue for skills ${skills}.`, // Keep it simple and focused
    // config: {
    //     thinkingConfig: {
    // responseMimeType: "application/json", // This ensures JSON format
    // responseSchema: streamSchema,       // This ensures it matches the array of objects structure
    // },
      }
    });
    let careers = [];
    let unparsedJSON = response.text;
    console.log(unparsedJSON);
    careers = JSON.parse(unparsedJSON);
    

    res.render('stream.ejs', {skills, careers, currentAccount});
});