import { FC } from "react";
import { TaskI } from "../../types/task";
import { TaskItem } from "./taskItem";
import Styles from "@/styles/task/taskList.module.scss";
import { useDeleteTaskMutation } from "../../store/api/taskApi";

export const TaskList: FC<{ tasks: TaskI[] }> = ({ tasks }) => {
  const [deleteTask] = useDeleteTaskMutation();
  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id).unwrap(); // Отправляем запрос на удаление
      window.location.reload();
    } catch {
      alert("Произошла ошибка при удалении задачи.");
    }
  };

  return (
    <div className={Styles.list}>
      {tasks?.map((task) => (
        <TaskItem deleteF={handleDelete} task={task} key={task.id} />
      ))}
    </div>
  );
};
