# Task Management System

A full-stack task management application built with **Spring Boot 3.3.5** backend and **React TypeScript** frontend, demonstrating modern enterprise-grade development patterns and best practices.

## 🏗️ Architecture Overview

This project implements a **layered architecture** following Spring Boot best practices with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  @RestController - HTTP endpoints & request/response        │
├─────────────────────────────────────────────────────────────┤
│                     Service Layer                           │
│   @Service - Business logic & transaction management        │
├─────────────────────────────────────────────────────────────┤
│                  Data Access Layer                          │
│    @Repository - JPA repositories & database operations     │
├─────────────────────────────────────────────────────────────┤
│                    Domain Model                             │
│  @Entity - JPA entities & domain objects                    │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Technology Stack

### Backend (Spring Boot)

- **Spring Boot 3.3.5** - Auto-configuration, embedded server, production-ready features
- **Spring Data JPA** - Data persistence abstraction with Hibernate ORM
- **Spring Web MVC** - RESTful web services with annotation-driven controllers
- **Java 21** - Latest LTS with modern language features
- **PostgreSQL** - Production database with ACID compliance
- **H2 Database** - In-memory database for testing
- **Maven** - Dependency management and build automation

### Frontend (React)

- **React 18.3.1** - Component-based UI library
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **NextUI** - Modern React component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication

## 📁 Project Structure

### Backend (`/server`)

```
src/main/java/com/testpjt/tasks/
├── TasksApplication.java                    # @SpringBootApplication entry point
├── controllers/                             # REST API endpoints
│   ├── TaskListController.java             # Task list CRUD operations
│   ├── TasksController.java                # Task CRUD operations (nested resource)
│   └── GlobalExceptionHandler.java         # @ControllerAdvice error handling
├── services/                                # Business logic layer
│   ├── TaskListService.java                # Task list business interface
│   ├── TaskService.java                    # Task business interface
│   └── impl/
│       ├── TaskListServiceImpl.java        # @Service implementation
│       └── TaskServiceImpl.java            # @Service implementation
├── repositories/                            # Data access layer
│   ├── TaskListRepository.java             # @Repository JPA interface
│   └── TaskRepository.java                 # @Repository with custom queries
├── domain/
│   ├── entities/                            # JPA entities
│   │   ├── TaskList.java                   # @Entity with @OneToMany
│   │   ├── Task.java                       # @Entity with @ManyToOne
│   │   ├── TaskStatus.java                 # Enum (OPEN, CLOSED)
│   │   └── TaskPriority.java               # Enum (HIGH, MEDIUM, LOW)
│   └── dto/                                 # Data Transfer Objects
│       ├── TaskListDto.java                # Record-based DTO
│       ├── TaskDto.java                    # Record-based DTO
│       └── ErrorResponse.java              # Error response structure
└── mappers/                                 # Entity-DTO conversion
    ├── TaskListMapper.java                  # Mapping interface
    ├── TaskMapper.java                      # Mapping interface
    └── impl/
        ├── TaskListMapperImpl.java          # @Component mapper
        └── TaskMapperImpl.java              # @Component mapper
```

### Frontend (`/client`)

```
src/
├── main.tsx                                # Application entry point
├── App.tsx                                 # Root component
├── AppProvider.tsx                         # Context providers
├── components/                             # React components
│   ├── TaskListsScreen.tsx                # Task lists view
│   ├── TasksScreen.tsx                    # Tasks view
│   ├── CreateUpdateTaskListScreen.tsx     # Task list form
│   └── CreateUpdateTaskScreen.tsx         # Task form
└── domain/                                 # TypeScript types
    ├── TaskList.ts                        # Task list interface
    ├── Task.ts                            # Task interface
    ├── TaskStatus.ts                      # Status enum
    └── TaskPriority.ts                    # Priority enum
```

## 🔧 Spring Boot Technical Features

### 1. **Auto-Configuration & Dependency Injection**

- **@SpringBootApplication** enables auto-configuration, component scanning, and configuration
- **Constructor-based dependency injection** for immutable dependencies
- **@Service**, **@Repository**, **@Component** annotations for Spring container management

### 2. **Spring Data JPA Integration**

```java
@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByTaskListId(UUID taskListId);                    // Query by method name
    Optional<Task> findByTaskListIdAndId(UUID taskListId, UUID id);  // Composite queries
}
```

### 3. **RESTful Web Services**

```java
@RestController
@RequestMapping(path = "/api/task-lists/{task_list_id}/tasks")  // Nested resource pattern
public class TasksController {

    @GetMapping                                                  // GET /api/task-lists/{id}/tasks
    @PostMapping                                                // POST /api/task-lists/{id}/tasks
    @GetMapping("/{task_id}")                                   // GET /api/task-lists/{id}/tasks/{taskId}
    @PutMapping("/{task_id}")                                   // PUT /api/task-lists/{id}/tasks/{taskId}
    @DeleteMapping("/{task_id}")                                // DELETE /api/task-lists/{id}/tasks/{taskId}
}
```

