import Styles from "@/styles/ui/selectButton.module.scss";
import clsx from "clsx";
import { AnchorHTMLAttributes, FC, ReactNode } from "react";

export const SelectButton: FC<{
    active: boolean;
    children: ReactNode;
  } & AnchorHTMLAttributes<HTMLAnchorElement>> = ({ active, children, ...props }) => {
    return (
      <a
        className={clsx(Styles.selectButton, active && Styles.selectButtonActive)}
        {...props}
        href="#"
      >
        {children}
      </a>
    );
  };