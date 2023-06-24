// server.js

const express = require('express');
const app = express();
const routes = require('./routes');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());

app.use('/', routes);

const port = process.env.PORT 
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

