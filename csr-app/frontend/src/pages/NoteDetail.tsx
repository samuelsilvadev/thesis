import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import type{ Note } from '../types';

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    client.get<Note>(`/notes/${id}`).then(({ data }) => {
      setNote(data);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    await client.delete(`/notes/${id}`);
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (!note) return <p>Note not found.</p>;

  const isOwner = user?.id === note.author.id;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>{note.title}</h1>
      <p style={{ color: '#666' }}>
        By {note.author.username} &middot; {new Date(note.created_at).toLocaleDateString()}
        {note.updated_at !== note.created_at && (
          <> &middot; Updated {new Date(note.updated_at).toLocaleDateString()}</>
        )}
      </p>
      <div style={{ whiteSpace: 'pre-wrap', margin: '1rem 0' }}>{note.content}</div>
      {isOwner && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/notes/${note.id}/edit`}><button>Edit</button></Link>
          <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
        </div>
      )}
      <p><Link to="/">Back to notes</Link></p>
    </div>
  );
}
