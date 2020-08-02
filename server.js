const http = require('http');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = require('./app');

const port = process.env.PORT || 4000;
const MongoURI = keys.mongoURI; // connect this during development!! 
// const MongoURI = 'mongodb://localhost:27017/usip-prod'; // uncomment during development if u have local DB ready!!
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

mongoose.Promise = global.Promise;
const options = {
    useNewUrlParser: true,
    useFindAndModify: false
};

mongoose.connect(MongoURI, options)
    .then(() => console.log('Database connected...'))
    .catch((err) => console.log(err));