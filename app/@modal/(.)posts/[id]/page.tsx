import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';

import PostPreviewClient from './PostPreview.client';
import { fetchPostById } from '@/lib/api';

type PostDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PostDetailsProps): Promise<Metadata> {
  const { id } = await params;

  const post = await fetchPostById(Number(id)).then((res) => res);

  return {
    title: post.title,
    description: post.body.slice(0, 30),
  };
}

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
