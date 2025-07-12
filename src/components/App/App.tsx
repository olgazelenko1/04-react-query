import { useState } from "react";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import Pagination from "../Pagination";
import styles from "./App.module.css";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["movies", searchTerm, currentPage],
    queryFn: () => fetchMovies(searchTerm, currentPage),
    enabled: !!searchTerm,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);
  const handlePageChange = (page: number) => setCurrentPage(page);
  useEffect(() => {
    if (isSuccess && movies.length === 0 && searchTerm) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, movies.length, searchTerm]);

  return (
    <div className={styles.container}>
      <Toaster />
      <SearchBar onSubmit={handleSearchSubmit} />

      {isLoading && <Loader />}

      {isError && (
        <ErrorMessage
          message={(error as Error).message || "Something went wrong"}
        />
      )}
      {!isLoading && !isError && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={handleSelect} />
          {selectedMovie && (
            <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
          )}
        </>
      )}

      {isSuccess && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
