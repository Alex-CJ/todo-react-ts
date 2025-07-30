export interface ApiUsersType {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface UsersType {
  id: number;
  name: string;
}

export interface UsersDropdownProps {
  selectedUser: ApiUsersType["id"] | null;
  onUserChange: (userId: ApiUsersType["id"] | null) => void;
}

export interface Task {
  userId: number;
  id: number;
  text: string;
  checked: boolean;
};

export interface APITask {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

