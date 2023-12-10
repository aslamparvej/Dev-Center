const { MongoClient } = require("mongodb");

let database;

const uri = "mongodb://localhost:27017";

async function connectToDatabase() {
  const client = await MongoClient.connect(uri);

  database = client.db('wolf-dev');
}


/* async function connectToDatabase() {
   const client = await MongoClient.connect('mongodb://localhost:27017');
   database = client.db('wolf-dev');
} */

function getDb() {
  if (!database) {
    throw new Error("You must connect first!");
  }
  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
