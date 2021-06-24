import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider, } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const useStyles = makeStyles((theme) => ({
  form: {
    '& > *': {
      margin: theme.spacing(1)
    },
  },
  task: {
    width: '40ch'
  },
  select: {
    minWidth: '15ch'
  }
}));

function TaskForm() {

  const classes = useStyles();

  const dispatch = useDispatch();
  const categoryList = useSelector((store) => store.categoryList);

  useEffect(() => {
      // Get the categories from the server to use in form dropdown
      dispatch({ type: 'FETCH_CATEGORY_LIST'});
    }, 
    [dispatch]
  );

  // Empty task to initialize component state
  const defaultTask = { 
      description: '', 
      category_id: '',
      // due date is optional, only add if filled in
  }

  const [task, setTask] = useState(defaultTask);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (moment) => {
    // console.log('Setting due date to:', moment.format('MM-DD-YYYY'))
    setSelectedDate(moment);
    setTask({ ...task, dueDate: moment.format('MM-DD-YYYY') })
  };

  const handleSubmit = (event) => {
    // Avoid page refresh on form submission
    event.preventDefault();

    // console.log('Form submit for new task ', task);
    // Add the new task
    dispatch({ type: 'ADD_TASK', payload: task });

    // Clear form input fields
    setTask(defaultTask);
    setSelectedDate(null);
  }

  return (
    <form onSubmit={handleSubmit} className={classes.form} autoComplete="off" >
      <TextField 
          required
          className={classes.task}
          label="Description" 
          value={task.description}
          onChange={ (event) => setTask({ ...task, description: event.target.value }) }
        />
      <FormControl required>
        <InputLabel id="task-category-label">Category</InputLabel>
        <Select className={classes.select}
          autoWidth
          labelId="task-category-label"
          id="task-category-select"
          value={task.category_id}
          onChange={ (event) => setTask({ ...task, category_id: event.target.value }) }
        >
          {/* Show categories from Redux, categoryList reducer*/}
          { categoryList.map(item => 
              <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
          )}
        </Select>
      </FormControl>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/DD/yyyy"
            margin="normal"
            id="due-date"
            label="Due Date"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{'aria-label': 'change due date'}}
          />
      </MuiPickersUtilsProvider>
      <Button type="submit" variant="contained" color="primary">Save</Button>
    </form>
  );
}

export default TaskForm;
