const mongo = require('mongodb');

const connectToDB = (callback) => {
    const DB_URL ='mongodb://localhost:27017/crud';
    const DB_NAME = 'test';
    const DB_COLLECTION = 'crud';
    
    // Connect to database
    mongo.connect(DB_URL,(err, database) => {
        
        // Check if able to connect to database
        if(err || database === null){
            console.log(err);
            res.render('index',{ error:'Failed to connect to database' });

        }else{
            // Send database object if successfully connected to DB
            callback(database);
        }
    });
}

module.exports = connectToDB;