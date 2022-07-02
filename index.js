const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// using middletier
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xmh9o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const shopCollection = client.db("shoplistdb").collection("shops");
        const showsCollection = client.db("shoplistdb").collection("shows");
        app.get('/shops', async(req, res)=>{
            const query = {};
            const cursor = shopCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/shops', async(req, res)=>{
            const data = req.body;
            const result = await shopCollection.insertOne(data);
            res.send(result);
        })

        app.delete('/shops/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) }
            const result = await shopCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/shows', async(req, res)=>{
            const query = {};
            const cursor = showsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/shops/:id', async (req, res) => {
            const id = req.params.id;
            const query = { id: id }
            const result = await showsCollection.findOne(query);
            res.send(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})