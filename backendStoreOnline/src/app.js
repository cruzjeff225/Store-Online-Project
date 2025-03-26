require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require('./config/database.js')

const app = express();

app.use(express.json())
app.use(cors());

module.exports = app;