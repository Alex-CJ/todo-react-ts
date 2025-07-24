import { useMemo, useState } from "react";

type Task = {
  text: string;
  checked: boolean;
};

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { text: "Eat breakfast", checked: false },
    { text: "Go shower", checked: false },
    { text: "Walk the dog", checked: false },
  ]);
  const [newTask, setNewTask] = useState<string>("");

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks((t) => [{ text: newTask, checked: false }, ...t]);
      setNewTask("");
    }
  }

  function deleteAllTasks() {
    setTasks([]);
  }

  function deleteSelectedTasks() {
    const updatedTasks = tasks.filter((task) => !task.checked);
    setTasks(updatedTasks);
  }

  function toggleTaskChecked(index: number) {
    const updatedTasks = [...tasks];
    updatedTasks[index].checked = !updatedTasks[index].checked;
    setTasks(updatedTasks);
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

  const numberOfCheckedTasks = useMemo(() => {
    return tasks.filter((task) => task.checked).length;
  }, [tasks]);

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
        {numberOfCheckedTasks > 0 && (
          <>
            <button
              className="delete-all-button"
              onClick={deleteAllTasks}
              disabled={tasks.length === 0}
            >
              Delete All
            </button>
            <button
              className="delete-selected-button"
              onClick={deleteSelectedTasks}
            >
              {`Delete Selected (${numberOfCheckedTasks})`}
            </button>
          </>
        )}
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
              onToggleChecked={toggleTaskChecked}
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
  task: Task;
  index: number;
  isFirst?: boolean;
  isLast?: boolean;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onToggleChecked: (index: number) => void;
}

function ToDoListItem({
  task,
  index,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onToggleChecked,
}: ToDoListItemProps) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={task.checked}
          onChange={() => onToggleChecked(index)}
        />
      </label>
      <span className="text">{task.text}</span>
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
