const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use( bodyParser.urlencoded({extended: true}) );
app.use( bodyParser.json() );

//Static files
app.use(express.static('build'));

//Setup routers
const taskRouter = require('./modules/task.router');
const categoryRouter = require('./modules/category.router');
app.use('/api/task', taskRouter);
app.use('/api/category', categoryRouter);

const PORT = process.env.PORT || 5000;
app.listen( PORT, function() {
  console.log(`Server is listening on port ${PORT}...`);
})