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
//DataBase redditclone CONNECTED but HAS NO dataTABLES!

app.get ('/', (req, res) => {
  res.send('MAIN PAGE ONLINE')
})

app.get('/databasePROBA', (req, res) => {
  conn.query('SELECT * FROM ????tablename????;', (err, rows) => {
    if (err) {
      res.status(500).json({error: 'Database error occured'});
      return
    } else {
      res.json(rows);
    }
  })
})






app.listen(3000, () => {
  console.log('Server is ONLINE at http://localhost:3000/'); 
})