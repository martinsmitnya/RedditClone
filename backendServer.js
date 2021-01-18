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


app.get('/', (req, res) => {
  res.send('MAIN PAGE CONNECTED');
})

app.get('/posts', (req, res) => {
  conn.query('SELECT * FROM posts_table;', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error occured' });
      return
    } else {
      res.status(200).json(rows);
    }
  })
})

app.get('/posts/:id', (req, res) => {
  conn.query(`SELECT * FROM posts_table WHERE id = ?;`, [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error occured' });
      return
    }
    else if (rows[0] === undefined) {
      res.status(404).json({ error: `Post with given ID does not exists` });
    }
    else {
      res.status(200).json(rows);
    }
  })
})

//POST request, input body = [{"title":"otherDummyTtitle","url":"www.dummy.com"}], ID, Timestamp and score auto generated
app.post('/posts', (req, res) => {
  //Set current time here and we parse it into the SQL values instead of '?'
  let currentTime = new Date();
  let time = parseInt(currentTime.getTime() / 1000);
  conn.query(`INSERT INTO posts_table (title, url, timestamp) VALUES (?, ?, ${time});`, [req.body[0].title, req.body[0].url], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error occured' });
      return
    } else {
      res.status(200).json('Inserted!');
    }
  });
});


//Upvote, just needs an ID in URL
app.put('/posts/:id/upvote', (req, res) => {
  conn.query(`UPDATE posts_table SET score = score + 1 WHERE id = (?);`, [req.params.id], (err, rows) => {
    console.log(rows);
    if (err) {
      res.status(500).json({ error: 'Database error occured' });
      return
    } else if (rows.affectedRows === 0) {
      res.status(404).json({ error: `Post with given ID does not exists` });
    } else {
      res.status(200).json('Upvoted!');
    }
  });
});

//Downvote, just needs an ID in URL
app.put('/posts/:id/downvote', (req, res) => {
  conn.query(`UPDATE posts_table SET score = score - 1 WHERE id = (?);`, [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error occured' });
      return
    } else if (rows.affectedRows === 0) {
      res.status(404).json({ error: `Post with given ID does not exists` });
    } else {
      res.status(200).json('Downvoted!');
    }
  });
});





app.listen(3000, () => {
  console.log('Server is ONLINE at http://localhost:3000/');
})



//Get posts endpoint  /posts
//Get uniq post endpoint /posts/:id
//Downvote endpoint /posts/:id/downvote
//Upvote   endpoint /posts/:id/upvote
//Add posts endpoint  /posts