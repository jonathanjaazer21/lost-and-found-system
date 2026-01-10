import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { router } from './router';
import './index.css';

function AppWithReactGrab() {
  const reactGrabLoadedRef = useRef(false);

  useEffect(() => {
    // Only run on client-side, in development, and if not already loaded
    if (
      typeof window !== 'undefined' &&
      import.meta.env.DEV &&
      !reactGrabLoadedRef.current
    ) {
      reactGrabLoadedRef.current = true;
      import('react-grab').catch(err => {
        console.warn('⚠️ Failed to load react-grab:', err);
      });
    }
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithReactGrab />
  </StrictMode>
);
