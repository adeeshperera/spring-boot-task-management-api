package com.testpjt.tasks.services.impl;

import com.testpjt.tasks.domain.entities.Task;
import com.testpjt.tasks.domain.entities.TaskList;
import com.testpjt.tasks.domain.entities.TaskPriority;
import com.testpjt.tasks.domain.entities.TaskStatus;
import com.testpjt.tasks.repositories.TaskListRepository;
import com.testpjt.tasks.repositories.TaskRepository;
import com.testpjt.tasks.services.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;

    public TaskServiceImpl(TaskRepository taskRepository, TaskListRepository taskListRepository) {
        this.taskRepository = taskRepository;
        this.taskListRepository = taskListRepository;
    }

    @Override
    public List<Task> listTasks(UUID taskListId) {
        return taskRepository.findByTaskListId(taskListId);
    }

    @Override
    public Task createTask(UUID taskListId, Task task) {
        if (null != task.getId()) {
            throw new IllegalArgumentException("Task already has an ID!");
        }
        if (null == task.getTitle() || task.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task must have a title!");
        }

        TaskPriority taskPriority = Optional.ofNullable(task.getPriority())
                .orElse(TaskPriority.MEDIUM);

        TaskStatus taskStatus = TaskStatus.OPEN;

        TaskList taskList = taskListRepository.findById(taskListId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Task List ID provided!"));

        LocalDateTime now = LocalDateTime.now();
        Task taskToSave = new Task(
                null,
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                taskStatus,
                taskPriority,
                taskList,
                now,
                now);

        return taskRepository.save(taskToSave);
    }

    @Override
    public Optional<Task> getTask(UUID taskListId, UUID taskId) {
        return taskRepository.findByTaskListIdAndId(taskListId, taskId);
    }

    @Override
    public Task updateTask(UUID taskListId, UUID taskId, Task task) {
        // Validation: Check if task exists
        Task existingTask = taskRepository.findByTaskListIdAndId(taskListId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found!"));

        // Validation: Title must not be null or blank
        if (null == task.getTitle() || task.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task must have a title!");
        }

        // Validation: Task ID should not be provided or should match the path parameter
        if (task.getId() != null && !task.getId().equals(taskId)) {
            throw new IllegalArgumentException("Task ID in request body does not match path parameter!");
        }

        // Validation: Priority must be valid if provided
        TaskPriority taskPriority = Optional.ofNullable(task.getPriority())
                .orElse(existingTask.getPriority());

        // Validation: Status must be valid if provided
        TaskStatus taskStatus = Optional.ofNullable(task.getStatus())
                .orElse(existingTask.getStatus());

        // Validation: Due date can be null or in the future (optional business rule)
        LocalDateTime dueDate = task.getDueDate();
        if (dueDate != null && dueDate.isBefore(LocalDateTime.now())) {
            // Optional: You can decide whether to allow past due dates or not
            // For now, we'll allow it but you can uncomment the line below to prevent it
            // throw new IllegalArgumentException("Due date cannot be in the past!");
        }

        // Update the existing task with new values
        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setDueDate(dueDate);
        existingTask.setPriority(taskPriority);
        existingTask.setStatus(taskStatus);
        existingTask.setUpdated(LocalDateTime.now());
        Task updatedTask = existingTask;

        return taskRepository.save(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(UUID taskListId, UUID taskId) {
        // Validation: Check if task exists
        Task existingTask = taskRepository.findByTaskListIdAndId(taskListId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found!"));

        // Delete the task
        taskRepository.delete(existingTask);
    }

}
