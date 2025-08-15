import axios from "axios";
import { Post, PostCreate, PostId } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com/";

interface PostsHttpResponse {
  posts: Post[];
  totalPages: number;
}

export const fetchPosts = async (
  searchText: string,
  page: number,
  perPage: number = 12
): Promise<PostsHttpResponse> => {
  const response = await axios.get<Post[]>("posts", {
    params: {
      q: searchText,
      _page: page,
      _limit: perPage,
    },
  });

  const totalCount = Number(response.headers["x-total-count"] ?? 0);
  const totalPages = Math.ceil(totalCount / perPage);

  return { posts: response.data, totalPages };
};

export const createPost = async (newPost: PostCreate): Promise<Post> => {
  const response = await axios.post<Post>("posts", newPost);

  return response.data;
};

export const editPost = async (newDataPost: Post): Promise<Post> => {
  const response = await axios.patch<Post>(`posts/${newDataPost.id}`, {
    body: newDataPost.body,
    title: newDataPost.title,
  });

  return response.data;
};

export const deletePost = async (postId: PostId): Promise<Post> => {
  const response = await axios.delete<Post>(`posts/${postId}`, {});

  return response.data;
};
