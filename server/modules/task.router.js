const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// Get all tasks
router.get('/', (req, res) => {

  const sqlText = `
      SELECT task.*, json_build_object('id', c.id, 'name', c.name) as category
      FROM task 
      JOIN category c ON task.category_id = c.id 
      ORDER BY task.complete, task.due, c.name, task.description;`;

  pool.query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch( (err) => {
      console.log('Error getting all tasks: ', err);
      res.sendStatus(500);
    })
});

// Get a specific task by id
router.get('/:id', (req, res) => {

  const taskId = req.params.id;
  console.log('Getting task with id', taskId);

  const sqlText = `
      SELECT task.*, json_build_object('id', c.id, 'name', c.name) as category
      FROM task 
      JOIN category c ON task.category_id = c.id 
      WHERE task.id = $1;`;

  pool.query(sqlText, [taskId])
    .then((result) => {
      // Send back single task object
      res.send(result.rows[0]);
    })
    .catch( (err) => {
      console.log(`Error getting task with id ${taskId}:`, err);
      res.sendStatus(500);
    })
});

// Add task
router.post('/', (req, res) => {
  const task = req.body;
  console.log('Adding task', task);

  // Check for required values - description & category
  if (task.description == null) {
    res.sendStatus(500);
    console.log('Error adding task, description is required.');
    return;
  }

  if (task.category_id == null) {
    res.sendStatus(500);
    console.log('Error adding task, category is required.');
    return;
  }

  // Add task for specified category
  const queryStuff = buildInsertSqlForTask(task);
  pool.query(queryStuff.sqlText, queryStuff.values)
    .then (() => {
      res.sendStatus(201);
    })
    .catch( (err) => {
      res.sendStatus(500);
    })
});

// Description & category are required. Only add other fields if provided.
function buildInsertSqlForTask(newTask) {
  let fieldsSql = '(description, category_id,';
  let valuesSql = '($1, $2,'
  const values = [newTask.description, newTask.category_id];

  let counter = 3;
  if (newTask.created) {
    fieldsSql += ` created,`;
    valuesSql += ` $${counter++},`;
    values.push(newTask.created);
  } 
  if (newTask.due) {
    fieldsSql += ` due,`;
    valuesSql += ` $${counter++},`;
    values.push(newTask.due);
  } 
  if (newTask.complete) {
    fieldsSql += ` complete,`;
    valuesSql += ` $${counter++},`;
    values.push(newTask.complete);
  }
  //Remove trailing , at end of fields
  fieldsSql = fieldsSql.substring(0, fieldsSql.length - 1);
  valuesSql = valuesSql.substring(0, valuesSql.length - 1);
  //Add trailing ) at end of fields
  fieldsSql = fieldsSql + ')';
  valuesSql = valuesSql + ')';

  const sqlText = `INSERT INTO task ${fieldsSql} VALUES ${valuesSql};`;
  return {
    sqlText: sqlText,
    values: values
  }
}

// Delete a task
router.delete('/:id', (req, res) => {
  const taskId = req.params.id;
  const sqlText = 'DELETE FROM task WHERE id=$1;'
  pool.query(sqlText, [taskId])
  .then((result) => {
    res.sendStatus(200);
  })
  .catch( (err) => {
    console.log(`Error removing task with id=${taskId}`, err);
    res.sendStatus(500);
  })
});

// Update a task
router.put('/:id', (req, res) => {
  const newTask = req.body;
  const taskId = req.params.id;
  
  const queryStuff = buildUpdateSqlForTask(taskId, newTask);
  console.log('Update query:', queryStuff.sqlText);
  console.log('Update query values:', queryStuff.values);

  pool.query(queryStuff.sqlText, queryStuff.values)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch( (err) => {
      console.log('Error updating task: ', err);
      res.sendStatus(500);
    })
});

// Build SQL for update based on fields provided.
function buildUpdateSqlForTask(taskId, newTask) {
  let setSql = '';
  const values = [taskId];
  let counter = 2;
  if (newTask.description != null) {
    setSql += ` description=$${counter},`;
    counter++;
    values.push(newTask.description);
  }  
  if (newTask.due != null) {
    setSql += ` due=$${counter},`;
    counter++;
    values.push(newTask.due);
  }
  if (newTask.complete != null) {
    setSql += ` complete=$${counter},`;
    counter++;
    values.push(newTask.complete);
  }
  if (newTask.category_id != null) {
    setSql += ` category_id=$${counter},`;
    counter++;
    values.push(newTask.category_id);
  }

  //Remove trailing , at end of update fields
  setSql = setSql.substring(0, setSql.length - 1);

  return {
    sqlText: `UPDATE task SET ${setSql} WHERE id=$1;`,
    values: values
  }
}

module.exports = router;