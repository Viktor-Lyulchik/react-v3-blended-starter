export interface Post {
  userId: number;
  id: number;
  body: string;
  title: string;
}

export type PostId = Post["id"];

export type PostCreate = Omit<Post, "id">;

export type PostEdit = Omit<PostCreate, "userId">;
