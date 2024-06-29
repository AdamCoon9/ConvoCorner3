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

const getUserById = function(user_id, callback){
  connection.query('SELECT * FROM users WHERE id = ?', [user_id], function(error, results, fields) {
    if (error) {
      return callback(error);
    }
    callback(null, results[0]);
  });
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
app.get('/api/categories', async (req, res) => {
  try {
    const query = 'SELECT * FROM categories';
    const [rows] = await sqlConn.promise().query(query);

    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});
  
app.post('/api/categories', async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  if (typeof category !== 'string') {
    return res.status(400).json({ error: 'Category must be a string' });
  }

  if (category.length > 255) {
    return res.status(400).json({ error: 'Category is too long' });
  }

  try {
    const query = 'INSERT INTO categories (name) VALUES (?)';
    const result = await sqlConn.promise().query(query, [category]);

    res.status(201).json({ id: result.insertId, name: category });
  } catch (error) {
    console.error('Failed to insert category:', error);
    res.status(500).json({ error: 'Failed to insert category' });
  }
}); 
  
app.put('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  if (typeof category !== 'string') {
    return res.status(400).json({ error: 'Category must be a string' });
  }

  if (category.length > 255) {
    return res.status(400).json({ error: 'Category is too long' });
  }

  try {
    const query = 'UPDATE categories SET name = ? WHERE id = ?';
    await sqlConn.promise().query(query, [category, id]);

    res.json({ id, name: category });
  } catch (error) {
    console.error('Failed to update category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
}); 
  
  app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = 'DELETE FROM categories WHERE id = ?';
      await sqlConn.promise().query(query, [id]);
  
      res.json({ message: `Deleted category with id: ${id}` });
    } catch (error) {
      console.error('Failed to delete category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });  
  
  // Questions
  app.get('/api/questions', async (req, res) => {
    const { category } = req.query;
  
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
  
    if (typeof category !== 'string') {
      return res.status(400).json({ error: 'Category must be a string' });
    }
  
    if (category.length > 255) {
      return res.status(400).json({ error: 'Category is too long' });
    }
  
    try {
      const query = 'SELECT * FROM questions WHERE category = ?';
      const [rows] = await sqlConn.promise().query(query, [category]);
  
      res.json(rows);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });  
  
  app.post('/api/questions', async (req, res) => {
    const { question, category } = req.body;
  
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
  
    if (typeof question !== 'string') {
      return res.status(400).json({ error: 'Question must be a string' });
    }
  
    if (question.length > 65535) { 
      return res.status(400).json({ error: 'Question is too long' });
    }
  
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
  
    if (typeof category !== 'string') {
      return res.status(400).json({ error: 'Category must be a string' });
    }
  
    if (category.length > 255) {
      return res.status(400).json({ error: 'Category is too long' });
    }
  
    try {
      const query = 'INSERT INTO questions (question, category) VALUES (?, ?)';
      const result = await sqlConn.promise().query(query, [question, category]);
  
      res.status(201).json({ id: result.insertId, question, category });
    } catch (error) {
      console.error('Failed to insert question:', error);
      res.status(500).json({ error: 'Failed to insert question' });
    }
  });
  
  
  app.put('/questions/:id', (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
  
    const sql = 'UPDATE questions SET question = ?, answer = ? WHERE id = ?';
    connection.query(sql, [question, answer, id], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('An error occurred while updating the question.');
      } else {
        res.status(200).send(`Question with ID ${id} was updated successfully.`);
      }
    });
  });
  
  app.delete('/questions/:id', (req, res) => {
    const { id } = req.params;
  
    const sql = 'DELETE FROM questions WHERE id = ?';
    connection.query(sql, [id], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('An error occurred while deleting the question.');
      } else {
        res.status(200).send(`Question with ID ${id} was deleted successfully.`);
      }
    });
  });
  
  // Answers
  app.get('/answers/:questionId', (req, res) => {
    const { questionId } = req.params;
  
    const sql = 'SELECT * FROM answers WHERE questionId = ?';
    connection.query(sql, [questionId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('An error occurred while fetching the answers.');
      } else {
        res.status(200).json(results);
      }
    });
  });

app.post('/answers', (req, res) => {
  const { questionId, answer } = req.body;

  const sql = 'INSERT INTO answers (questionId, answer) VALUES (?, ?)';
  connection.query(sql, [questionId, answer], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('An error occurred while creating the answer.');
    } else {
      res.status(201).send(`Answer was created successfully.`);
    }
  });
});

app.put('/answers/:id', (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  const sql = 'UPDATE answers SET answer = ? WHERE id = ?';
  connection.query(sql, [answer, id], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('An error occurred while updating the answer.');
    } else {
      res.status(200).send(`Answer with ID ${id} was updated successfully.`);
    }
  });
});
  
app.delete('/answers/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM answers WHERE id = ?';
  connection.query(sql, [id], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('An error occurred while deleting the answer.');
    } else {
      res.status(200).send(`Answer with ID ${id} was deleted successfully.`);
    }
  });
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

  