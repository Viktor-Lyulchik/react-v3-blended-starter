'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchPostById, fetchUserById } from '@/lib/api';

import css from './PostDetails.module.css';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';

export default function PostDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<User>();
  const postId: number = Number(id);
  const router = useRouter();
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
    refetchOnMount: false,
  });

  const handleClickBack = () => {
    router.back();
  };

  useEffect(() => {
    const userId: number = post?.userId ?? 0;

    const fn = async () => {
      const user: User = await fetchUserById(userId);

      return user;
    };
    if (userId > 0) {
      fn().then((user) => {
        setCurrentUser(user);
      });
    }
  }, [post]);

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !post) return <p>Something went wrong.</p>;

  return (
    <>
      <main className={css.main}>
        <div className={css.container}>
          <div className={css.item}>
            <button onClick={handleClickBack} className={css.backBtn}>
              ← Back
            </button>

            <div className={css.post}>
              <div className={css.wrapper}>
                <div className={css.header}>
                  <h2>{post.title}</h2>
                </div>

                <p className={css.content}>{post.body}</p>
              </div>
              <p className={css.user}>Author: {currentUser?.name}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
