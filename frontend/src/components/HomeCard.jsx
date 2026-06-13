import { Link } from "react-router-dom";

function RatingPill({ rating }) {
  return (
    <span className="rating-pill">
      <span className="rating-pill__star">Rating</span>
      {rating}
    </span>
  );
}

export default function HomeCard({
  home,
  detailHref,
  favouriteAction,
  onEdit,
  onDelete,
  actionLabel = "View details",
}) {
  return (
    <article className="home-card">
      <Link to={detailHref} className="home-card__media">
        <img src={home.photoUrl} alt={home.houseName} />
      </Link>
      <div className="home-card__body">
        <div className="home-card__topline">
          <div>
            <h3>{home.houseName}</h3>
            <p>{home.location}</p>
          </div>
          <RatingPill rating={home.rating} />
        </div>

        <p className="home-card__price">Rs {home.price} / night</p>

        <div className="home-card__actions">
          <Link to={detailHref} className="btn btn--primary">
            {actionLabel}
          </Link>
          {favouriteAction}
          {onEdit ? (
            <button type="button" className="btn btn--secondary" onClick={onEdit}>
              Edit
            </button>
          ) : null}
          {onDelete ? (
            <button type="button" className="btn btn--danger" onClick={onDelete}>
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
