package com.testpjt.tasks.mappers;

import com.testpjt.tasks.domain.dto.TaskDto;
import com.testpjt.tasks.domain.entities.Task;

public interface TaskMapper {

    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);

}
