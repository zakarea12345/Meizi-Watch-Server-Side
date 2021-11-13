const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


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
        const usersCollection = database.collection('users')
        //get products
        app.get('/products', async(req,res)=>{
            const cursor = productsCollection.find({});
            const products =  await cursor.toArray();
            res.send(products)
        });
         // POST API For New Products
         app.post('/products', async (req, res) => {
          const newProduct = req.body;
          const result = await productsCollection.insertOne(newProduct);
          res.json(result);
      })
        //  Delete products
      app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await productsCollection.deleteOne(query);
        res.json(result);
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
      // PUT API FOR UPDATE
      app.put('/orders/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const updatedOrder = req.body;
        console.log(updatedOrder)
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
       const updateDoc = {
            $set: {
                orderStatus: 'Approved',
            }
        }
        const result = await orderCollection.updateOne(filter, updateDoc, options);

        console.log('Update Hitted ', id);
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
      //get users
      app.get('/users', async(req,res)=>{
        const cursor = usersCollection.find({});
        const user =  await cursor.toArray();
        res.send(user)
      });
     app.get('/users/:email', async (req, res) => {
     const query = { email: email };
     const user = await usersCollection.findOne(query);
     let isAdmin = false;
      if (user?.role === 'admin') {
      isAdmin = true;
     }
     res.json({ admin: isAdmin });
    });
     app.post('/users', async (req, res) => {
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  console.log(result);
  res.json(result);
     });
     app.put('/users', async (req, res) => {
     const user = req.body;
     const filter = { email: user.email };
     const options = { upsert: true };
     const updateDoc = { $set: user };
     const result = await usersCollection.updateOne(filter, updateDoc, options);
     res.json(result);
     });
     app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result); 
     })
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
