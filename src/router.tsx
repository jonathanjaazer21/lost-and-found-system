import { createBrowserRouter, Navigate } from 'react-router';
import { ProtectedLayout } from './app/layouts/ProtectedLayout';
import { PublicLayout } from './app/layouts/PublicLayout';
import { Login } from './app/routes/Login';
import { Register } from './app/routes/Register';
import { Dashboard } from './app/routes/Dashboard';
import { loginAction, registerAction } from './app/actions/authActions';
import { lostItemsLoader } from './app/loaders/lostItemsLoader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
        action: loginAction,
      },
      {
        path: '/register',
        element: <Register />,
        action: registerAction,
      },
    ],
  },
  {
    path: '/app',
    element: <ProtectedLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
        loader: lostItemsLoader,
      },
    ],
  },
]);
