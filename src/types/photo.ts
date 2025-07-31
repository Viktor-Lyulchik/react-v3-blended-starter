export interface Photo {
  id: string;
  avg_color: string;
  alt: string;
  src: { large: string; original: string };
}

export interface ContProps {
  children: React.ReactNode;
}
