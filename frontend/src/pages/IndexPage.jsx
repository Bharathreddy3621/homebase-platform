import { Link } from "react-router-dom";
import { useMemo } from "react";

import { useAuth } from "../auth";
import { useGetHomesQuery } from "../store/apiSlice";
import { ErrorState, HomeGrid, LoadingState, PageIntro } from "./shared";

export default function IndexPage() {
  const { user } = useAuth();
  const { data, error, isLoading, isFetching } = useGetHomesQuery();
  const homes = data?.homes || [];
  const loading = isLoading || isFetching;
  const errorMessage =
    error?.data?.error || error?.data?.errors?.[0] || error?.error || "";

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
      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      {!loading && !errorMessage ? (
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
