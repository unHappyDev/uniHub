export interface Post {
  postId: string;
  title: string;
  body: string;
  createdAt: string;
  owner: string;
}

export interface CreatePostDTO {
  title: string;
  body: string;
}
