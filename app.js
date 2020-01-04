const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// setting up the middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS error : 
app.use(cors());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE');
        res.status(200).json({});
    }
    next();
});

//loading routes
const login = require('./API/routes/login');
const register = require('./API/routes/register');
const intern = require('./API/routes/intern');
const officer = require('./API/routes/officer');
const report = require('./API/routes/report');
const notification = require('./API/routes/notification');
const allow = require('./API/routes/open-close');
const domain = require('./API/routes/domain');
const bug = require('./API/routes/bug');
const task = require('./API/routes/tasks');
const file = require('./API/routes/file');

// routing
app.use('/user',login); // handling the Admin and intern login
app.use('/register',register); // handling the application forms of the new inetrns
app.use('/report',report); // handling the reports submission router for the intern
app.use('/intern',intern); // handling the details and reports and bank details
app.use('/officer',officer); // handling the deptt and report work
app.use('/notification',notification); // notification handling 
app.use('/allow',allow); // application and bank details
app.use('/domain',domain); // for the domains of usip
app.use('/bug',bug);
app.use('/tasks',task);
app.use('/public',file);

// error handling
app.use((req,res,next)=>{
    const error = new Error('Invalid Request');
    res.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status = error.status || 500;
    res.json({
        error:{
            message:error.message
        }
    });
});

module.exports = app;