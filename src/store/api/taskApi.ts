import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TaskI } from "../../types/task";

export type SortBy = "id" | "title" | "priority" | "completed";
export type SortOrder = "asc" | "desc";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }), // URL json-server
  endpoints: (builder) => ({
    getTasks: builder.query<
      { data: TaskI[]; next: number | null; last: number },
      {
        page: number;
        completed?: boolean;
        priority?: TaskI["priority"];
        sortBy?: SortBy;
      }
    >({
      query: ({ page, completed, priority, sortBy = "id" }) => {
        let query = `tasks?_page=${page}_limit=10`;

        if (completed !== undefined) {
          query += `&completed=${completed}`;
        }

        if (priority !== undefined) {
          query += `&priority=${priority}`;
        }

        query += `&_sort=${sortBy}`;
        return query;
      },
    }),

    getTaskById: builder.query<TaskI, undefined>({
      query: (id) => `tasks/${id}`,
    }),

    createTask: builder.mutation<TaskI, Omit<TaskI, "id" | "completed">>({
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
  useGetTaskByIdQuery,
} = taskApi;
