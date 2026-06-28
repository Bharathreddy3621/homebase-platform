import { Link, useParams } from "react-router-dom";

import { useAuth } from "../auth";
import {
  useAddFavouriteMutation,
  useGetHomeQuery,
  useRemoveFavouriteMutation,
} from "../store/apiSlice";
import { EmptyState, ErrorState, LoadingState } from "./shared";

export default function HomeDetailPage() {
  const { homeId } = useParams();
  const { user } = useAuth();
  const { data, error, isLoading, isFetching } = useGetHomeQuery(homeId);
  const [addFavourite] = useAddFavouriteMutation();
  const [removeFavourite] = useRemoveFavouriteMutation();
  const home = data?.home || null;
  const loading = isLoading || isFetching;
  const errorMessage =
    error?.data?.error || error?.data?.errors?.[0] || error?.error || "";

  const isFavourite = Boolean(
    user?.favourites?.some((fav) => fav._id === home?._id)
  );

  const toggleFavourite = async () => {
    if (!home || !user) {
      return;
    }

    if (isFavourite) {
      await removeFavourite(home._id).unwrap();
    } else {
      await addFavourite(home._id).unwrap();
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
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
