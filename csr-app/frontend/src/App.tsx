import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import NoteList from './pages/NoteList';
import NoteDetail from './pages/NoteDetail';
import NoteCreate from './pages/NoteCreate';
import NoteEdit from './pages/NoteEdit';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<NoteList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notes/:id" element={<NoteDetail />} />
          <Route path="/notes/new" element={<ProtectedRoute><NoteCreate /></ProtectedRoute>} />
          <Route path="/notes/:id/edit" element={<ProtectedRoute><NoteEdit /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
