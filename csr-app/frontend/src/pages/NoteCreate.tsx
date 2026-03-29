import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import NoteForm from '../components/NoteForm';
import type { NoteFormData, Note } from '../types';

export default function NoteCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: NoteFormData) => {
    const { data: note } = await client.post<Note>('/notes', data);
    navigate(`/notes/${note.id}`);
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>New Note</h1>
      <NoteForm onSubmit={handleSubmit} submitLabel="Create Note" />
    </div>
  );
}
