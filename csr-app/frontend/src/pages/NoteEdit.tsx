import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import NoteForm from '../components/NoteForm';
import type { NoteFormData, Note } from '../types';

export default function NoteEdit() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    client.get<Note>(`/notes/${id}`).then(({ data }) => {
      setNote(data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: NoteFormData) => {
    await client.put(`/notes/${id}`, data);
    navigate(`/notes/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!note) return <p>Note not found.</p>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>Edit Note</h1>
      <NoteForm
        initial={{ title: note.title, content: note.content }}
        onSubmit={handleSubmit}
        submitLabel="Update Note"
      />
    </div>
  );
}
