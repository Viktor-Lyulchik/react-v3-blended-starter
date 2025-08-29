import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';

import PostPreviewClient from './PostPreview.client';
import { fetchPostById } from '@/lib/api';

type PostDetailsProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPreview({ params }: PostDetailsProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(Number(id)),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostPreviewClient />
    </HydrationBoundary>
  );
}
