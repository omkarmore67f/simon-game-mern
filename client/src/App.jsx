import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import DashboardPage   from './pages/DashboardPage';
import GamePage        from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/register"    element={<RegisterPage />} />
          <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/game"        element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="*"            element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(20,22,45,0.95)',
            color: '#e8eaf6',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#10ffb0', secondary: '#07080f' } },
          error:   { iconTheme: { primary: '#ff6b8a', secondary: '#07080f' } },
        }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
