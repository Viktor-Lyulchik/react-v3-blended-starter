'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

import Modal from '@/components/Modal/Modal';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { User } from '@/types/user';

import css from './PostPreview.module.css';

export default function PostPreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User>();
  const [modalIsOpen, setModalOpen] = useState(false);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(Number(id)),
    refetchOnMount: false,
  });

  useEffect(() => {
    const userId: number = post?.userId ?? 0;

    const fn = async () => {
      const user: User = await fetchUserById(userId);

      return user;
    };
    if (userId > 0) {
      fn().then((user) => {
        setCurrentUser(user);
        setModalOpen(true);
      });
    }
  }, [post]);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleClickBack = () => {
    router.back();
    setModalOpen(false);
  };

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !post) return <p>Something went wrong.</p>;

  console.log('modalIsOpen', modalIsOpen);

  return (
    modalIsOpen && (
      <Modal onClose={handleClose}>
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
          <p className={css.user}>{currentUser?.name}</p>
        </div>
      </Modal>
    )
  );
}
