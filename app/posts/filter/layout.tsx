import css from './layout.module.css';

type LayoutPostsProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export default function LayoutPosts({ children, sidebar }: LayoutPostsProps) {
  return (
    <main className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.postsWrapper}>{children}</div>
    </main>
  );
}
