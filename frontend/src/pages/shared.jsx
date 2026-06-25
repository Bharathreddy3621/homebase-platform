import { Link } from "react-router-dom";

import HomeCard from "../components/HomeCard";

export function PageIntro({ eyebrow, title, copy, action }) {
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

export function LoadingState({ label = "Loading..." }) {
  return <div className="state-card">{label}</div>;
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="state-card state-card--empty">
      <h2>{title}</h2>
      <p>{text}</p>
      {action ? <div className="state-card__action">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="state-card state-card--error">
      <h2>Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
}

export function HomeGrid({
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

export function AuthFormShell({ title, copy, children, footer }) {
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
