"use strict";

const assert = require("assert");
const Middleware = require("srv-core").Middleware;

const mongo = require('mongodb');
const objectId = require('mongodb').ObjectID; /* objectId is user to pass document ID to mongoDB */

// Database setup
const DB_URL ='mongodb://localhost:27017/crud';
const DB_NAME = 'test';
const DB_COLLECTION = 'crud';

class BasicCrud extends Middleware {
    
    constructor(app, router) {
        super(app, router);
    }

    bindToRouter() {

        this.router.get("/index", (req, res, next) => {
            res.render('index');
        });
        
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
                
                // Check if able to connect to database
                if(err || database === null){
                    console.log(err);
                    res.render('index',{ error:'Failed to connect to database' });

                }else{
                    // Set database which will be used
                    let db = database.db(DB_NAME);

                    db.collection(DB_COLLECTION).insertOne(userData, function(err, result){
                        // Close connection after data was inserted
                        database.close();
                        // Redirect to /read
                        res.redirect('/read');
                    })
                }
            })
        });

        this.router.get("/read", function(req, res, next) {

            // Placeholder for data received from database
            let resultArray = [];
            
            // Connect to database
            mongo.connect(DB_URL, function(err, database){
                
                // Check if able to connect to database
                if(err || database === null){
                    console.log(err);
                    res.render('index',{ error:'Failed to connect to database' });

                }else{
                    // Set database which will be used
                    let db = database.db(DB_NAME);
                
                    // Get cursor pointing to all data in selected database collection
                    let cursor = db.collection(DB_COLLECTION).find();
                
                    // Loop through all received cursors and push data to placeholder array
                    cursor.forEach(function(doc, err){
                        resultArray.push(doc);
                    },() => {
                        // Callback function to be executed after data has been collected from db
                        database.close();
                        // Send data to handlebars template
                        res.render('index',{ title: 'handlebars test', userData: resultArray });
                    });
                }
            })
        });

        this.router.post("/update", function(req, res, next) {
            // Create user placeholder object
            let userData = {};

            // Get data from submited form
            userData = {
                userName: req.body.userName,
                userPassword: req.body.userPassword,
                userEmail: req.body.userEmail
            };

            // Check if userId is valid objectId and redirect if invalid
            if(!objectId.isValid(req.body.userId)){
                res.render('index',{ error: 'Invalid User Id' });
            
            }else{
                // Convert userId to mongo objectId
                let userId = objectId(req.body.userId);

                // Validate data
            
                // Connect to database
                mongo.connect(DB_URL, function(err, database){
                    
                    // Check if able to connect to database
                    if(err || database === null){
                        console.log(err);
                        res.render('index',{ error:'Failed to connect to database' });

                    }else{
                        // Set database which will be used
                        let db = database.db(DB_NAME);

                        // Update user data
                        db.collection(DB_COLLECTION).updateOne({"_id": userId}, {$set: userData}, function(err, result){
                            
                            // Check if user data was updated
                            if(result.result.n === 0){
                                // Close connection after data was updated
                                database.close();
                                // Redirect to /read
                                res.render('index',{ error:'Failed to update user' });
                            
                            }else{
                                // Close connection after data was updated
                                database.close();
                                // Redirect to /read
                                res.redirect('/read');                                
                            }
                        })
                    }
                })                
            }
        });

        this.router.post("/delete", function(req, res, next) {         
            
            // Check if userId is valid objectId and redirect if invalid
            if(!objectId.isValid(req.body.userId)){
                res.render('index',{ error: 'Invalid User Id' });
            
            }else{
                // Convert userId to mongo objectId
                let userId = objectId(req.body.userId);

                // Connect to database
                mongo.connect(DB_URL,function(err, database){
                    
                    // Check if able to connect to database
                    if(err || database === null){
                        console.log(err);
                        res.render('index',{ error:'Failed to connect to database' });
                    
                    }else{
                        // Set database which will be used
                        let db = database.db(DB_NAME);
                        
                        // Find and delete document by id
                        db.collection(DB_COLLECTION).deleteOne({"_id": userId}, (err, result) => {
                            
                            if(err){
                                console.log(err);
                                res.redirect('/');
                            }else{
                                // Close connection after document was deleted
                                database.close();
                                // Redirect to /read
                                res.redirect('/read');
                            }
                        })
                    }
                })
            }
         });
    }
}

module.exports = BasicCrud;