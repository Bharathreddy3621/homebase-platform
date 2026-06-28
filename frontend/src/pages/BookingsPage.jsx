import { Link } from "react-router-dom";

import { useGetBookingsQuery } from "../store/apiSlice";
import { EmptyState, ErrorState, LoadingState, PageIntro } from "./shared";

export default function BookingsPage() {
  const { data, error, isLoading, isFetching } = useGetBookingsQuery();
  const bookings = data?.bookings || [];
  const loading = isLoading || isFetching;
  const errorMessage =
    error?.data?.error || error?.data?.errors?.[0] || error?.error || "";

  if (loading) {
    return <LoadingState />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
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
