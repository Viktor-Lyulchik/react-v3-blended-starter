import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import PostDetailsClient from './PostDetails.client';
import { fetchPostById } from '@/lib/api';

type Props = {
  params: Promise<{ id: number }>;
};

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
