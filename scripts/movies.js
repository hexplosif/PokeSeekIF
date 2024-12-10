// TMDB API URL and key
const apiKey = "5839557fa234ebf4cdc0837c8c37c3b1";
const tmdbBaseUrl = 'https://api.themoviedb.org/3/movie/';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

async function fetchSPARQLMoviesData() {
  const query = moviesRequestWikiData();
  const url = getQueryUrl(WIKIDATA_API, query);
  const response = await fetch(url).then((response) => response.json());
  console.log(response.results.bindings);

  const movies = response.results.bindings.map((movie) => ({
    id: movie.movie.value,
    name: movie.movieLabel.value,
    releaseDate: movie.earliestReleaseDate?.value || "N/A", // Fallback if releaseDate is missing
    director: movie.directorLabel?.value || "Unknown", // Fallback if director is missing
    screenwriter: movie.screenwriterLabel?.value || "Unknown", // Fallback if screenwriter is missing
    producer: movie.producerLabel?.value || "Unknown", // Fallback if producer is missing
    productionCompany: movie.productionCompanyLabel?.value || "Unknown", // Fallback if production company is missing
    duration: movie.duration?.value || "Unknown", // Fallback if duration is missing
    color: movie.colorLabel?.value || "Unknown", // Fallback if color is missing
    imdbID: movie.imdbID?.value || "N/A", // Fallback if IMDb ID is missing
    metacriticScore: movie.metacriticScore?.value || "N/A", // Fallback if Metacritic score is missing
    eirinRating: movie.eirinRatingLabel?.value || "N/A", // Fallback if EIRIN rating is missing
    tmdbID: movie.tmdbID?.value || "101", // Fallback if TMDb ID is missing
  }));

  return movies;
}

// Render the movies in the movies page
function renderMovies(movies) {
  const moviesContainer = document.getElementById("movies-container");
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className =
      "movie-card border border-2 border-dark rounded-3 overflow-hidden shadow-lg";
    card.innerHTML = `
             <div class="card-header">
                <div class="name">${movie.name} (${new Date(movie.releaseDate).getFullYear()})</div>
            </div>
            <div class="card-body">
                <img src="${getMoviePosterURLFromTMDb(movie.tmdbID)}" alt="${movie.name} Movie Poster">
            </div>
        `;
    moviesContainer.appendChild(card);
  });
}

async function getMoviePosterURLFromTMDb(tmdbID) {
    const tmdbUrl = `${tmdbBaseUrl}${tmdbID}?api_key=${apiKey}`;

    try {
        const response = await fetch(tmdbUrl);
        const data = await response.json();

        if (data.poster_path) {
            const posterUrl = `${imageBaseUrl}${data.poster_path}`;
            return posterUrl;
        } else {
            console.log('Poster not found.');
            return 'https://via.placeholder.com/500x750';
        }
    } catch (error) {
        console.error('Error fetching movie data from TMDb:', error);
    }
}


async function main() {
  const movies = await fetchSPARQLMoviesData();
  renderMovies(movies);
}

main();
