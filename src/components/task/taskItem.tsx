import React, { FC } from "react";
import { TaskI } from "../../types/task";
import Styles from "@/styles/task/taskItem.module.scss";
import clsx from "clsx";

export const TaskItem: FC<{ task: TaskI; deleteF: (id: number) => void }> =
  React.memo(
    ({ task, deleteF }) => {
      const deleteTask = () => {
        if (
          window.confirm(
            `Вы уверены, что хотите удалить задачу "${task.title}"?`
          )
        ) {
          deleteF(task.id);
        }
      };

      return (
        <div className={Styles.item}>
          <div className={Styles.top}>
            <div className={Styles.info}>
              <h3>{task.title}</h3>
              <div className={Styles.thing}>
                <p>{task.priority ? <>{task.priority}</> : <> none </>}</p>
                <p>priority</p>
              </div>

              <div className={Styles.thing}>
                <p> completed: </p>
                <div
                  className={clsx(
                    Styles.check,
                    task.completed && Styles.check_active
                  )}
                ></div>
              </div>
            </div>
            <a href="#" onClick={() => deleteTask()} className={Styles.delete}>
              x
            </a>
          </div>
          <div className="stick"></div>
          <div className={Styles.description}> {task.description} </div>
        </div>
      );
    },
    (prev, next) => {
      return (
        prev.task.id === next.task.id &&
        prev.task.priority === next.task.priority &&
        prev.task.completed === next.task.completed &&
        prev.task.description === next.task.description
      );
    }
  );
