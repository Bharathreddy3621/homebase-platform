import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { apiFetch } from "../api";
import { ErrorState, HomeGrid, LoadingState, PageIntro } from "./shared";

export default function HostHomesPage() {
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
