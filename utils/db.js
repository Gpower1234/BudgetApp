// Connect to MongoDB server
import mongoose from "mongoose";

const url = process.env.MONGO_DB_CONNECTION_STRING

const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to the database'); 
    })

    .catch((err) => {
        console.error('Failed to connect to the database', err)
    });

export default connect;

/*
import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('budgeting', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
})

export default { sequelize, User };



/*import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('budgeting', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

export default sequelize;
*/

/*
import mysql from 'mysql2';
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'budgeting'
});


connection.connect(function(err){
    if(err){
        console.log("Error connecting to the database: ", err);
    }
    else {
        console.log("connected to the database")
    }
})

export default connection;
*/

/* 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('./db');
var router = express.Router();

var indexRouter = require('./roures/index');
var usersRouter = require('./routes/index');

var app = express();

// Get Users listing.
router.get('/', function(req, res, next) {
    res.send('respond with a resource')
});

module.exports = router;

/*
const mongoose = require('mongoose');

// Connection URL and database name
const url = 'mongodb://localhost27017/budget';
const dbName = 'Your-database-name';

*/

