import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import PostDetailsClient from './PostDetails.client';
import { fetchPostById } from '@/lib/api';

type Props = {
  params: Promise<{ id: number }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const post = await fetchPostById(Number(id)).then((res) => res);

  return {
    title: post.title,
    description: post.body.slice(0, 30),
  };
}

const PostDetails = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchPostById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailsClient />
    </HydrationBoundary>
  );
};

export default PostDetails;
