import './App.css';
import AddTaskForm from '../TaskForm/TaskForm';
import TaskDisplay from '../TaskTable/TaskTable';

function App() {

  return (
    <>
      <header>
        <h1>Basic ToDo List</h1>
      </header>
      <main>
        <section>
          <h2>Add a Task</h2>
          <AddTaskForm />
        </section>
        <section>
          <h2>All Tasks</h2>
          <TaskDisplay />
        </section>
      </main>
    </>
  );
}

export default App;
