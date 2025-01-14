import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Определение интерфейсов для задачи
interface Task {
  id: number;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low" | "None";
  completed: boolean;
}

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }), // URL json-server
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], number>({
      query: (page: number) => `tasks?_page=${page}&_limit=10`,
    }),

    createTask: builder.mutation<Task, Omit<Task, "id">>({
      query: (newTask) => ({
        url: "tasks",
        method: "POST",
        body: newTask,
      }),
    }),

    updateTask: builder.mutation<Task, Task>({
      query: (updatedTask) => ({
        url: `tasks/${updatedTask.id}`,
        method: "PUT",
        body: updatedTask,
      }),
    }),

    deleteTask: builder.mutation<void, number>({
      query: (taskId) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
