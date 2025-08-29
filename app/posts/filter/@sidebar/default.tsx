import { fetchUsers } from '@/lib/api';
import css from './SidebarNotes.module.css';
import Link from 'next/link';

export default async function SidebarNotes() {
  const users = await fetchUsers();
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href={`/posts/filter/All`} className={css.menuLink}>
          All users
        </Link>
      </li>
      {users.map((user) => (
        <li key={user.id} className={css.menuItem}>
          <Link href={`/posts/filter/${user.id}`} className={css.menuLink}>
            {user.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
