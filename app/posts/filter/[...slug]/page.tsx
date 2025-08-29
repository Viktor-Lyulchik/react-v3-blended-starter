import css from './page.module.css';
import PostsClient from './Posts.client';
import { fetchPosts } from '@/lib/api';

type PostsPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function PostsPage({ params }: PostsPageProps) {
  const { slug } = await params;

  const userId = slug[0];

  const posts = await fetchPosts({
    searchText: '',
    page: 1,
    ...(userId !== 'All' && { userId }),
  });

  return <div className={css.app}>{<PostsClient initialData={posts} userId={userId} />}</div>;
}
