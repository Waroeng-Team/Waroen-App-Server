const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.URI_MONGO_DB;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database = client.db("final-project");

if (process.env.NODE_ENV == "test") {
  database = client.db("final-project-test");
}

// async function run() {
//     try {
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         await client.close();
//     }
// }
// run().catch(console.dir);

module.exports = { database };
