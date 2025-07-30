import { useMemo, useState, useEffect, useCallback } from "react";
import { UsersDropdown } from "./UsersDropdown";
import type { ApiUsersType, Task } from "./types";
import { transformAPITaskToTask } from "./transforms";

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<ApiUsersType["id"] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedUser) return;

    fetch(`https://jsonplaceholder.typicode.com/users/${selectedUser}/todos`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const defaultUserTasks = data.map(transformAPITaskToTask);
        setTasks(defaultUserTasks);
        console.log(defaultUserTasks);
      });
  }, [selectedUser]);

  const handleSelectedUserChange = useCallback(
    (userId: Parameters<typeof setSelectedUser>[0]) => {
      setSelectedUser(userId);
    },
    []
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  const addTask = useCallback(async () => {
    if (inputValue.trim() !== "" && selectedUser) {
      setLoading(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${selectedUser}`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: tasks.length + 1,
            title: "foo",
            body: inputValue,
            userId: selectedUser,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (response.ok) {
        setTasks((prevTasks) => [
          {
            userId: selectedUser ?? 1,
            id: prevTasks.length + 1,
            text: inputValue,
            checked: false,
          },
          ...prevTasks,
        ]);

        setInputValue("");
        setLoading(false);
      }
    }
  }, [inputValue, selectedUser, tasks.length]);

  const deleteAllTasks = useCallback(async () => {
    // const response = await fetch(
    //   `https://jsonplaceholder.typicode.com/todos/1`,
    //   {
    //     method: "DELETE",
    //   }
    // );

    // if (response.ok) {
    // }
    setTasks([]);
    setInputValue("");
  }, []);

  const deleteSelectedTasks = useCallback(async () => {
    const updatedTasks = tasks.filter((task) => !task.checked);
    setTasks(updatedTasks);
  }, [tasks]);

  const toggleTaskChecked = useCallback(
    (index: number) => {
      const updatedTasks = [...tasks];
      updatedTasks[index].checked = !updatedTasks[index].checked;
      setTasks(updatedTasks);
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (index: number, taskId: Task["id"]) => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/todos/${taskId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const updatedTasks = tasks.filter((_, i) => i !== index);
          setTasks(updatedTasks);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        throw new Error(errorMessage);
      }
    },
    [tasks]
  );

  const moveTaskUp = useCallback(
    (index: number) => {
      if (index > 0) {
        const updatedTasks = [...tasks];
        [updatedTasks[index], updatedTasks[index - 1]] = [
          updatedTasks[index - 1],
          updatedTasks[index],
        ];
        setTasks(updatedTasks);
      }
    },
    [tasks]
  );

  const moveTaskDown = useCallback(
    (index: number) => {
      if (index < tasks.length - 1) {
        const updatedTasks = [...tasks];
        [updatedTasks[index], updatedTasks[index + 1]] = [
          updatedTasks[index + 1],
          updatedTasks[index],
        ];
        setTasks(updatedTasks);
      }
    },
    [tasks]
  );

  const numberOfCheckedTasks = useMemo(() => {
    return tasks.filter((task) => task.checked).length;
  }, [tasks]);

  return (
    <div className="to-do-list">
      <UsersDropdown
        selectedUser={selectedUser}
        onUserChange={handleSelectedUserChange}
      />

      <h1>To-Do-List</h1>

      <div>
        <input
          type="text"
          placeholder="Enter a task..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button
          className="add-button"
          onClick={addTask}
          disabled={!inputValue.trim() || loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
        {tasks.length > 0 && (
          <button className="delete-all-button" onClick={deleteAllTasks}>
            Delete All
          </button>
        )}
        {numberOfCheckedTasks > 0 && (
          <>
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
  onDelete: (index: number, taskId: Task["id"]) => Promise<void>;
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
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      setDeleting(true);
      await onDelete(index, task.id);
      setDeleting(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }, [index, onDelete, task.id]);

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
      <button className="delete-button" onClick={handleDelete}>
        {deleting ? "Deleting..." : "Delete"}
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
