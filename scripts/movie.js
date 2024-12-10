// TMDB API Configuration
const API_KEY = "5839557fa234ebf4cdc0837c8c37c3b1";
const TMDb_BASE_URL = "https://api.themoviedb.org/3/movie/";
const TMDb_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300/";

// Get movie data from TriplyDB
async function fetchMovie(id) {
    id = "wd:" + id;
    const query = moviesRequestSpecificWikiData(id);
    const url = getQueryUrl(WIKIDATA_API, query);
    const response = await fetch(url).then((response) => response.json());

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
        tmdbID: movie.tmdbID?.value || "2", // Default ID if none provided
    }));

    return movie;
}

async function getSpecificMoviePosterURLFromTMDb(tmdbID) {
    const tmdbUrl = `${TMDb_BASE_URL}${tmdbID}?api_key=${API_KEY}`;
    try {
        const response = await fetch(tmdbUrl);
        const data = await response.json();
        return data.poster_path ? `${TMDb_IMAGE_BASE_URL}${data.poster_path}` : "https://via.placeholder.com/200x300"; // Fallback image
    } catch (error) {
        console.error("Error fetching movie data from TMDb:", error);
        return "https://via.placeholder.com/200x300"; // Fallback image
    }
}

// Render the movie in the movie page
async function renderMovie(movie) {
    movie = movie[0];
    const mainInfo = document.querySelector('.main-info');
    mainInfo.querySelector('.name').textContent = movie.name;

    const releaseDate = document.querySelector('.releaseDate');
    const old_date = new Date(movie.releaseDate);
    const month   = old_date.getUTCMonth() + 1; // months from 1-12
    const day     = old_date.getUTCDate();
    const year    = old_date.getUTCFullYear();
    const newDate = year + "/" + month + "/" + day;
    movie.releaseDate = newDate;
    releaseDate.textContent = movie.releaseDate;

    const director = document.querySelector('.director');
    director.textContent = movie.director;

    const screenwriter = document.querySelector('.screenwriter');
    screenwriter.textContent = movie.screenwriter;

    const producer = document.querySelector('.producer');
    producer.textContent = movie.producer;

    const duration = document.querySelector('.duration');
    duration.textContent = movie.duration;

    const color = document.querySelector('.color');
    color.textContent = movie.color;

    const imdbID = document.querySelector('.imdbID');
    imdbID.textContent = movie.imdbID;

    const metacriticScore = document.querySelector('.metacriticScore');
    metacriticScore.textContent = movie.metacriticScore;

    const eirinRating = document.querySelector('.productionCompany');
    eirinRating.textContent = movie.eirinRating;


    const poster = document.querySelector('.poster');

    // Fetch poster URL asynchronously
    const posterUrl = await getSpecificMoviePosterURLFromTMDb(movie.tmdbID);

    // Create and populate the movie poster
    const poster_fetched = document.createElement("div");
    poster_fetched.innerHTML = `
      <div>
          <img src="${posterUrl}" alt="${movie.name} Poster">
      </div>
    `;
    // Add poster to the container
    poster.appendChild(poster_fetched);
}

async function main() {
    const id = new URLSearchParams(window.location.search).get('id');

    const movies = await fetchMovie(id);
    console.log(movies)
    renderMovie(movies);
}

main();