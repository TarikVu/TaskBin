/*  const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); */
 
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection URL
const uri = 'mongodb+srv://TaskBinFree:Dr4gonRoll%21@taskbinfree.p0skw.mongodb.net/?retryWrites=true&w=majority&appName=TaskBinFree';

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('database-name');
    const collection = db.collection('collection-name');

    // Example route
    app.get('/data', (req, res) => {
      collection.find().toArray()
        .then(results => res.json(results))
        .catch(error => res.status(500).json({ error }));
    });
  })
  .catch(error => console.error(error));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
