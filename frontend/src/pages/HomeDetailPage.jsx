import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { apiFetch } from "../api";
import { useAuth } from "../auth";
import { EmptyState, ErrorState, LoadingState } from "./shared";

export default function HomeDetailPage() {
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
    return (
      <EmptyState
        title="Home not found"
        text="The listing you requested no longer exists."
      />
    );
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
