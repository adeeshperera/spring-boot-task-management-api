import Task from "./Task";

interface TaskList {
  id: string | undefined;
  title: string;
  description: string | undefined;
  count: number | undefined;
  progress: number | undefined;
  tasks: Task[] | undefined;
}
export default TaskList;
