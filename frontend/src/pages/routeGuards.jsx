import { Navigate } from "react-router-dom";

import { useAuth } from "../auth";
import { LoadingState } from "./shared";

export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Checking session..." />;
  }

  if (user) {
    return (
      <Navigate
        to={user.userType === "host" ? "/host/host-home-list" : "/homes"}
        replace
      />
    );
  }

  return children;
}

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Checking session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.userType)) {
    return (
      <Navigate
        to={user.userType === "host" ? "/host/host-home-list" : "/homes"}
        replace
      />
    );
  }

  return children;
}
