const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const authRoute=require('./routes/auth');

mongoose.connect('mongodb+srv://admin:admin@firstnode-ijo0j.mongodb.net/test?retryWrites=true&w=majority', ({
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
}));
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));

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
app.route("/uploadBooks").get((req,res)=>{
      res.render('./views/bookupload.html');
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