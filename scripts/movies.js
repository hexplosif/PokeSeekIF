async function fetchMovies() {
    const query = moviesRequestWikiData();
    const url = getQueryUrl(WIKIDATA_API, query);
    const response = await fetch(url).then((response) => response.json());
    console.log(response.results.bindings);
  
    const movies = response.results.bindings.map((movie) => ({
      id: movie.movie.value,
      name: movie.movieLabel.value,
      releaseDate: movie.earliestReleaseDate?.value || 'N/A', // Fallback if releaseDate is missing
      director: movie.directorLabel?.value || 'Unknown', // Fallback if director is missing
      screenwriter: movie.screenwriterLabel?.value || 'Unknown', // Fallback if screenwriter is missing
      producer: movie.producerLabel?.value || 'Unknown', // Fallback if producer is missing
      productionCompany: movie.productionCompanyLabel?.value || 'Unknown', // Fallback if production company is missing
      duration: movie.duration?.value || 'Unknown', // Fallback if duration is missing
      color: movie.colorLabel?.value || 'Unknown', // Fallback if color is missing
      imdbID: movie.imdbID?.value || 'N/A', // Fallback if IMDb ID is missing
      metacriticScore: movie.metacriticScore?.value || 'N/A', // Fallback if Metacritic score is missing
      eirinRating: movie.eirinRatingLabel?.value || 'N/A', // Fallback if EIRIN rating is missing
    }));
  
    return movies;
  }
  

// Render the movies in the movies page
function renderMovies(movies) {
  const moviesContainer = document.getElementById("movies-container");
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className =
      "pkmn-card border border-2 border-dark rounded-3 overflow-hidden shadow-lg";
    card.innerHTML = `
            <div class="card-header">
                <div class="number">${movie.id}</div>
                <div class="name">${movie.name}</div>
            </div>
            <div class="card-footer">
                <div class="release-date">Release date: ${movie.releaseDate}</div>
                <div class="director">Director: ${movie.director}</div>
                <div class="screenwriter">Screenwriter: ${movie.screenwriter}</div>
                <div class="producer">Producer: ${movie.producer}</div>
                <div class="production
            </div>
        `;
    moviesContainer.appendChild(card);
  });
}

async function main() {
  const movies = await fetchMovies();
  renderMovies(movies);
}

main();
