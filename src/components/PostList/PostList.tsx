import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (post: Post) => void;
}

export default function PostList({ posts, toggleModal, toggleEditPost }: PostListProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deletePost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfuly!");
    },
  });

  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button
              onClick={() => {
                toggleEditPost(post);
                toggleModal();
              }}
              className={css.edit}
            >
              Edit
            </button>
            <button onClick={() => deleteMutation(post.id)} className={css.delete}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
