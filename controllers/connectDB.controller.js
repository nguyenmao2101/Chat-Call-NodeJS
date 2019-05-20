var MongoClient = require('mongodb').MongoClient;
var encode = require('md5');

var db_URL = 'mongodb://localhost:27017';

//Get information about users in dDB
module.exports.getUsers = (req, res, next) => {
    try {
        MongoClient.connect(db_URL, { useNewUrlParser: true }, async function (err, client) {
            if (err) { return console.dir(err); }
            var db = client.db('NODEJS_APP');

            //Promise to await
            var getData = () => {
                return new Promise((resolve, reject) => {
                    db
                        .collection('Users')
                        .find({})
                        .toArray((err, results) => {
                            err
                                ? reject(err)
                                : resolve(results);
                        });
                });
            };

            //await "getData" Promise
            var list_Users = await getData();
            console.log(list_Users);
            client.close();
            //continue execution
            res.render('users_Page', { users: list_Users });
        });
        
    } catch (e) {
        return next(e);
    }
}

//Add a user to DB
module.exports.addUser = (req, res, next) => {
    try {
        MongoClient.connect(db_URL, { useNewUrlParser: true }, async function (err, client) {
            if (err) { return console.dir(err); }
            var db = client.db('NODEJS_APP'); 
            var error = "";

            var Check = (request) => {
                return new Promise((resolve, reject) => {
                    db
                        .collection('Users')
                        .find({ email: req.body.email })
                        .toArray((err, result) => {
                            err
                                ? reject(err)
                                : resolve(result);
                        });
                });
            };

            var allow = await Check(req);

            if (allow.length != 0) {
                error = "Account already exists. Please Login!";
                res.render('signup_Page', { err: error });
                return;
            }
            var info = { name: req.body.name, email: req.body.email, password: encode(req.body.password), avatar: "" }
            
            db.collection('Users').insertOne(info, (err, res) => {
                if (err) throw err;
                console.log('Insert user success!');
            })
            client.close();
            res.redirect('/login');
    });

    } catch (e) {
        return next(e);
    }
}