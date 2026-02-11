import { useState, useEffect } from 'react';
import client from '../api/client';
import { Post } from '../types';
import PostCard from '../components/PostCard';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get<Post[]>('/posts').then(({ data }) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>Posts</h1>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
