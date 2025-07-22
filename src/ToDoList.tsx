import { useState } from "react";

export default function ToDoList() {
  const [tasks, setTasks] = useState<string[]>([
    "Eat breakfast",
    "Go shower",
    "Walk the dog",
  ]);
  const [newTask, setNewTask] = useState<string>("");

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks((t) => [newTask, ...t]);
      setNewTask("");
    }
  }

  function deleteAllTasks() {
    setTasks([]);
  }

  function deleteTask(index: number) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

  function moveTaskUp(index: number) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index: number) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  return (
    <div className="to-do-list">
      <h1>To-Do-List</h1>

      <div>
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button
          className="add-button"
          onClick={addTask}
          disabled={!newTask.trim()}
        >
          Add
        </button>
        <button className="delete-all-button" onClick={deleteAllTasks} disabled={tasks.length === 0}>
          Delete All
        </button>
      </div>
      {tasks.length > 0 ? (
        <ol>
          {tasks.map((task, index) => (
            <ToDoListItem
              key={index}
              task={task}
              index={index}
              onDelete={deleteTask}
              onMoveDown={moveTaskDown}
              onMoveUp={moveTaskUp}
              isFirst={index === 0}
              isLast={index === tasks.length - 1}
            />
          ))}
        </ol>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

interface ToDoListItemProps {
  task: string;
  index: number;
  isFirst?: boolean;
  isLast?: boolean;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

function ToDoListItem({
  task,
  index,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ToDoListItemProps) {
  return (
    <li key={index}>
      <span className="text">{task}</span>
      <button className="delete-button" onClick={() => onDelete(index)}>
        Delete
      </button>
      {isFirst && isLast ? null : (
        <>
          <button
            className="move-button"
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
          >
            ☝
          </button>
          <button
            className="move-button"
            onClick={() => onMoveDown(index)}
            disabled={isLast}
          >
            👇
          </button>
        </>
      )}
    </li>
  );
}

function EmptyState() {
  return <h1>Add your first task</h1>;
}
