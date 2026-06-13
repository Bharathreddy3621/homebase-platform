import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import { AuthProvider } from "./auth";
import {
  BookingsPage,
  FavouritesPage,
  HomeDetailPage,
  HomeEditorPage,
  HomesPage,
  HostHomesPage,
  IndexPage,
  LoginPage,
  NotFoundPage,
  ProtectedRoute,
  PublicOnlyRoute,
  SignupPage,
} from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/index" replace />} />
            <Route path="/index" element={<IndexPage />} />
            <Route path="/homes" element={<HomesPage />} />
            <Route path="/homes/:homeId" element={<HomeDetailPage />} />
            <Route
              path="/favourites"
              element={
                <ProtectedRoute roles={["guest"]}>
                  <FavouritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute roles={["guest"]}>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignupPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/host/host-home-list"
              element={
                <ProtectedRoute roles={["host"]}>
                  <HostHomesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/add-home"
              element={
                <ProtectedRoute roles={["host"]}>
                  <HomeEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/edit-home/:homeId"
              element={
                <ProtectedRoute roles={["host"]}>
                  <HomeEditorPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
