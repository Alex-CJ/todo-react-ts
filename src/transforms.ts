import type { APITask, ApiUsersType, Task, UsersType } from "./types";

export function transformAPIUserToUser(apiUser: ApiUsersType): UsersType {
  return {
    id: apiUser.id,
    name: apiUser.name,
  };
}

export function transformAPITaskToTask(apiTask: APITask): Task {
  return {
    userId: apiTask.userId,
    id: apiTask.id,
    text: apiTask.title,
    checked: apiTask.completed,
  };
}