export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface NoteAuthor {
  id: number;
  username: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  author: NoteAuthor;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface NoteFormData {
  title: string;
  content: string;
}
