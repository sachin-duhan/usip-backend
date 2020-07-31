const http = require('http');
const mongoose = require('mongoose');
const keys = require('./config/keys');

// getting the utlities
const app = require('./app');

//connection and DB found!
const port = process.env.PORT || 4000;
const MongoURI = keys.mongoURI;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

mongoose.Promise = global.Promise;
mongoose.connect(MongoURI, {
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(() => console.log('Database connected...'))
    .catch((err) => console.log(err));