### 4. **JPA Entity Relationships**

```java
@Entity
@Table(name = "task_lists")
public class TaskList {
    @OneToMany(mappedBy = "taskList", cascade = {CascadeType.REMOVE, CascadeType.PERSIST})
    private List<Task> tasks;
}

@Entity
@Table(name = "tasks")
public class Task {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_list_id")
    private TaskList taskList;
}
```

### 5. **Transaction Management**

```java
@Service
public class TaskServiceImpl implements TaskService {

    @Override
    @Transactional  // Declarative transaction management
    public void deleteTask(UUID taskListId, UUID taskId) {
        // Atomic operation with automatic rollback on exceptions
    }
}
```

### 6. **Global Exception Handling**

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<ErrorResponse> handleExceptions(RuntimeException ex, WebRequest request) {
        // Centralized error handling with consistent response format
    }
}
```

### 7. **Configuration Management**

- **application.properties** for environment-specific configuration
- **Profile-based configuration** (development vs. test)
- **PostgreSQL** for production, **H2** for testing

## 🛠️ API Endpoints

### Task Lists

- `GET /api/task-lists` - List all task lists
- `POST /api/task-lists` - Create a new task list
- `GET /api/task-lists/{id}` - Get task list by ID
- `PUT /api/task-lists/{id}` - Update task list
- `DELETE /api/task-lists/{id}` - Delete task list

### Tasks (Nested Resource)

- `GET /api/task-lists/{listId}/tasks` - List tasks in a task list
- `POST /api/task-lists/{listId}/tasks` - Create task in task list
- `GET /api/task-lists/{listId}/tasks/{taskId}` - Get specific task
- `PUT /api/task-lists/{listId}/tasks/{taskId}` - Update task
- `DELETE /api/task-lists/{listId}/tasks/{taskId}` - Delete task

## 🗄️ Database Schema

### TaskList Entity

```sql
CREATE TABLE task_lists (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL
);
```

### Task Entity

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    status VARCHAR(20) NOT NULL,           -- OPEN, CLOSED
    priority VARCHAR(20) NOT NULL,         -- HIGH, MEDIUM, LOW
    task_list_id UUID REFERENCES task_lists(id),
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL
);
```

## 📊 Documentation & Diagrams

This project includes visual documentation diagrams:

### Project Architecture

![Project Architecture](Documentation/Project%20Architecture.jpg)

### Domain Model Diagram

![Domain Model Diagram](Documentation/Domain%20Model%20Diagram.png)

### Entity Relationship Diagram

![Entity Relationship Diagram](Documentation/Entity%20Relationship%20Diagram.jpg)

### Class Diagram

![Class Diagram](Documentation/Class%20Diagram.jpg)

## 🚀 Getting Started

### Prerequisites

- **Java 21+**
- **Node.js 18+**
- **PostgreSQL 12+**
- **Maven 3.6+**

### Backend Setup

```bash
cd server

# Configure database in application.properties
spring.datasource.url=jdbc:postgresql://localhost:5433/postgres
spring.datasource.username=postgres
spring.datasource.password=your_password

# Run the application
./mvnw spring-boot:run

# Or build and run JAR
./mvnw clean package
java -jar target/tasks-0.0.1-SNAPSHOT.jar
```

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Support

```bash
# Backend
cd server
docker-compose up -d

# Frontend
cd client
docker-compose up -d
```

## 🧪 Testing

### Backend Tests

```bash
cd server
./mvnw test                    # Run all tests
./mvnw test -Dtest=TaskServiceTest  # Run specific test class
```

### Frontend Tests

```bash
cd client
npm run test                   # Run Jest tests
npm run test:coverage          # Run with coverage
```

## 🏗️ Spring Boot Best Practices Implemented

1. **Layered Architecture** - Clear separation between controllers, services, and repositories
2. **Dependency Injection** - Constructor injection for immutable dependencies
3. **Exception Handling** - Centralized error handling with `@ControllerAdvice`
4. **Data Transfer Objects** - Separation of internal entities from API contracts
5. **Repository Pattern** - Spring Data JPA for data access abstraction
6. **Transaction Management** - Declarative transactions with `@Transactional`
7. **Configuration Management** - Externalized configuration with profiles
8. **RESTful Design** - Proper HTTP methods and status codes
9. **Validation** - Input validation at controller level
10. **Testing** - Separate test configuration with H2 database

## 📦 Build & Deployment

### Maven Build Lifecycle

```bash
./mvnw clean compile          # Compile source code
./mvnw test                   # Run tests
./mvnw package               # Create JAR file
./mvnw spring-boot:run       # Run application
```

### Production Deployment

```bash
# Create executable JAR with embedded Tomcat
./mvnw clean package -Dmaven.test.skip=true

# Run with production profile
java -jar -Dspring.profiles.active=prod target/tasks-0.0.1-SNAPSHOT.jar
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
