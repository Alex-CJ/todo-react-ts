import { useMemo, useState, useEffect, useCallback } from "react";
import { UsersDropdown } from "./UsersDropdown";
import type { ApiUsersType } from "./types";

type Task = {
  userId: number;
  id: number;
  text: string;
  checked: boolean;
};

type APITask = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

function transformAPITaskToTask(apiTask: APITask): Task {
  return {
    userId: apiTask.userId,
    id: apiTask.id,
    text: apiTask.title,
    checked: apiTask.completed,
  };
}

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([
    /*
    { text: "Eat breakfast", checked: false },
    { text: "Go shower", checked: false },
    { text: "Walk the dog", checked: false },
  */
  ]);
  // const [defaultTasks, setDefaultTasks] = useState<Task[]>();
  const [filteredTasksByUser, setFilteredTasksByUser] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<ApiUsersType["id"] | null>(
    null
  );

  const tasksToDisplay = selectedUser ? filteredTasksByUser : tasks;

  // useEffect(() => {
  //   fetch("https://jsonplaceholder.typicode.com/users/1/todos")
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       const defaultUserTasks = data.map(transformAPITaskToTask);
  //       setTasks(defaultUserTasks);
  //       // setFilteredTasksByUser(defaultUserTasks);
  //     });
  // }, []);

  useEffect(() => {
    if (!selectedUser) return;

    fetch(`https://jsonplaceholder.typicode.com/users/${selectedUser}/todos`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const defaultUserTasks = data.map(transformAPITaskToTask);
        setTasks(defaultUserTasks);
        setFilteredTasksByUser(defaultUserTasks);
        console.log(defaultUserTasks);
        // setFilteredTasksByUser(defaultUserTasks);
      });
  }, [selectedUser]);

  // useEffect(() => {
  //   fetch("https://jsonplaceholder.typicode.com/todos", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       title: "foo",
  //       completed: false,
  //       userId: 1,
  //     }),
  //     headers: {
  //       "Content-type": "application/json; charset=UTF-8",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((json) => console.log(json));
  // }, []);

  // const usersIds = useMemo(() => {
  //   return Array.from(new Set(tasks.map((task) => task.userId)));
  // }, [tasks]);

  // const findUserTasks = useCallback(
  //   (id: number) => {
  //     const identifyUser = [...tasks].filter(
  //       (item: Task) => item.userId === id
  //     );
  //     setFilteredTasksByUser(identifyUser);
  //   },
  //   [tasks]
  // );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  const updateSetTasks = useCallback(
    (updater: Task[] | ((updater: Task[]) => Task[])) => {
      if (selectedUser) {
        setFilteredTasksByUser(updater);
      } else {
        setTasks(updater);
      }
    },
    [selectedUser]
  );

  const addTask = useCallback(() => {
    if (inputValue.trim() !== "") {
      updateSetTasks((prevTasks) => [
        {
          userId: selectedUser ?? 1,
          id: prevTasks.length + 1,
          text: inputValue,
          checked: false,
        },
        ...prevTasks,
      ]);

      setInputValue("");

      // if (selectedUser) {
      //   setFilteredTasksByUser((t) => [
      //     {
      //       userId: 1,
      //       id: tasksToDisplay.length + 1,
      //       text: inputValue,
      //       checked: false,
      //     },
      //     ...t,
      //   ]);
      //   setInputValue("");
      // } else {
      //   setTasks((t) => [
      //     {
      //       userId: 1,
      //       id: tasksToDisplay.length + 1,
      //       text: inputValue,
      //       checked: false,
      //     },
      //     ...t,
      //   ]);
      //   setInputValue("");
      // }
    }
  }, [selectedUser, inputValue, updateSetTasks]);

  const deleteAllTasks = useCallback(() => {
    updateSetTasks([]);
    setInputValue("");
  }, [updateSetTasks]);

  const deleteSelectedTasks = useCallback(() => {
    const updatedTasks = tasksToDisplay.filter((task) => !task.checked);
    updateSetTasks(updatedTasks);
  }, [updateSetTasks, tasksToDisplay]);

  const toggleTaskChecked = useCallback(
    (index: number) => {
      const updatedTasks = [...tasksToDisplay];
      updatedTasks[index].checked = !updatedTasks[index].checked;
      updateSetTasks(updatedTasks);
    },
    [tasksToDisplay, updateSetTasks]
  );

  const deleteTask = useCallback(
    (index: number) => {
      const updatedTasks = tasksToDisplay.filter((_, i) => i !== index);
      setFilteredTasksByUser(updatedTasks);
      updateSetTasks(updatedTasks);
    },
    [updateSetTasks, tasksToDisplay]
  );

  const moveTaskUp = useCallback(
    (index: number) => {
      if (index > 0) {
        const updatedTasks = [...tasksToDisplay];
        [updatedTasks[index], updatedTasks[index - 1]] = [
          updatedTasks[index - 1],
          updatedTasks[index],
        ];
        updateSetTasks(updatedTasks);
      }
    },
    [updateSetTasks, tasksToDisplay]
  );

  const moveTaskDown = useCallback(
    (index: number) => {
      if (index < tasksToDisplay.length - 1) {
        const updatedTasks = [...tasksToDisplay];
        [updatedTasks[index], updatedTasks[index + 1]] = [
          updatedTasks[index + 1],
          updatedTasks[index],
        ];
        updateSetTasks(updatedTasks);
      }
    },
    [updateSetTasks, tasksToDisplay]
  );

  const numberOfCheckedTasks = useMemo(() => {
    return tasksToDisplay.filter((task) => task.checked).length;
  }, [tasksToDisplay]);

  return (
    <div className="to-do-list">
      <UsersDropdown
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
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
          disabled={!inputValue.trim()}
        >
          Add
        </button>
        {numberOfCheckedTasks > 0 && (
          <>
            <button
              className="delete-all-button"
              onClick={deleteAllTasks}
              disabled={tasksToDisplay.length === 0}
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
      {tasksToDisplay.length > 0 ? (
        <ol>
          {tasksToDisplay.map((task, index) => (
            <ToDoListItem
              key={index}
              task={task}
              index={index}
              onDelete={deleteTask}
              onMoveDown={moveTaskDown}
              onMoveUp={moveTaskUp}
              isFirst={index === 0}
              isLast={index === tasksToDisplay.length - 1}
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
