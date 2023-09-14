import express from "express";
import cors from 'cors';
import path from 'path';
import dotenv from "dotenv";
import {createPost, deletePost, editPost, getAllPost, getSinglePost} from "./controller/post.mjs";
import { MongoClient } from "mongodb";


//directory name
const __dirname = path.resolve();

//dot env config
dotenv.config();



const app = express();
app.use(express.json());
app.use(cors());


app.post('/api/v1/post', createPost)

app.get('/api/v1/posts' , getAllPost);

app.get('/api/v1/singlepost/:search' , getSinglePost);

app.put('/api/v1/updatepost/:id' , editPost);

app.delete('/api/v1/deletepost/:id' , deletePost);



//show static page on / request
app.get(express.static(path.join(__dirname, "./web/build")));
app.use("/", express.static(path.join(__dirname, "./web/build")));
app.use('/static', express.static(path.join(__dirname, 'static')))




//database connection

const connectionString = process.env.MONGO_URI;
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
  console.log("database connected")
} catch (e) {
  console.error(e);
}

//port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

let db = conn.db("sample_training");

export default db;