const express = require("express");
const app = require("express")();
const { v4 } = require("uuid");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhqd6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("aurnaWatchDB");
    const servicesCollection = database.collection("services");
    const userCollection = database.collection("users");
    const adminCollection = database.collection("admin");
    const reviewCollection = database.collection("review");

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });
    // DELETE service API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("hit id");
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    // GET user API
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // POST user API
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("hit the post api", user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // DELETE user API
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("hit id");
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.json(result);
    });
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await adminCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.post("/admin", async (req, res) => {
      const user = req.body;
      console.log("hit the post api", user);
      const result = await adminCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    app.put("/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await adminCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // GET API
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    // POST review API
    app.post("/review", async (req, res) => {
      const user = req.body;
      console.log("hit the post api", user);
      const result = await reviewCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Aurna watch!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
