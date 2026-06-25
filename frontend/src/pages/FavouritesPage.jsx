import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { apiFetch } from "../api";
import { useAuth } from "../auth";
import { ErrorState, HomeGrid, LoadingState, PageIntro } from "./shared";

export default function FavouritesPage() {
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
