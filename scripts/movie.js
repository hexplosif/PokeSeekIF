// Get movie data from TriplyDB
async function fetchMovie() {
    const query = moviesRequestWikiData();
    const url = getQueryUrl(WIKIDATA_API, query);
    const response = await fetch(url).then((response) => response.json());
    console.log(response);
  
    const movie = response.results.bindings.map(movie => ({
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
    return movie;
}

// Render the movie in the movie page
function renderMovie(movie) {

    const mainInfo = document.querySelector('.main-info');
    mainInfo.querySelector('.name').textContent = movie.name;

    const generation = document.querySelector('.generation');
    generation.querySelector('.name').textContent = movie.generation;
}

async function main() {
    const movies = await fetchMovie();
    renderMovie(movies[0]);
}

main();