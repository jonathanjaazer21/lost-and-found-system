import { Form, useActionData, Link } from 'react-router';
import { useState } from 'react';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';

export function Register() {
  const actionData = useActionData() as { error?: string } | undefined;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card>
      <h2 className="card-title text-center justify-center mb-4">Register</h2>
      <Form method="post" className="space-y-4">
        {actionData?.error && (
          <div className="alert alert-error">
            <span>{actionData.error}</span>
          </div>
        )}

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
          minLength={6}
        />

        <div className="card-actions justify-end">
          <Button type="submit" className="w-full">
            Register
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </Form>
    </Card>
  );
}
