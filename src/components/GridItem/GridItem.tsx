import type { Photo } from "../../types/photo";
import style from "./GridItem.module.css";

interface GridItemProps {
  children: React.ReactNode;
  onClick: (photo: Photo) => void;
  photo: Photo;
}

export default function GridItem({ children, onClick, photo }: GridItemProps) {
  return (
    <li key={photo.id} onClick={() => onClick(photo)} className={style.item}>
      {children}
    </li>
  );
}
