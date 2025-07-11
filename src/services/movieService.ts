import axios from "axios";
import type { Movie } from "../types/movie";

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page = 1
): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(`${BASE_URL}/search/movie`, {
    params: {
      query,
      page,
      language: "en-US",
      include_adult: false,
    },
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  return response.data;
};
