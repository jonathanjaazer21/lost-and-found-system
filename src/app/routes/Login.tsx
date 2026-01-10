import { Form, useActionData, useSearchParams } from 'react-router';
import { useState } from 'react';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Link } from 'react-router';

export function Login() {
  const actionData = useActionData() as { error?: string } | undefined;
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/app/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card>
      <h2 className="card-title text-center justify-center mb-4">Login</h2>
      <Form method="post" className="space-y-4">
        {actionData?.error && (
          <div className="alert alert-error">
            <span>{actionData.error}</span>
          </div>
        )}

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="card-actions justify-end">
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </Form>
    </Card>
  );
}
