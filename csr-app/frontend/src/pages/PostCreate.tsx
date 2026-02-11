import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import PostForm from '../components/PostForm';
import { PostFormData, Post } from '../types';

export default function PostCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: PostFormData) => {
    const { data: post } = await client.post<Post>('/posts', data);
    navigate(`/posts/${post.id}`);
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>New Post</h1>
      <PostForm onSubmit={handleSubmit} submitLabel="Create Post" />
    </div>
  );
}
