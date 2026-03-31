import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

// ─── State shape ──────────────────────────────────────────────────────────────
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true on mount while we verify stored token
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount: restore session from localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('simon_token');
      const cachedUser = localStorage.getItem('simon_user');

      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        // Verify token is still valid with the server
        const res = await authAPI.getMe();
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: res.data.user, token },
        });
      } catch {
        // Token invalid/expired — clear storage
        localStorage.removeItem('simon_token');
        localStorage.removeItem('simon_user');
        dispatch({ type: 'LOGOUT' });
      }
    };

    restoreSession();
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const login = useCallback((token, user) => {
    localStorage.setItem('simon_token', token);
    localStorage.setItem('simon_user', JSON.stringify(user));
    dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('simon_token');
    localStorage.removeItem('simon_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    // Also update the cached user
    const current = JSON.parse(localStorage.getItem('simon_user') || '{}');
    localStorage.setItem('simon_user', JSON.stringify({ ...current, ...userData }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
