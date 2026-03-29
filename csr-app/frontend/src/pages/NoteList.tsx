import { useState, useEffect } from 'react';
import client from '../api/client';
import type { Note } from '../types';
import NoteCard from '../components/NoteCard';

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get<Note[]>('/notes').then(({ data }) => {
      setNotes(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading notes...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>Notes</h1>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
