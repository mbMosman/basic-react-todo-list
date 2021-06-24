import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';

function TaskTable() {

  // Get tasks from Redux
  const dispatch = useDispatch();
  const taskList = useSelector((store) => store.taskList);

  useEffect(() => {
      // Get the tasks from the server to display in table
      dispatch({ type: 'FETCH_TASK_LIST'});
    }, 
    [dispatch]
  );

  const formatDate = (date) => {
    return date ? moment().format('MM/DD/YYYY') : '';
  }

  const displayStatusForTask = (task) => {
    if (task.complete) {
      return 'Completed'
    } else {
      const action = {
        type: 'UPDATE_TASK', 
        payload: {
          id: task.id,
          complete: true
        }
      }
      return (
        <Button variant="contained" onClick={() => dispatch(action)}>
        Mark Complete
        </Button>
      )
    }
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Task</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {taskList.map( item => 
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category.name}</TableCell>
                <TableCell>{ formatDate(item.due) }</TableCell>
                <TableCell>{ displayStatusForTask(item) }</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    onClick={() => dispatch({ type: 'DELETE_TASK', payload: {id: item.id} })}
                  >
                    Delete Task
                  </Button>
                </TableCell>
              </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TaskTable;
