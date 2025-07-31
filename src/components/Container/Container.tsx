import styled from "./Container.module.css";
import type { ContProps } from "../../types/photo";

export default function Container({ children }: ContProps) {
  return <div className={styled.container}>{children}</div>;
}
