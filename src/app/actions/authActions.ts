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
    return {
      error: error instanceof Error ? error.message : 'Login failed',
    };
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
    return {
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}
