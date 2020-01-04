const http = require('http');
const mongoose = require('mongoose');

// getting the utlities
const app = require('./app');

//connection and DB found!
const port = process.env.port || 4000;
const MongoURI = 'mongodb://localhost:27017/usip-prod';
const server = http.createServer(app);
server.listen(port,()=>{
    console.log(`Ready for WAR -> ${port}`);
});

mongoose.Promise = global.Promise;
mongoose.connect(MongoURI,{
    useNewUrlParser:true,
    useFindAndModify: false
}).then(()=>console.log('DB in war! CAPTAIN'))
.catch((err)=>console.log(err));
