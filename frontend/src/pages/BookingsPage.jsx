import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { apiFetch } from "../api";
import { EmptyState, ErrorState, LoadingState, PageIntro } from "./shared";

export default function BookingsPage() {
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
