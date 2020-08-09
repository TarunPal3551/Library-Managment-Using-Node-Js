const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const authRoute=require('./routes/auth');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:bookstore@cluster0.l1wgp.mongodb.net/book?retryWrites=true&w=majority";
const client = new MongoClient(uri, {  useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
});
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use('/uploads',express.static('uploads'));
 
app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", 
      "Origin,X-Requested-With,Content-Type,Accept,Authorization");
      if (req.method == 'OPTIONS') {
            res.header("Access-Control-Allow-Methods",
             "PUT,POST,PATCH,DELETE,GET");
            return res.status(200).json({});

      }
      next();
});
app.set("view engine","ejs");
app.use(express.static('views'));
app.route("/").get((req,res)=>{
    res.render('index.html');
    res.send("Working Successfully ");
});

app.use('/api',authRoute);


app.use((req, res, next) => {
      const error = new Error('Not Found');
      error.status = 404;
      next(error);
});
app.use((error, req, res, next) => {
      res.status(error.status || 500);
      res.json({
            error: {
                  message: error.message
            }


      });
});

module.exports = app;