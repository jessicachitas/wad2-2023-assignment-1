import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from '../components/spinner';
import RemoveFromPlaylist from "../components/cardIcons/removeFromPlaylist";

const PlaylistMoviesPage = () => {
  const {playlists: movieIds } = useContext(MoviesContext);

  // Create an array of queries and run in parallel.
  const playlistMovieQueries = useQueries(
    movieIds.map((movieId) => {
      return {
        queryKey: ["movie", { id: movieId }],
        queryFn: getMovie,
      };
    })
  );
  // Check if any of the parallel queries is still loading.
  const isLoading = playlistMovieQueries.find((m) => m.isLoading === true);

  if (isLoading) {
    return <Spinner />;
  }

  const movies = playlistMovieQueries.map((q) => {
    q.data.genre_ids = q.data.genres.map(g => g.id)
    return q.data
  });

  return (
    <PageTemplate
      title="Watchlist Movies"
      movies={movies}
      action={(movie) => {
        return (
          <>
            <RemoveFromPlaylist movie={movie} />
          </>
        );
      }}
    />
  );
;
};

export default PlaylistMoviesPage;