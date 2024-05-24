const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app=express()
const port=process.env.PORT || 3000;


//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2fsgp3y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("bistroDb").collection("menu");
    const reviewCollection = client.db("bistroDb").collection("review");
    const chefCollection = client.db("bistroDb").collection("chef");
    const cartsCollection = client.db("bistroDb").collection("carts");


    app.get('/menu', async(req,res)=>{
      const result= await menuCollection.find().toArray()
      res.send(result)
    })
    app.get('/review', async(req,res)=>{
      const result= await reviewCollection.find().toArray()
      res.send(result)
    })
    app.get('/chef', async(req,res)=>{
      const result= await chefCollection.find().toArray()
      res.send(result)
    })

    // carts

    app.get('/carts', async(req,res)=>{
      const email=req.query.email;
      const query={email:email}
      const result= await cartsCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/carts', async(req,res)=>{
      const cartItem=req.body;
      const result=await cartsCollection.insertOne(cartItem)
      res.send(result)
    })

    app.delete('/carts/:id', async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result= await cartsCollection.deleteOne(query)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
  res.send('This is bistro boss')
})

app.listen(port, ()=>{
  console.log(`Bistro boss is running is ${port}`)
})
