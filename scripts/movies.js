// TMDB API Configuration
const API_KEY = "5839557fa234ebf4cdc0837c8c37c3b1";
const TMDb_BASE_URL = "https://api.themoviedb.org/3/movie/";
const TMDb_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300/";

// Fetch movie data from Wikidata SPARQL query
async function fetchSPARQLMoviesData() {
  const query = moviesRequestWikiData(); // Generate SPARQL query
  const url = getQueryUrl(WIKIDATA_API, query); // Build query URL
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.results.bindings);

    // Map response to movie objects
    return data.results.bindings.map((movie) => ({
      id: movie.movie.value,
      name: movie.movieLabel.value,
      releaseDate: movie.earliestReleaseDate?.value || "Not Defined",
      tmdbID: movie.tmdbID?.value || "2", // Default ID if none provided
    }));
  } catch (error) {
    console.error("Error fetching SPARQL data:", error);
    return [];
  }
}

// Fetch movie poster URL from TMDb
async function getMoviePosterURLFromTMDb(tmdbID) {
  const tmdbUrl = `${TMDb_BASE_URL}${tmdbID}?api_key=${API_KEY}`;
  
  try {
    const response = await fetch(tmdbUrl);
    const data = await response.json();

    return data.poster_path 
      ? `${TMDb_IMAGE_BASE_URL}${data.poster_path}` 
      : "https://via.placeholder.com/200x300"; // Fallback image
  } catch (error) {
    console.error("Error fetching movie data from TMDb:", error);
    return "https://via.placeholder.com/200x300"; // Fallback image
  }
}

// Render movies in the movies page
async function renderMovies(movies) {
  const moviesContainer = document.getElementById("movies-container");

  for (const movie of movies) {
    // Fetch poster URL asynchronously
    const posterUrl = await getMoviePosterURLFromTMDb(movie.tmdbID);

    // Create and populate the movie card
    const card = document.createElement("div");
    card.className = "movie-card border border-2 border-dark rounded-3 overflow-hidden shadow-lg";
    card.innerHTML = `
      <div class="card-header">
          <div class="name">${movie.name} (${new Date(movie.releaseDate).getFullYear()})</div>
      </div>
      <div class="card-body">
          <img src="${posterUrl}" alt="${movie.name} Poster">
      </div>
    `;

    // Add card to the container
    moviesContainer.appendChild(card);
  }
}

async function main() {
  const movies = await fetchSPARQLMoviesData();
  renderMovies(movies);
}

main();
