import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    client.get<Post>(`/posts/${id}`).then(({ data }) => {
      setPost(data);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    await client.delete(`/posts/${id}`);
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  const isOwner = user?.id === post.author.id;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>{post.title}</h1>
      <p style={{ color: '#666' }}>
        By {post.author.username} &middot; {new Date(post.created_at).toLocaleDateString()}
        {post.updated_at !== post.created_at && (
          <> &middot; Updated {new Date(post.updated_at).toLocaleDateString()}</>
        )}
      </p>
      <div style={{ whiteSpace: 'pre-wrap', margin: '1rem 0' }}>{post.content}</div>
      {isOwner && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/posts/${post.id}/edit`}><button>Edit</button></Link>
          <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
        </div>
      )}
      <p><Link to="/">Back to posts</Link></p>
    </div>
  );
}
