'use strict'
const express = require('express');
const app = express();
const mysql = require('mysql');
app.use(express.json());
app.use(express.static('public'));
////////////////////////////////////////////////////////////////

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'redditclone',
  insecureAuth: 'true',
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Succesfully Connected To - redditclone - DataBase');
});

//DataBase redditclone CONNECTED and is ready to serve data! 


app.get ('/', (req, res) => {
  res.send('MAIN PAGE CONNECTED');
})

app.get('/databasePROBA', (req, res) => {
  conn.query('SELECT * FROM posts_table;', (err, rows) => {
    if (err) {
      res.status(500).json({error: 'Database error occured'});
      return
    } else {
      res.json(rows);
    }
  })
})

//Get posts endpoint  /posts
 
//Get uniq post endpoint /posts/:id
//Add posts endpoint  /postsAdd/ ??? (maybe we need PUT /posts and separate GET /posts)
//Downvote endpoint /posts/:id/downvote
//Upvote   endpoint /posts/:id/upvote






app.listen(3000, () => {
  console.log('Server is ONLINE at http://localhost:3000/'); 
})