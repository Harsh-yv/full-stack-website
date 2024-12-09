const {MongoClient} = require('mongodb');
async function main(){
  const uri = "mongodb://localhost:27017/mydb";
  const client = new MongoClient(uri);
  try {
     // Connect to the MongoDB cluster
     await client.connect();
     await createdb(client, "mydatabase");       
  } finally {
     // Close the connection to the MongoDB cluster
     await client.close();
}
}
main().catch(console.error);
async function createdb(client, dbname){
const dbobj = await client.db(dbname);
  console.log("Database created");
  console.log(dbobj);
}