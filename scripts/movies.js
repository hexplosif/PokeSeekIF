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

// Render movies in the movies page
async function renderMovies(movies) {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
  const moviesContainer = document.getElementById("movies-container");

  for (const movie of movies) {
    // Fetch poster URL asynchronously
    const posterUrl = await getSpecificMoviePosterURLFromTMDb(movie.tmdbID);


    // Hello Louis début de mon bazar dans ton code, attention le lutin est d'humeur farceur



    // Create and populate the movie card
    const card = document.createElement('a'); // j'ai changé de div en a pour que ça soit un lien
    card.className = "movie-card border border-2 border-dark rounded-3 overflow-hidden shadow-lg";
    var text_id = new String(movie.id.substring(31)) //on récupère l'id et comme c'est un URL on vire le début pour avoir le QXXXX
    card.href = `movie.html?id=${text_id}`; //on rajoute un lien dans les cartes pour pouvoir changer d'URL
    card.innerHTML = ` 
      <div class="card-header">
          <div class="name">${movie.name} (${new Date(movie.releaseDate).getFullYear()})</div>
      </div>
      
      <div class="card-body">
          <img src="${posterUrl}" alt="${movie.name} Poster" class="movie-image">
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
