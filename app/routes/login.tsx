import { useSearchParams, useNavigate } from "react-router";
import { useState, FormEvent } from "react";

import { login } from "~/services/auth/authService";
import { Input } from "~/ui/Input";
import { Button } from "~/ui/Button";
import { Card } from "~/ui/Card";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTo = searchParams.get("redirectTo") || "/app/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(redirectTo);
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";

      if (err instanceof Error) {
        const message = err.message.toLowerCase();

        if (
          message.includes("invalid-credential") ||
          message.includes("user-not-found") ||
          message.includes("wrong-password")
        ) {
          errorMessage = "Invalid email or password.";
        } else if (message.includes("too-many-requests")) {
          errorMessage = "Too many failed login attempts. Please try again later.";
        } else if (message.includes("network")) {
          errorMessage = "Network error. Please check your connection.";
        } else if (message.includes("user-disabled")) {
          errorMessage = "This account has been disabled.";
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-4">
        <Card>
          <h2 className="card-title text-center justify-center mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
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
                  "Login"
                )}
              </Button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <a href="/register" className="link link-primary">
                Register here
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
