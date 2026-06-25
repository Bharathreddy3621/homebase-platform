import { useEffect, useState } from "react";

import { apiFetch } from "../api";
import { useAuth } from "../auth";
import { ErrorState, HomeGrid, LoadingState, PageIntro } from "./shared";

export default function HomesPage() {
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
