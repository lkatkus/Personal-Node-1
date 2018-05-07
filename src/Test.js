"use strict";

const assert = require("assert");
const Middleware = require("srv-core").Middleware;

const mongo = require('mongodb');
const objectId = require('mongodb').ObjectID; /* OBJECT ID IN MONGODB STORED AS OBJECT. THIS IS USED TO CENVERT TO OBJ FOR PASSING */

// Database setup
const DB_URL ='mongodb://localhost:27017/crud';
const DB_NAME = 'test';
const DB_COLLECTION = 'crud';

class Test extends Middleware {
    
    constructor(app, router) {
        super(app, router);      
    }

    bindToRouter() {
               
        this.router.post("/create", function(req, res, next) {
            // Create user placeholder object
            let userData = {};

            // Get data from submited form
            userData = {
                userName: req.body.userName,
                userPassword: req.body.userPassword,
                userEmail: req.body.userEmail
            };

            // Validate data
            
            // Connect to database
            mongo.connect(DB_URL, function(err, database){
                // Set database which will be used
                let db = database.db(DB_NAME);

                db.collection(DB_COLLECTION).insertOne(userData, function(err, result){
                    // Close connection after data was inserted
                    database.close();
                    // Redirect to /read route after inserting
                    res.redirect('/read');
                })
            })
        });

        this.router.get("/read", function(req, res, next) {

            let resultArray = [];
            
            // Connect to database
            mongo.connect(DB_URL, function(err, database){

                // Set database which will be used
                let db = database.db(DB_NAME);
            
                // Get cursor pointing to all data in selected database
                let cursor = db.collection(DB_COLLECTION).find();
            
                // Loop through all received cursors and push data to placeholder array
                cursor.forEach(function(doc, err){
                    resultArray.push(doc);
                },() => {
                    // Callback function tobe executed after data has been collected from db
                    database.close();
                });
            })

            res.send("<b>Read</b>");
            res.end();
        });

        this.router.post("/update", function(req, res, next) {
            res.send("<b>Update</b>");
            res.end();
        });

        this.router.post("/delete", function(req, res, next) {
            res.send("<b>Delete</b>");
            res.end();
        });
    }
}

module.exports = Test;