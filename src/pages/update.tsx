import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
} from "../store/api/taskApi";
import Styles from "@/styles/update.module.scss";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { TaskI } from "../types/task";
import { SelectButton } from "../components/ui/selectButton";

export const UpdatePage: FC = () => {
  const { id } = useParams();

  const [taskId, setTaskId] = useState<string | null>(null); 

  useEffect(() => {
    // Проверяем id и устанавливаем его в состояние
    if (id) {
      setTaskId(id);
    } else {
      alert("Некорректный ID задачи");
    }
  }, [id]);

  const {
    data: task,
    error,
    isLoading,
    isFetching,
  } = useGetTaskByIdQuery(taskId, {
    skip: taskId == null, // Пропускаем запрос, если taskId еще не установлено
  });

  if (error) {
    return <div>404</div>;
  }

  return (
    <div className={Styles.content}>
      {(isLoading || isFetching || task == undefined) && (
        <div className={Styles.spinerWrapper}>
          <ClipLoader color="#ffa116" size={100} />
        </div>
      )}
      {task && <UpdateForm task={task} />}
    </div>
  );
};

type FormValues = Omit<TaskI, "id">;

const UpdateForm = ({ task }: { task: TaskI }) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority || "none",
      completed: task.completed || false,
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    reset({
      title: task.title,
      description: task.description,
      priority: task.priority || "none",
      completed: task.completed || false,
    });
  }, [task, reset]);

  const priorityList: TaskI["priority"][] = ["none", "high", "medium", "low"];
  const [updateTask, { isLoading, error }] = useUpdateTaskMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      await updateTask({ ...data, id: task.id });
      navigate("/"); // Редирект на страницу со списком задач после обновления
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={Styles.form}>
      <div className={Styles.block}>
        <label htmlFor="title">Название</label>
        <input
          {...register("title", {
            required: "Название обязательно",
            minLength: { value: 4, message: "Минимальная длина 4 символа" },
          })}
          id="title"
          type="text"
        />
        {errors.title && <p className={Styles.error}>{errors.title.message}</p>}
      </div>

      <div className={Styles.block}>
        <label htmlFor="description">Описание</label>
        <textarea
          {...register("description", { required: "Описание обязательно" })}
          id="description"
        />
        {errors.description && (
          <p className={Styles.error}>{errors.description.message}</p>
        )}
      </div>

      <div className={Styles.block}>
        <label htmlFor="priority">Приоритет</label>
        <div className={Styles.priorityList}>
          {priorityList.map((priority) => (
            <SelectButton
              active={watch("priority") === priority}
              key={priority}
              type="button"
              onClick={() => setValue("priority", priority)}
              href="#"
            >
              {priority}
            </SelectButton>
          ))}
        </div>
      </div>

      <div className={Styles.block}>
        <label htmlFor="completed">Задача выполнена</label>
        <input
          {...register("completed")}
          id="completed"
          type="checkbox"
          defaultChecked={task.completed}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        Обновить задачу
      </button>
      {error && <p className={Styles.error}>Ошибка при обновлении задачи</p>}
    </form>
  );
};
