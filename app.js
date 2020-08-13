const express = require('express'),
    cors = require('cors'),
    app = express(),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    morgan = require('morgan'),
    fs = require('fs');

// setting up the middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(helmet());

// create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'Logs/access.log'), {
//     flags: 'a'
// });

// // setup the logger
// app.use(morgan(require('./config/keys').morgan_logging_string, {
//     stream: accessLogStream
// }))

var whitelist = [
    'https://usip-dtu-admin.netlify.app',
    'https://usip-dtu.netlify.app',
    'https://usip-dtu-officer.netlify.app'
];

var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) callback(null, true);
        else callback(new Error('OOPS! You are not autherized!'));
    }
}

// CORS error : 
app.options('*', cors());
app.use(cors(corsOptions));

// routing
app.use('/dashboard', require('./API/routes/dashboard')); // handling the dashboard request!
app.use('/user', require('./API/routes/login')); // handling the Admin and intern login
app.use('/register', require('./API/routes/register')); // handling the application forms of the new inetrns
app.use('/report', require('./API/routes/report')); // handling the reports submission router for the intern
app.use('/intern', require('./API/routes/intern')); // handling the details and reports and bank details
app.use('/officer', require('./API/routes/officer')); // handling the deptt and report work
app.use('/notification', require('./API/routes/notification')); // notification handling 
app.use('/allow', require('./API/routes/open-close')); // application and bank details
app.use('/domain', require('./API/routes/domain')); // for the domains of usip
app.use('/bug', require('./API/routes/bug')); // handling bugs registeration and proposals!
app.use('/tasks', require('./API/routes/tasks')); // officer adding tasks for interns!
// app.use('/public', require('./API/routes/file'));
app.use('/interview', require('./API/routes/interview'));

// error handling
app.use((req, res, next) => {
    const error = new Error('Invalid Request');
    res.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status = error.status || 500;
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;