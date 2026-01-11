import { Link, useNavigate } from "react-router";
import { useState, FormEvent } from "react";

import { register as registerUser } from "~/services/auth/authService";
import { Input } from "~/ui/Input";
import { Button } from "~/ui/Button";
import { Card } from "~/ui/Card";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await registerUser(email, password);
      navigate("/app/dashboard");
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";

      if (err instanceof Error) {
        const message = err.message.toLowerCase();

        if (message.includes("email-already-in-use")) {
          errorMessage = "This email is already registered.";
        } else if (message.includes("invalid-email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (message.includes("weak-password")) {
          errorMessage = "Password is too weak. Please use a stronger password.";
        } else if (message.includes("network")) {
          errorMessage = "Network error. Please check your connection.";
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
          <h2 className="card-title text-center justify-center mb-4">Register</h2>
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
              minLength={6}
              disabled={isSubmitting}
            />

            <div className="card-actions justify-end">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
