import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Spacer, Card } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateUpdateTaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();

  const { listId } = useParams();

  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("" as string | undefined);

  // Get a handle on the router
  const navigate = useNavigate();

  const findTaskList = (taskListId: string) => {
    const filteredTaskLists = state.taskLists.filter(
      (tl) => taskListId == tl.id
    );
    if (filteredTaskLists.length === 1) {
      return filteredTaskLists[0];
    }
    return null;
  };

  const populateTaskList = (taskListId: string) => {
    const taskList = findTaskList(taskListId);
    if (null != taskList) {
      console.log("FOUND TASK LIST");
      setTitle(taskList.title);
      setDescription(taskList.description);
      setIsUpdate(true);
    }
  };

  useEffect(() => {
    if (null != listId) {
      console.log(`ID is ${listId}`);
      if (null == state.taskLists) {
        console.log("Fetching task lists");
        api.fetchTaskLists().then(() => populateTaskList(listId));
      } else {
        populateTaskList(listId);
      }
    }
  }, [listId]);

  const createUpdateTaskList = async () => {
    try {
      if (isUpdate && null != listId) {
        await api.updateTaskList(listId, {
          id: listId,
          title: title,
          description: description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      } else {
        await api.createTaskList({
          title: title,
          description: description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      }

      // Success navigate to home
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">
          {isUpdate ? "Update Task List" : "Create Task List"}
        </h1>
      </div>
      {error.length > 0 && <Card>{error}</Card>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Title"
          placeholder="Enter task list title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <Spacer y={1} />
        <Textarea
          label="Description"
          placeholder="Enter task list description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <Spacer y={1} />
        <Button type="submit" color="primary" onClick={createUpdateTaskList}>
          {isUpdate ? "Update Task List" : "Create Task List"}
        </Button>
      </form>
    </div>
  );
};

export default CreateUpdateTaskListScreen;
