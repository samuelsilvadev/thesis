import { Link } from 'react-router-dom';
import type { Note } from '../types';

export default function NoteCard({ note }: { note: Note }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
      <h2 style={{ margin: '0 0 0.5rem' }}>
        <Link to={`/notes/${note.id}`}>{note.title}</Link>
      </h2>
      <p style={{ color: '#666', margin: '0 0 0.5rem' }}>
        By {note.author.username} &middot; {new Date(note.created_at).toLocaleDateString()}
      </p>
      <p>{note.content.length > 150 ? note.content.slice(0, 150) + '...' : note.content}</p>
    </div>
  );
}
