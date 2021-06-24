const express = require('express');
const router = express.Router();
const pool = require('./pool');

//Get all categories
router.get('/', (req, res) => {
  const sqlText = 'SELECT * FROM category ORDER BY name;'
  pool.query(sqlText)
  .then((result) => {
    res.send(result.rows);
  })
  .catch( (err) => {
    console.log('Error getting all categories: ', err);
    res.sendStatus(500);
  })
})

//Get a specific category by id
router.get('/:id', (req, res) => {
  const categoryId = req.params.id;
  const sqlText = 'SELECT id, name FROM category WHERE id=$1;'
  pool.query(sqlText, [categoryId])
  .then((result) => {
    // Send back the single category object
    res.send(result.rows[0]);
  })
  .catch( (err) => {
    console.log(`Error getting category with id: ${categoryId}`, err);
    res.sendStatus(500);
  })
})

// Add a category
router.post('/', (req, res) => {
  const newCategory = req.body.category;

  if (newCategory == null || newCategory.name == null) {
    res.sendStatus(500);
    return;
  }

  const sqlText = 'INSERT INTO category (name) VALUES ($1);'
  pool.query(sqlText, [newCategory.name])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch( (err) => {
      console.log(`Error adding category`, err);
      res.sendStatus(500);
    })
});

// Delete a category
router.delete('/:id', (req, res) => {
  const categoryId = req.params.id;
  const sqlText = 'DELETE FROM category WHERE id=$1;'
  pool.query(sqlText, [categoryId])
  .then((result) => {
    res.sendStatus(200);
  })
  .catch( (err) => {
    console.log(`Error removing category`, err);
    res.sendStatus(500);
  })
});

// Update a category
router.put('/category/:id', (req, res) => {
  const categoryId = req.params.id;
  const newCategory = req.body.category;

  if (newCategory == null || newCategory.name == null) {
    res.sendStatus(500);
    return;
  }

  const sqlText = 'UPDATE category SET name=$1 WHERE id=$2;'
  pool.query(sqlText, [newCategory.name, categoryId])
    .then((result) => {
      res.send(200);
    })
    .catch( (err) => {
      console.log('Error updating category: ', err);
      res.send(500);
    })
});

module.exports = router;