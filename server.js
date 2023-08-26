const express = require('express');

const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require("cors");

const mainRouter = require('./routes');
dotenv.config();

const db = require('./config/database.config'); //database configuration
db.connexion();



const app = express();

var corsOptions = {
  origin: "http://localhost:8000"
};

const PORT = process.env.PORT;

app.use(cors(corsOptions));

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));



// Enable JSON request handling
app.use(express.json());

// public route
app.use('/api', mainRouter);

// for parsing multipart/form-data
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });
app.use(upload.array());

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// handle other errors
app.use(function (err, req, res, next) {

  console.log(req.method + ' ' + req.url );

  if (err) {
    console.log(err);
  }

  if (err.status === 404)
    res.status(404).json({ message: "Not found" });
  else
    res.status(500).json({ message: "Something looks wrong :( !!!" });
});

app.listen(PORT, function () {
  console.log(`Node server listening on port ${PORT}`);
});
