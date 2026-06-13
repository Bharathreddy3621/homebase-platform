import "./env.js";
import mongodb from "mongodb";

const { MongoClient } = mongodb;
const Url = process.env.MONGODB_URI;
let _db;

if (!Url) {
  throw new Error("Missing MONGODB_URI environment variable");
}

export const MongoConnect = (callback) => {
  MongoClient.connect(Url)
    .then((client) => {
      console.log("Connected to MongoDB");
      _db = client.db("airbnb");
      callback();
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
};

export const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error("No database found!");
};
