import React, { FC } from "react";
import { TaskI } from "../../types/task";
import Styles from "@/styles/task/taskItem.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";

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
            <Link to={"/update/" + task.id} className={Styles.update}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
              </svg>
            </Link>
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
