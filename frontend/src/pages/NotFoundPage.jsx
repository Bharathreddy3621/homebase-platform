import { Link } from "react-router-dom";

import { EmptyState } from "./shared";

export default function NotFoundPage() {
  return (
    <EmptyState
      title="404"
      text="The page you were looking for does not exist."
      action={
        <Link to="/index" className="btn btn--primary">
          Go back home
        </Link>
      }
    />
  );
}
