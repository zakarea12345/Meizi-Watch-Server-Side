const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//https://dialz-theme.myshopify.com/


//mongodb uri and connection
const uri = "mongodb+srv://<username>:<password>@cluster0.i2xld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// middleware
app.use(cors());
app.use(express.json());












//to check the side is running.
app.get('/', (req, res) => {
    res.send('Watch website server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})
