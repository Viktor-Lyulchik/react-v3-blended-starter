import type { ContProps } from "../../types/photo";
import style from "./Grid.module.css";

export default function Grid({ children }: ContProps) {
  return <ul className={style.list}>{children}</ul>;
}
