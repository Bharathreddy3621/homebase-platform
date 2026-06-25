import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../auth";
import { AuthFormShell } from "./shared";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "guest",
    terms: false,
  });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);

    try {
      await signup({
        ...form,
        terms: form.terms ? "on" : "",
      });
      navigate("/login");
    } catch (error) {
      setErrors(error.payload?.errors || [error.message]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFormShell
      title="Create your account"
      copy="The same signup rules stay in place, only the presentation changes."
      footer={
        <p>
          Already have an account? <Link to="/login">Log in</Link>
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

        <div className="split-fields">
          <label className="field">
            <span>First name</span>
            <input
              type="text"
              value={form.firstName}
              onChange={updateField("firstName")}
              placeholder="John"
              required
            />
          </label>

          <label className="field">
            <span>Last name</span>
            <input
              type="text"
              value={form.lastName}
              onChange={updateField("lastName")}
              placeholder="Doe"
              required
            />
          </label>
        </div>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={updateField("email")}
            placeholder="your.email@example.com"
            required
          />
        </label>

        <div className="split-fields">
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={updateField("password")}
              placeholder="Create a password"
              required
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={updateField("confirmPassword")}
              placeholder="Repeat password"
              required
            />
          </label>
        </div>

        <fieldset className="radio-group">
          <legend>I want to register as</legend>
          <label>
            <input
              type="radio"
              name="userType"
              checked={form.userType === "guest"}
              onChange={updateField("userType")}
              value="guest"
            />
            Guest
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              checked={form.userType === "host"}
              onChange={updateField("userType")}
              value="host"
            />
            Host
          </label>
        </fieldset>

        <label className="checkbox-row">
          <input type="checkbox" checked={form.terms} onChange={updateField("terms")} />
          <span>I agree to the terms and conditions</span>
        </label>

        <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </AuthFormShell>
  );
}
