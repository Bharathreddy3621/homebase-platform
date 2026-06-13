import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { apiFetch } from "./api";
import { useAuth } from "./auth";
import HomeCard from "./components/HomeCard";

function PageIntro({ eyebrow, title, copy, action }) {
  return (
    <section className="hero-panel">
      <div className="hero-panel__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-panel__text">{copy}</p>
        {action ? <div className="hero-panel__actions">{action}</div> : null}
      </div>
    </section>
  );
}

function LoadingState({ label = "Loading..." }) {
  return <div className="state-card">{label}</div>;
}

function EmptyState({ title, text, action }) {
  return (
    <div className="state-card state-card--empty">
      <h2>{title}</h2>
      <p>{text}</p>
      {action ? <div className="state-card__action">{action}</div> : null}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="state-card state-card--error">
      <h2>Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
}

function HomeGrid({
  homes,
  authUser,
  onToggleFavourite,
  onEdit,
  onDelete,
  emptyText,
  emptyAction,
}) {
  if (!homes.length) {
    return (
      <EmptyState
        title="No homes yet"
        text={emptyText || "There are no listings right now."}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid-cards">
      {homes.map((home) => {
        const isFavourite = Boolean(
          authUser?.favourites?.some((fav) => fav._id === home._id)
        );
        const favouriteAction = onToggleFavourite
          ? authUser?.userType === "guest"
            ? (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => onToggleFavourite(home, isFavourite)}
              >
                {isFavourite ? "Saved" : "Add to favourites"}
              </button>
            )
            : !authUser
              ? (
                <Link to="/login" className="btn btn--secondary">
                  Log in to save
                </Link>
              )
              : null
          : null;

        return (
          <HomeCard
            key={home._id}
            home={home}
            detailHref={`/homes/${home._id}`}
            favouriteAction={favouriteAction}
            onEdit={onEdit ? () => onEdit(home) : null}
            onDelete={onDelete ? () => onDelete(home) : null}
          />
        );
      })}
    </div>
  );
}

export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Checking session..." />;
  }

  if (user) {
    return <Navigate to={user.userType === "host" ? "/host/host-home-list" : "/homes"} replace />;
  }

  return children;
}

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Checking session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.userType)) {
    return <Navigate to={user.userType === "host" ? "/host/host-home-list" : "/homes"} replace />;
  }

  return children;
}

export function IndexPage() {
  const { user } = useAuth();
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/homes")
      .then((data) => setHomes(data.homes || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const featuredHomes = useMemo(() => homes.slice(0, 3), [homes]);

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Homebase"
        title="Find a place that feels like the trip already started"
        copy="Browse stays, save favourites, and manage host listings from the same experience. The React UI keeps the existing Airbnb clone features intact, but gives them a faster and cleaner surface."
        action={
          <div className="cta-row">
            <Link to="/homes" className="btn btn--primary">
              Explore homes
            </Link>
            {!user ? (
              <Link to="/signup" className="btn btn--ghost">
                Create account
              </Link>
            ) : null}
          </div>
        }
      />

      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error ? (
        <section className="section-card">
          <div className="section-card__head">
            <h2>Featured homes</h2>
            <p>Hand-picked from the current catalog.</p>
          </div>
          <HomeGrid homes={featuredHomes} authUser={user} />
        </section>
      ) : null}
    </div>
  );
}

export function HomesPage() {
  const { user } = useAuth();
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/homes")
      .then((data) => setHomes(data.homes || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavourite = async (home, isFavourite) => {
    if (!user) {
      return;
    }

    if (isFavourite) {
      await apiFetch(`/favourites/${home._id}`, { method: "DELETE" });
    } else {
      await apiFetch("/favourites", {
        method: "POST",
        body: JSON.stringify({ id: home._id }),
      });
    }
  };

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Browse"
        title="Every home in one view"
        copy="Guests can browse and save listings. Hosts can jump into management from the same app."
      />

      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error ? (
        <section className="section-card">
          <HomeGrid homes={homes} authUser={user} onToggleFavourite={toggleFavourite} />
        </section>
      ) : null}
    </div>
  );
}

