import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskLists from "./components/TaskListsScreen";
import CreateUpdateTaskListScreen from "./components/CreateUpdateTaskListScreen";
import TaskListScreen from "./components/TasksScreen";
import CreateUpdateTaskScreen from "./components/CreateUpdateTaskScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskLists />} />
        <Route path="/new-task-list" element={<CreateUpdateTaskListScreen />} />
        <Route
          path="/edit-task-list/:listId"
          element={<CreateUpdateTaskListScreen />}
        />
        <Route path="/task-lists/:listId" element={<TaskListScreen />} />
        <Route
          path="/task-lists/:listId/new-task"
          element={<CreateUpdateTaskScreen />}
        />
        <Route
          path="/task-lists/:listId/edit-task/:taskId"
          element={<CreateUpdateTaskScreen />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
