import { redirect } from 'react-router';
import { login, register } from '@/services/auth/authService';

export async function loginAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string || '/app/dashboard';

  try {
    await login(email, password);
    return redirect(redirectTo);
  } catch (error) {
    // Transform Firebase errors into user-friendly messages
    let errorMessage = 'Login failed. Please try again.';

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('invalid-credential') || message.includes('user-not-found') || message.includes('wrong-password')) {
        errorMessage = 'Invalid email or password.';
      } else if (message.includes('too-many-requests')) {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (message.includes('user-disabled')) {
        errorMessage = 'This account has been disabled.';
      }
    }

    return { error: errorMessage };
  }
}

export async function registerAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await register(email, password);
    return redirect('/app/dashboard');
  } catch (error) {
    // Transform Firebase errors into user-friendly messages
    let errorMessage = 'Registration failed. Please try again.';

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('email-already-in-use')) {
        errorMessage = 'This email is already registered.';
      } else if (message.includes('invalid-email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (message.includes('weak-password')) {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }
    }

    return { error: errorMessage };
  }
}
