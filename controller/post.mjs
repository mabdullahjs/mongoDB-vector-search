import OpenAI from 'openai';
import db from '../server.mjs';
import dotenv from "dotenv";
import { ObjectId } from 'mongodb';





//dot env config
dotenv.config();

//openai
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


//create post function
const createPost = async (req, res) => {

    let collection = db.collection("posts");
    let newDocument = req.body;
    newDocument.date = new Date();
    try {
        let result = await collection.insertOne(newDocument);
        res.send(result , ).status(204);
        
    } catch (error) {
        console.log('error===> ' , error);
        res.send('error occured').status(404);
    }

}


//get all post function
const getAllPost = async (req, res) => {

    let collection = db.collection("posts");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);

}

//get single post function
const getSinglePost = async (req, res) => {

    // const queryText = req.params.search;
    // const response = await openai.embeddings.create({
    //     model: "text-embedding-ada-002",
    //     input: queryText,
    // });
    // const vector = response?.data[0]?.embedding;

    // const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    // try {
    //     const queryResponse = await index.query({
    //         queryRequest: {
    //             vector: vector,
    //             // id: "vec1",
    //             topK: 3,
    //             includeValues: true,
    //             includeMetadata: true,
    //             namespace: process.env.PINECONE_NAME_SPACE
    //         }
    //     });

    //     queryResponse.matches.map((item) => {
    //         // console.log(`score ${item.score.toFixed(1)} => ${JSON.stringify(item.metadata)}\n\n`);
    //     })
    //     // console.log(`${queryResponse.matches.length} records found `);
    //     res.send(queryResponse.matches)
    // } catch (error) {
    //     console.log(error)
    // }



    res.send('search query passed')

}

//delete Post
const deletePost = async (req, res) => {
    const { id } = req.params;
  
    try {
      const posts = db.collection("posts");
      const query = { _id: new ObjectId(id) };
      const result = await posts.deleteOne(query);
  
      if (!result.deletedCount){
          res.status(404).send("No documents matched the query. Deleted 0 documents.");
      }
  
      res.status(201).send({ message: "Successfully deleted one document." });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}


//edit post 
const editPost = async (req, res) => {

    const { id } = req.params;
    const { title, description } = req.body;

  
    // Validation
    if ((!title && !description)) {
      res.status(403).send("parameterMissing");
      return;
    }
  
    if (title && typeof title !== "string") {
      res.status(403).send("title missing");
      return;
    }
    if (description && typeof description !== "string") {
      res.status(403).send("description missing");
      return;
    }
  
    try {
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { title, description } };
      const products = db.collection("posts");
      const data = await products.updateOne(filter, updateDoc);
  
      if (!data.matchedCount) throw Error("post Not Found!");
  
      res.status(201).send({ message: "post updated" });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }

}

export { createPost, getAllPost, getSinglePost, deletePost, editPost }