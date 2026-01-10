import { Form, useActionData, useSearchParams, useNavigation } from 'react-router';
import { useState } from 'react';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';

export function Login() {
  const actionData = useActionData() as { error?: string } | undefined;
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const redirectTo = searchParams.get('redirectTo') || '/app/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSubmitting = navigation.state === 'submitting';

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
          disabled={isSubmitting}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <div className="card-actions justify-end pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
