const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const fs = require("fs");
const config = require('./config');

// Create SQL connection
const sqlConn = mysql.createConnection({
  host: "mysql-30fd222d-convocorner.d.aivencloud.com",
  user: "avnadmin",
  database: "convocorner",
  password: config.db_pwd,
  port: 27325,
  ssl: {
    ca: fs.readFileSync(__dirname + '/ca.pem')
  }
});

// Connect to SQL
sqlConn.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log("Connected!");
});
  // Initialize express app
  const app = express();
  app.use(cors());
  app.use(express.json());
app.get('/', (req, res) => {
  const {param1} = req.query;

  res.send('Hello World!<br>Param1 = ' + param1);
});

const users = [
  {id: 1, username: 'chuckp', password: 'p@$$w0rd'},
  {id: 2, username: 'adamc', password: 'gopackgo'},
];

app.get('/users', (req, res) => {
  res.send(users);
});

app.get('/users/:id', (req, res) => {

  const person = getUserById(req.params.id);

  if(!person) {
    res.sendStatus(404);
    return;
  }

  res.send(person);
});

app.post('/users', (req, res) => {
  if(!req.body){
    res.status(400).json({ error: 'Body not specified' });
    return;
  }

  if(!req.body.name){
    res.status(400).json({ error: 'No name specified' });
    return;
  }

  if(!req.body.surname){
    res.status(400).json({ error: 'No surname specified' });
    return;
  }

  const newPerson = {
    ...req.body,
    id: nexPersonId++
  };

  users.push(newPerson);

  res.send(newPerson);
});

app.post('/login', (req, res) => {

  if(!req.body.username){
    res.status(400).json({ error: 'Username not provided' });
    return;
  }

  if(!req.body.password){
    res.status(400).json({ error: 'Password not provided' });
    return;
  }



  const handleUser = function(userResponse, err) {
    if(err){
      res.status(500).json({ error: err });
      return;
    }
    if(!userResponse){
      res.status(400).json({ error: 'User not found' });
      return;
    }
  
    if(userResponse.password != req.body.password){
      res.status(400).json({ error: 'Password incorrect' });
      return;
    }
  
    res.send(userResponse);
  }

  getUserByUsername(req.body.username, handleUser);

});


app.post('/register', (req, res) => {

  if(!req.body.username){
    res.status(400).json({ error: 'Username not provided' });
    return;
  }

  if(!req.body.password){
    res.status(400).json({ error: 'Password not provided' });
    return;
  }

  const handleUserCreation = function(response, err){
    if(err){
      res.status(500).json({ error: err });
      return;
    }

    res.send(response);
  }

  addUser(req.body, handleUserCreation);
  
});


const getUserByUsername = function(username, cb){

  sqlConn.query(
    `SELECT * FROM users WHERE username = '${username}'` ,
    function (err, results, fields) {
      if(err){
        cb(null, err);
        return;
      }

      cb(results[0]);
      // console.log(results); // results contains rows returned by server
      // console.log(fields); // fields contains extra meta data about results, if available
    }
  );
}

const getUserById = function(user_id){
  // TODO: implement database
  return users.find((u) => u.id == user_id);
}

const addUser = function(user, cb){
  sqlConn.query(
    `INSERT INTO users(username, password) SELECT '${user.username}', '${user.password}'` ,
    function (err, results, fields) {
      if(err){
        cb(null, err);
        return;
      }

      cb(results[0]);
      // console.log(results); // results contains rows returned by server
      // console.log(fields); // fields contains extra meta data about results, if available
    }
  );
}
// Categories
app.get('/categories', (req, res) => {
    // Code to fetch and return all categories from the database
  });
  
  app.post('/categories', (req, res) => {
    // Code to create a new category in the database
  });
  
  app.put('/categories/:id', (req, res) => {
    // Code to update an existing category in the database
  });
  
  app.delete('/categories/:id', (req, res) => {
    // Code to delete a category from the database
  });
  
  // Questions
  app.get('/questions', (req, res) => {
    // Code to fetch and return all questions for a specific category from the database
  });
  
  app.post('/questions', (req, res) => {
    // Code to create a new question in the database
  });
  
  app.put('/questions/:id', (req, res) => {
    // Code to update an existing question in the database
  });
  
  app.delete('/questions/:id', (req, res) => {
    // Code to delete a question from the database
  });
  
  // Answers
  app.get('/answers', (req, res) => {
    // Code to fetch and return all answers for a specific question from the database
  });
  
  app.post('/answers', (req, res) => {
    // Code to create a new answer in the database
  });
  
  app.put('/answers/:id', (req, res) => {
    // Code to update an existing answer in the database
  });
  
  app.delete('/answers/:id', (req, res) => {
    // Code to delete an answer from the database
  });
  
  // Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
  
  app.listen(4000, () => {
    console.log('Listening on port 4000!');
  });

  