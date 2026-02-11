import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import PostForm from '../components/PostForm';
import { PostFormData, Post } from '../types';

export default function PostEdit() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    client.get<Post>(`/posts/${id}`).then(({ data }) => {
      setPost(data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: PostFormData) => {
    await client.put(`/posts/${id}`, data);
    navigate(`/posts/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>Edit Post</h1>
      <PostForm
        initial={{ title: post.title, content: post.content }}
        onSubmit={handleSubmit}
        submitLabel="Update Post"
      />
    </div>
  );
}
