import { Link, useNavigate } from "react-router-dom";

import {
  useDeleteHostHomeMutation,
  useGetHostHomesQuery,
} from "../store/apiSlice";
import { ErrorState, HomeGrid, LoadingState, PageIntro } from "./shared";

export default function HostHomesPage() {
  const navigate = useNavigate();
  const { data, error, isLoading, isFetching } = useGetHostHomesQuery();
  const [deleteHostHome] = useDeleteHostHomeMutation();
  const homes = data?.homes || [];
  const loading = isLoading || isFetching;
  const errorMessage =
    error?.data?.error || error?.data?.errors?.[0] || error?.error || "";

  const handleDelete = async (home) => {
    if (!window.confirm(`Delete ${home.houseName}?`)) {
      return;
    }

    await deleteHostHome(home._id).unwrap();
  };

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Host"
        title="Your hosted homes"
        copy="This mirrors the original host list, edit flow, and delete action."
        action={
          <Link to="/host/add-home" className="btn btn--primary">
            Add home
          </Link>
        }
      />

      {loading ? <LoadingState /> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      {!loading && !errorMessage ? (
        <section className="section-card">
          <HomeGrid
            homes={homes}
            onEdit={(home) => navigate(`/host/edit-home/${home._id}`)}
            onDelete={handleDelete}
            emptyText="You have not listed any homes yet."
            emptyAction={
              <Link to="/host/add-home" className="btn btn--primary">
                Add a home
              </Link>
            }
          />
        </section>
      ) : null}
    </div>
  );
}
