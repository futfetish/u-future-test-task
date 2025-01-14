import {  FC } from "react";
import { TaskI } from "../../types/task";
import { TaskItem } from "./taskItem";
import Styles from '@/styles/task/taskList.module.scss'

export const TaskList: FC<{tasks: TaskI[]}> = ({tasks}) => {


  return (
    <div className={Styles.list} >
      {tasks?.map((task) => (
        <TaskItem task={task}  key={task.id} />
      ))}
    </div>
  );
};

