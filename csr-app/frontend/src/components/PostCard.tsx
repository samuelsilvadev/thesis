import { Link } from 'react-router-dom';
import { Post } from '../types';

export default function PostCard({ post }: { post: Post }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
      <h2 style={{ margin: '0 0 0.5rem' }}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <p style={{ color: '#666', margin: '0 0 0.5rem' }}>
        By {post.author.username} &middot; {new Date(post.created_at).toLocaleDateString()}
      </p>
      <p>{post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content}</p>
    </div>
  );
}
