import { readFile } from "fs/promises";
import { MongoClient, ServerApiVersion } from "mongodb";

import dotenv from "dotenv";
dotenv.config();

const jsonid = "os01";
const uri = process.env.mongoKey;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("connected");

    const jsonData = await readFile(`${jsonid}.json`, "utf8");
    const data = JSON.parse(jsonData);

    const db = client.db("card");
    const collection = db.collection(`${jsonid}`);

    const result = await collection.insertMany(data);
    console.log(`成功寫入 ${result.insertedCount} 筆資料`);
  } catch (err) {
    console.error("發生錯誤：", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
