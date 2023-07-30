const express = require('express');
const path = require('path');
require("dotenv").config();

const app = express();
const port =  process.env.PORT;
const router = require('./routes/index');
const dbConnect = require('./database/index');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOption ={
  credentials: true,
  origin: ['http://localhost:3000']
};

app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json({ limit: '50mb' }));

app.use(router);

dbConnect().catch(err => console.log(err)); // Call the dbConnect function to establish the database connection

app.use('/storage', express.static(path.join(__dirname, 'storage')));

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
