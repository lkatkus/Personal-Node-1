const mongo = require('mongodb');

const DB_URL ='mongodb://localhost:27017/crud';
const DB_NAME = 'test';
const DB_COLLECTION = 'crud';

const connectionPromise = () => {
    return new Promise((resolve, reject) => {
        // Connect to database
        mongo.connect(DB_URL,(err, database) => {
            
            // Check if able to connect to database
            if(err || database === null){
                reject('Failed to connect to database');    
            }else{
                // Send database object if successfully connected to DB
                resolve(database);
            }
        });
    })
}

module.exports = connectionPromise;