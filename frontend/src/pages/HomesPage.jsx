import { useAuth } from "../auth";
import {
  useAddFavouriteMutation,
  useGetHomesQuery,
  useRemoveFavouriteMutation,
} from "../store/apiSlice";
import { ErrorState, HomeGrid, LoadingState, PageIntro } from "./shared";

export default function HomesPage() {
  const { user } = useAuth();
  const { data, error, isLoading, isFetching } = useGetHomesQuery();
  const [addFavourite] = useAddFavouriteMutation();
  const [removeFavourite] = useRemoveFavouriteMutation();
  const homes = data?.homes || [];
  const loading = isLoading || isFetching;
  const errorMessage =
    error?.data?.error || error?.data?.errors?.[0] || error?.error || "";

  const toggleFavourite = async (home, isFavourite) => {
    if (!user) {
      return;
    }

    if (isFavourite) {
      await removeFavourite(home._id).unwrap();
    } else {
      await addFavourite(home._id).unwrap();
    }
  };

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Browse"
        title="Every home in one view"
        copy="Guests can browse and save listings. Hosts can jump into management from the same app."
      />

      {loading ? <LoadingState /> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      {!loading && !errorMessage ? (
        <section className="section-card">
          <HomeGrid homes={homes} authUser={user} onToggleFavourite={toggleFavourite} />
        </section>
      ) : null}
    </div>
  );
}
