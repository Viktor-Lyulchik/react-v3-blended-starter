import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import toast, { Toaster } from "react-hot-toast";

import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { fetchPosts } from "../../services/postService";
import PostForm from "../CreatePostForm/CreatePostForm";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import { Post } from "../../types/post";
import EditPostForm from "../EditPostForm/EditPostForm";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const saveDebouncedQuery = useDebouncedCallback((query: string) => {
    setDebouncedQuery(query);
  }, 300);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    saveDebouncedQuery(event.target.value);
    setCurrentPage(1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditPost(null);
  };
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["posts", debouncedQuery, currentPage],
    queryFn: () => fetchPosts(debouncedQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (isSuccess && data?.posts.length === 0) {
      toast.error("No posts found for your request.");
    }
  }, [isSuccess, data]);
  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          {<SearchBox searchQuery={query} onChange={handleChange} />}
          {isSuccess && totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create post
          </button>
        </header>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            {editPost ? (
              <EditPostForm onClose={closeModal} currentPost={editPost} />
            ) : (
              <PostForm onClose={closeModal} />
            )}
          </Modal>
        )}
        {isError ? (
          <ErrorMessage />
        ) : (
          data &&
          data.posts.length > 0 && (
            <PostList posts={data.posts} toggleModal={toggleModal} toggleEditPost={setEditPost} />
          )
        )}
        {isLoading && <Loader />}
      </div>
      <Toaster position="top-right" />
    </>
  );
}
