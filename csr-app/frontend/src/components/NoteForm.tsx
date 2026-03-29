import { useState, type FormEvent } from 'react';
import type { NoteFormData } from '../types';

interface Props {
  initial?: NoteFormData;
  onSubmit: (data: NoteFormData) => Promise<void>;
  submitLabel: string;
}

export default function NoteForm({ initial, onSubmit, submitLabel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ title, content });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 600 }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <textarea
        placeholder="Note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={8}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
