import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../auth";
import { AuthFormShell } from "./shared";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);

    try {
      await login({ email, password });
      navigate("/index");
    } catch (error) {
      setErrors(error?.data?.errors || [error?.data?.error || error.message]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFormShell
      title="Welcome back"
      copy="Sign in to browse, save favourites, and manage host listings."
      footer={
        <p>
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      }
    >
      <form className="stack-form" onSubmit={handleSubmit}>
        {errors.length ? (
          <div className="form-errors">
            <strong>Error</strong>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </label>

        <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthFormShell>
  );
}
