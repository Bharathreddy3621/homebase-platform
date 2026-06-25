import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { apiFetch } from "../api";
import { LoadingState, PageIntro } from "./shared";

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

export default function HomeEditorPage() {
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