export function HomeDetailPage() {
  const { homeId } = useParams();
  const { user, refreshAuth } = useAuth();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/homes/${homeId}`)
      .then((data) => setHome(data.home))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [homeId]);

  const isFavourite = Boolean(
    user?.favourites?.some((fav) => fav._id === home?._id)
  );

  const toggleFavourite = async () => {
    if (!home || !user) {
      return;
    }

    if (isFavourite) {
      await apiFetch(`/favourites/${home._id}`, { method: "DELETE" });
    } else {
      await apiFetch("/favourites", {
        method: "POST",
        body: JSON.stringify({ id: home._id }),
      });
    }

    await refreshAuth();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!home) {
    return <EmptyState title="Home not found" text="The listing you requested no longer exists." />;
  }

  return (
    <div className="detail-layout">
      <section className="detail-hero">
        <img src={home.photoUrl} alt={home.houseName} />
      </section>

      <section className="detail-panel">
        <p className="eyebrow">Home detail</p>
        <h1>{home.houseName}</h1>
        <p className="detail-panel__location">{home.location}</p>
        <div className="detail-panel__meta">
          <span className="price-chip">Rs {home.price} / night</span>
          <span className="rating-pill rating-pill--dark">Rating {home.rating}</span>
        </div>

        <div className="detail-section">
          <h2>Description</h2>
          <p>{home.description || "No description provided."}</p>
        </div>

        <div className="detail-section">
          <h2>House rules</h2>
          {home.houseRules ? (
            <a href={home.houseRules} className="btn btn--secondary" download>
              Download PDF
            </a>
          ) : (
            <p>No house rules document available.</p>
          )}
        </div>

        <div className="cta-row">
          {user?.userType === "guest" ? (
            <button type="button" className="btn btn--primary" onClick={toggleFavourite}>
              {isFavourite ? "Remove from favourites" : "Add to favourites"}
            </button>
          ) : !user ? (
            <Link to="/login" className="btn btn--primary">
              Log in to save
            </Link>
          ) : null}
          <Link to="/homes" className="btn btn--ghost">
            Back to homes
          </Link>
        </div>
      </section>
    </div>
  );
}

export function FavouritesPage() {
  const { user, refreshAuth } = useAuth();
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavourites = async () => {
    const data = await apiFetch("/favourites");
    setHomes(data.favourites || []);
  };

  useEffect(() => {
    loadFavourites()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const removeFavourite = async (home) => {
    await apiFetch(`/favourites/${home._id}`, { method: "DELETE" });
    await loadFavourites();
    await refreshAuth();
  };

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Saved"
        title="Your favourites"
        copy="This list is powered by the existing session and MongoDB favourites logic."
      />

      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error ? (
        <section className="section-card">
          <HomeGrid
            homes={homes}
            authUser={user}
            onToggleFavourite={removeFavourite}
            emptyText="You have not saved any homes yet."
            emptyAction={
              <Link to="/homes" className="btn btn--primary">
                Browse homes
              </Link>
            }
          />
        </section>
      ) : null}
    </div>
  );
}

export function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/bookings")
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Bookings"
        title="Bookings"
        copy="This is still a placeholder, just like the original app. The page is preserved so the feature surface stays the same."
      />

      <section className="section-card">
        {bookings.length ? (
          <pre className="code-block">{JSON.stringify(bookings, null, 2)}</pre>
        ) : (
          <EmptyState
            title="No bookings yet"
            text="Bookings will appear here once the reservation flow is connected."
            action={
              <Link to="/homes" className="btn btn--primary">
                Browse homes
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}

function AuthFormShell({ title, copy, children, footer }) {
  return (
    <div className="auth-layout">
      <section className="section-card auth-card">
        <PageIntro eyebrow="Account" title={title} copy={copy} />
        {children}
        {footer ? <div className="auth-card__footer">{footer}</div> : null}
      </section>
    </div>
  );
}

export function LoginPage() {
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
      setErrors(error.payload?.errors || [error.message]);
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

export function SignupPage() {
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

export function HostHomesPage() {
  const navigate = useNavigate();
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHomes = async () => {
    const data = await apiFetch("/host/homes");
    setHomes(data.homes || []);
  };

  useEffect(() => {
    loadHomes()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (home) => {
    if (!window.confirm(`Delete ${home.houseName}?`)) {
      return;
    }

    await apiFetch(`/host/homes/${home._id}`, { method: "DELETE" });
    await loadHomes();
  };

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Host"
        title="Your hosted homes"
        copy="This mirrors the original host list, edit flow, and delete action."
        action={
          <Link to="/host/add-home" className="btn btn--primary">
            Add home
          </Link>
        }
      />

      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error ? (
        <section className="section-card">
          <HomeGrid
            homes={homes}
            onEdit={(home) => navigate(`/host/edit-home/${home._id}`)}
            onDelete={handleDelete}
            emptyText="You have not listed any homes yet."
            emptyAction={
              <Link to="/host/add-home" className="btn btn--primary">
                Add a home
              </Link>
            }
          />
        </section>
      ) : null}
    </div>
  );
}

function HomeEditorForm({ mode, initialHome, onSubmit, submitting }) {
  const [form, setForm] = useState({
    houseName: "",
    price: "",
    location: "",
    rating: "",
    description: "",
    photoUrl: null,
    houseRules: null,
  });

  useEffect(() => {
    if (initialHome) {
      setForm({
        houseName: initialHome.houseName || "",
        price: initialHome.price || "",
        location: initialHome.location || "",
        rating: initialHome.rating || "",
        description: initialHome.description || "",
        photoUrl: null,
        houseRules: null,
      });
    }
  }, [initialHome]);

  const updateField = (field) => (event) => {
    const value = event.target.type === "file" ? event.target.files?.[0] || null : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="split-fields">
        <label className="field">
          <span>House name</span>
          <input value={form.houseName} onChange={updateField("houseName")} required />
        </label>
        <label className="field">
          <span>Price per night</span>
          <input type="number" min="0" value={form.price} onChange={updateField("price")} required />
        </label>
      </div>

      <div className="split-fields">
        <label className="field">
          <span>Location</span>
          <input value={form.location} onChange={updateField("location")} required />
        </label>
        <label className="field">
          <span>Rating</span>
          <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={updateField("rating")} required />
        </label>
      </div>

      <label className="field">
        <span>Photo</span>
        <input type="file" accept="image/*" onChange={updateField("photoUrl")} />
      </label>

      <label className="field">
        <span>House rules PDF</span>
        <input type="file" accept="application/pdf" onChange={updateField("houseRules")} />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea rows="5" value={form.description} onChange={updateField("description")} />
      </label>

      <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
        {submitting ? "Saving..." : mode === "edit" ? "Update home" : "Add home"}
      </button>
    </form>
  );
}

export function HomeEditorPage() {
  const { homeId } = useParams();
  const navigate = useNavigate();
  const mode = homeId ? "edit" : "create";
  const [initialHome, setInitialHome] = useState(null);
  const [loading, setLoading] = useState(Boolean(homeId));
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!homeId) {
      return;
    }

    apiFetch(`/homes/${homeId}`)
      .then((data) => setInitialHome(data.home))
      .catch((err) => setErrors([err.message]))
      .finally(() => setLoading(false));
  }, [homeId]);

  const submit = async (form) => {
    setSubmitting(true);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append("houseName", form.houseName);
      formData.append("price", form.price);
      formData.append("location", form.location);
      formData.append("rating", form.rating);
      formData.append("description", form.description);
      if (homeId) {
        formData.append("id", homeId);
      }
      if (form.photoUrl) {
        formData.append("photoUrl", form.photoUrl);
      }
      if (form.houseRules) {
        formData.append("houseRules", form.houseRules);
      }

      if (mode === "edit") {
        await apiFetch(`/host/homes/${homeId}`, {
          method: "PUT",
          body: formData,
        });
        navigate("/host/host-home-list");
      } else {
        await apiFetch("/host/homes", {
          method: "POST",
          body: formData,
        });
        navigate("/host/host-home-list");
      }
    } catch (error) {
      setErrors(error.payload?.errors || [error.message]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="auth-layout">
      <section className="section-card auth-card">
        <PageIntro
          eyebrow="Host"
          title={mode === "edit" ? "Edit your home" : "Register a new home"}
          copy="Upload a hero image and a PDF with house rules just like the original version."
        />

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

        {mode === "edit" && initialHome ? (
          <div className="current-preview">
            <img src={initialHome.photoUrl} alt={initialHome.houseName} />
            <div>
              <p className="current-preview__label">Current image</p>
              <strong>{initialHome.houseName}</strong>
            </div>
          </div>
        ) : null}

        <HomeEditorForm mode={mode} initialHome={initialHome} onSubmit={submit} submitting={submitting} />
      </section>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <EmptyState
      title="404"
      text="The page you were looking for does not exist."
      action={
        <Link to="/index" className="btn btn--primary">
          Go back home
        </Link>
      }
    />
  );
}
