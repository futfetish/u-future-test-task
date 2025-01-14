import Styles from "@/styles/create.module.scss";
import { useForm } from "react-hook-form";
import { useCreateTaskMutation } from "../store/api/taskApi";
import { TaskI } from "../types/task";
import { FC } from "react";
import { SelectButton } from "../components/ui/selectButton";

type FormValues = Omit<TaskI, "id" | "completed">;

export const CreatePage: FC = () => {
  return (
    <div className={Styles.content}>
      <CreateForm />
    </div>
  );
};

const CreateForm: FC = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      priority: "none",
    },
  });
  const priorityList: TaskI["priority"][] = ["none", "high", "medium", "low"];

  const [createTask, { isLoading, error }] = useCreateTaskMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      await createTask(data); // Отправка задачи
      if (errors) {
        const errorMessages = Object.values(errors)
          .map((err) => err.message)
          .join("\n");
        alert(`Ошибки в форме:\n${errorMessages}`);
      }
      reset();
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

        <div className={Styles.priorityList} >
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

      <button type="submit" disabled={isLoading}>
        Добавить задачу
      </button>
      {error && <p className={Styles.error}>Ошибка при добавлении задачи</p>}
    </form>
  );
};
