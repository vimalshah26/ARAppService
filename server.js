

const express  = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var cors = require('cors');
var bodyParser = require('body-parser');

app.listen(3000, function() {
    console.log('on 3000');
})

app.use(cors());
app.use(bodyParser.json());


var db;

MongoClient.connect("mongodb://localhost:27017/test", (err, client) => {
    db = client.db();

    if(err) return console.error(err);

    console.log('connected to database');

})

app.get('/api/contacts', (req, res) => {

    db.collection('contacts').find({}).toArray(function(err, result) {

            if(err) res.send(err);

            res.send(result);

    });
})


app.get('/api/contacts/:id', (req, res) => {

    var id = req.params.id;

    db.collection('contacts').findOne({_id: ObjectId(id)}, function(err, result) {

            if(err) res.send(err);

            console.log(result);

            res.send(result);

    });

    
})

app.post('/api/contacts', (req, res) => {

    console.log(req.body);
     db.collection('contacts').insertOne(req.body).then(result => res.send(result)).catch(err => res.send(err));
})


app.put('/api/contacts/:id', (req, res) => {

    var id = req.params.id;

    db.collection('contacts').updateOne({_id: ObjectId(id)}, { $set: req.body } , { upsert: false }).then(result => {

        db.collection('contacts').findOne({ _id:  ObjectId(id) }, function(err, data) {
           
            if(err) res.send(err);
    
            res.send(data);
           });
         });
})

app.delete('/api/contacts/:id', (req, res) => {

    console.log(req.body);
    console.log(req.params);
    var id = req.params.id;

    db.collection('contacts').deleteOne({_id: ObjectId(id)}, function(err, result) {

            if(err) res.send(err);

            res.send(result);

    });
})
