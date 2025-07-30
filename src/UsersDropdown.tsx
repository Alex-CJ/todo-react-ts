import { memo, useCallback, useEffect, useState } from "react";
import type { UsersType, UsersDropdownProps } from "./types";
import { transformAPIUserToUser } from "./transforms";

export const UsersDropdown = memo(
  ({ selectedUser, onUserChange }: UsersDropdownProps) => {
    const [users, setUsers] = useState<UsersType[]>([]);

    const handleUserChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = parseInt(event.target.value, 10);

        if (isNaN(userId)) {
          onUserChange(null);
          setUsers([]);
          return;
        }

        onUserChange(userId);
      },
      [onUserChange]
    );

    useEffect(() => {
      if (users.length > 0) return;

      fetch("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const allUsers = data.map(transformAPIUserToUser);
          setUsers(allUsers);
          onUserChange(allUsers[0]?.id || null);
          console.log(allUsers);
        });
    }, [onUserChange, users.length]);

    return (
      <header className="header">
        <h3>Select User</h3>
        <select
          id="user-select"
          value={selectedUser === null ? undefined : selectedUser}
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              User: {user.name}
            </option>
          ))}
        </select>
      </header>
    );
  }
);
