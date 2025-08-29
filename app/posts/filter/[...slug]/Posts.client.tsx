'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import PostList from '@/components/PostList/PostList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import { fetchPosts } from '@/lib/api';

import css from './page.module.css';
import Modal from '@/components/Modal/Modal';
import { Post } from '@/types/post';
import EditPostForm from '@/components/EditPostForm/EditPostForm';
import CreatePostForm from '@/components/CreatePostForm/CreatePostForm';

interface PostsClientProps {
  initialData: { posts: Post[]; totalCount: number };
  userId: string;
}

export default function PostsClient({ initialData, userId }: PostsClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  const { data } = useQuery({
    queryKey: ['posts', searchQuery, currentPage, userId],
    queryFn: () =>
      fetchPosts({
        searchText: searchQuery,
        page: currentPage,
        ...(userId !== 'All' && { userId }),
      }),
    placeholderData: keepPreviousData,
    initialData,
  });

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const toggleEditPost = (post: Post) => {
    setEditedPost(post);
    setIsModalOpen(true);
  };

  const changeSearchQuery = useDebouncedCallback((newQuery: string) => {
    setCurrentPage(1);
    setSearchQuery(newQuery);
  }, 300);

  const totalPages = Math.ceil(data.totalCount / 8);
  const posts = data?.posts ?? [];

  return (
    <div className={css.app}>
      <main className={css.main}>
        <section className={css.postsSection}>
          <header className={css.toolbar}>
            <SearchBox onSearch={changeSearchQuery} />
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}

            <button
              className={css.button}
              onClick={() => {
                toggleModal();
              }}
            >
              Create post +
            </button>
          </header>
          {isModalOpen && (
            <Modal onClose={toggleModal}>
              {editedPost ? (
                <EditPostForm
                  initialValues={editedPost}
                  onClose={() => {
                    toggleModal();
                    setEditedPost(null);
                  }}
                />
              ) : (
                <CreatePostForm onClose={toggleModal} />
              )}
            </Modal>
          )}
          {posts.length > 0 && (
            <PostList posts={posts} toggleModal={toggleModal} toggleEditPost={toggleEditPost} />
          )}
        </section>
      </main>
    </div>
  );
}
