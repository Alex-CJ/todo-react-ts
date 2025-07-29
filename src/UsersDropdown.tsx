import { useCallback, useEffect, useState } from "react";
import type { ApiUsersType } from "./types";

interface UsersDropdownProps {
  selectedUser: ApiUsersType["id"] | null;
  onUserChange: (userId: ApiUsersType["id"] | null) => void;
}

interface usersType {
  id: number;
  name: string;
}

function transformAPIUserToUser(apiUser: ApiUsersType): usersType {
  return {
    id: apiUser.id,
    name: apiUser.name,
  };
}

export const UsersDropdown = ({
  selectedUser,
  onUserChange,
}: UsersDropdownProps) => {
  const [users, setUsers] = useState<usersType[]>([]);

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
  }, [onUserChange]);

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
};
