package com.testpjt.tasks.mappers;

import com.testpjt.tasks.domain.dto.TaskListDto;
import com.testpjt.tasks.domain.entities.TaskList;

public interface TaskListMapper {

    TaskList fromDto(TaskListDto taskListDto);

    TaskListDto toDto(TaskList taskList);
}
