import { Button, Card, CardBody, Progress } from "@nextui-org/react";
import { List, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppProvider";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();

  // Fetch task lists when the component mounts
  useEffect(() => {
    if (null == state.taskLists) {
      api.fetchTaskLists();
    }
  }, [state]);

  // Get a handle on the router
  const navigate = useNavigate();

  const handleCreateTaskList = () => {
    navigate("/new-task-list");
  };

  const handleSelectTaskList = (taskListId: string | undefined) => {
    navigate(`/task-lists/${taskListId}`);
    console.log(`Navigating to task list ${taskListId}`);
  };

  return (
    <div className="p-4 max-w-sm w-full">
      <h1 className="text-2xl font-bold mb-4 pr-2">My Task Lists</h1>
      <Button
        onPress={handleCreateTaskList}
        color="primary"
        startContent={<Plus size={20} aria-hidden="true" />}
        className="w-full mb-4"
        aria-label="Create New Task List"
      >
        Create New Task List
      </Button>
      {state.taskLists.map((list) => {
        return (
          <Card
            key={list.id}
            isPressable
            onPress={() => handleSelectTaskList(list.id)}
            className="mb-4 w-full"
            role="button"
            aria-label={`Select task list: ${list.title}`}
          >
            <CardBody>
              <div className="flex items-center">
                <List
                  size={20}
                  className="mr-2 opacity-[40%]"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-semibold">{list.title}</h2>{" "}
              </div>
              <p className="text-sm text-gray-500 mt-2">{list.count} tasks</p>
              <Progress
                value={list.progress ? list.progress * 100 : 0}
                className="mt-2"
                color="primary"
                aria-label={`Progress for ${list.title}: ${list.progress}%`}
              />
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default TaskListScreen;
