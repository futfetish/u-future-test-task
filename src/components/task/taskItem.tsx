import { FC } from "react";
import { TaskI } from "../../types/task";
import Styles from "@/styles/task/taskItem.module.scss";
import clsx from "clsx";

export const TaskItem: FC<{ task: TaskI }> = ({ task }) => {
  return (
    <div className={Styles.item}>
      <div className={Styles.top} >
        <h3>{task.title}</h3>
        <div className={Styles.thing} >
          <p>{task.priority ? <>{task.priority}</> : <> none </>}</p>
          <p>priority</p>
        </div>

        <div className={Styles.thing}>
          <p> completed: </p>
          <div className={clsx(Styles.check, task.completed && Styles.check_active)} ></div>
        </div>
      </div>
      <div className="stick"></div>
      <div className={Styles.description} > {task.description} </div>
    </div>
  );
};
