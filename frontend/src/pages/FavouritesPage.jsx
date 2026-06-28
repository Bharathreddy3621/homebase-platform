import { Link } from "react-router-dom";

import { useAuth } from "../auth";
import {
  useGetFavouritesQuery,
  useRemoveFavouriteMutation,
} from "../store/apiSlice";
import { ErrorState, HomeGrid, LoadingState, PageIntro } from "./shared";

export default function FavouritesPage() {
  const { user } = useAuth();
  const { data, error, isLoading, isFetching } = useGetFavouritesQuery();
  const [removeFavouriteMutation] = useRemoveFavouriteMutation();
  const homes = data?.favourites || [];
  const loading = isLoading || isFetching;
  const errorMessage =
    error?.data?.error || error?.data?.errors?.[0] || error?.error || "";

  const handleRemoveFavourite = async (home) => {
    await removeFavouriteMutation(home._id).unwrap();
  };

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Saved"
        title="Your favourites"
        copy="This list is powered by the existing session and MongoDB favourites logic."
      />

      {loading ? <LoadingState /> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      {!loading && !errorMessage ? (
        <section className="section-card">
          <HomeGrid
            homes={homes}
            authUser={user}
            onToggleFavourite={handleRemoveFavourite}
            emptyText="You have not saved any homes yet."
            emptyAction={
              <Link to="/homes" className="btn btn--primary">
                Browse homes
              </Link>
            }
          />
        </section>
      ) : null}
    </div>
  );
}
