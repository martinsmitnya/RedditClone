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

app.get('/posts', (req, res) => {
  conn.query('SELECT * FROM posts_table;', (err, rows) => {
    if (err) {
      res.status(500).json({error: 'Database error occured'});
      return
    } else {
      res.json(rows);
    }
  })
})

app.get('/posts/:id', (req, res) => {
  conn.query(`SELECT * FROM posts_table WHERE id = ?;`, [req.params.id] , (err, rows) => {
    if (err) {
      res.status(500).json({error: 'Database error occured'});
      return
    } 
    else if (rows[0] === undefined) {
      res.status(404).json({error: `Post with given ID does not exists`});
    } 
    else {
      res.json(rows);
    }
  })
})

//POST request, input body = [{"title":"otherDummyTtitle","url":"www.dummy.com","timestamp":333}], ID andscore auto generated
app.post ('/posts', (req, res) => {
  conn.query(`INSERT INTO posts_table (title, url, timestamp) VALUES (?, ?, ?);`, [req.body[0].title, req.body[0].url, req.body[0].timestamp], (err, rows) => {
    if (err) {
      res.status(500).json({error: 'Database error occured'});
      return
    } else {
      res.json('Inserted!');
    }
  });
});

//Add posts endpoint  /posts
//Downvote endpoint /posts/:id/downvote
//Upvote   endpoint /posts/:id/upvote






app.listen(3000, () => {
  console.log('Server is ONLINE at http://localhost:3000/'); 
})



//Get posts endpoint  /posts
//Get uniq post endpoint /posts/:id