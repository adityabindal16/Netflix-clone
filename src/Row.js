import React, { useState, useEffect } from 'react';
import axios from './axios';  // Axios instance should have base URL defined
import './Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, islargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [currentMovieId, setCurrentMovieId] = useState(null);  // Store current movie ID to track repeated clicks

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = async (movie) => {
    // If the current movie is clicked again, hide the trailer
    if (trailerUrl && currentMovieId === movie.id) {
      setTrailerUrl('');  // Hide the trailer
      setCurrentMovieId(null);  // Reset the current movie ID
      return;
    }

    // If a different movie is clicked, stop the current trailer
    setTrailerUrl('');  // Reset trailer URL first

    try {
      const movieName = movie?.title || movie?.name || movie?.original_title || movie?.original_name || "";
      const url = await movieTrailer(movieName);

      if (url) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const videoId = urlParams.get("v");

        if (videoId) {
          setTrailerUrl(videoId);  // Play the new trailer
          setCurrentMovieId(movie.id);  // Set the current movie ID to track which movie's trailer is playing
        } else {
          console.error("Trailer not found for this movie.");
        }
      } else {
        console.log("No trailer found.");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${islargeRow && "row_posterLarge"}`}
            src={`${baseUrl}${islargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name || movie.title}
          />
        ))}
      </div>

      {/* Show YouTube player only if there's a trailer URL */}
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
