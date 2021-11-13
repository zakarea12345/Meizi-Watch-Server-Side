const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//https://dialz-theme.myshopify.com/

// middleware
app.use(cors());
app.use(express.json());

//mongodb uri and connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i2xld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db('watchStoreInformation');
        const productsCollection =  database.collection('products');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');
        //get products
        app.get('/products', async(req,res)=>{
            const cursor = productsCollection.find({});
            const products =  await cursor.toArray();
            res.send(products)
        });
        //get orders
        app.get('/orders', async(req,res)=>{
            const cursor = orderCollection.find({});
            const orders =  await cursor.toArray();
            res.send(orders)
        });
          // Add Orders API
         app.post('/orders', async (req, res) => {
           const order = req.body;
           const result = await orderCollection.insertOne(order);
           res.json(result);
    });
      // GET api for getting orders by USERID
      app.get('/orders/:uid', async (req, res) => {
        const USERID = req.params.uid;
        console.log(USERID)
        const query = { userID: USERID };
        const eachUserOrderData = await orderCollection.find(query).toArray();
        console.log(eachUserOrderData)
        res.json(eachUserOrderData);
    });
      //  Delete API
      app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);
        console.log('deleting user with id', id);
        res.json(result);
      });
       //review orders
       app.get('/reviews', async(req,res)=>{
        const cursor = reviewCollection.find({});
        const reviews =  await cursor.toArray();
        res.send(reviews)
    });
      //post reviews
      app.post('/reviews', async (req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.json(result);
 });
    }
    finally{
        //await client.close();
    }
}


//call the async function
run().catch(console.dir)

//to check the side is running.
app.get('/', (req, res) => {
    res.send('Watch website server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})
