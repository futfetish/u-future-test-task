import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TaskI } from "../../types/task";

// Определение интерфейсов для задачи


export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }), // URL json-server
  endpoints: (builder) => ({
    getTasks: builder.query<
      TaskI[],
      { page: number; completed?: boolean; priority?: TaskI['priority'] }
    >({
      query: ({ page, completed, priority }) => {
        let query = `tasks?_page=${page}&_limit=10`;

        if (completed !== undefined) {
          query += `&completed=${completed}`;
        }


        if (priority !== undefined) {
          query += `&priority=${priority}`;
        }

        return query;
      },
    }),
    createTask: builder.mutation<TaskI, Omit<TaskI, "id">>({
      query: (newTask) => ({
        url: "tasks",
        method: "POST",
        body: newTask,
      }),
    }),

    updateTask: builder.mutation<TaskI, TaskI>({
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
