// Get movie data from TriplyDB
async function fetchMovie(id) {
    const query = moviesRequestSpecificWikiData(id);
    const url = getQueryUrl(WIKIDATA_API, query);
    const response = await fetch(url).then((response) => response.json());

    const movie = response.results.bindings.map(movie => ({
        id: movie.movie.value,
        name: movie.movieLabel.value,
        releaseDate: movie.earliestReleaseDate?.value || 'N/A', // Fallback if releaseDate is missing
        director: movie.directors?.value || 'Unknown', // Fallback if director is missing
        screenwriter: movie.screenwriters?.value || 'Unknown', // Fallback if screenwriter is missing
        producer: movie.producerLabel?.value || 'Unknown', // Fallback if producer is missing
        productionCompany: movie.productionCompanyLabel?.value || 'Unknown', // Fallback if production company is missing
        duration: movie.duration?.value || 'Unknown', // Fallback if duration is missing
        imdbID: movie.imdbID?.value || 'N/A', // Fallback if IMDb ID is missing
        metacriticScore: movie.metacriticScore?.value || 'N/A', // Fallback if Metacritic score is missing
        eirinRating: movie.eirinRatingLabel?.value || 'N/A', // Fallback if EIRIN rating is missing
        tmdbID: movie.tmdbID?.value || "2", // Default ID if none provided
        sequelLabel: movie.sequelLabel?.value || 'N/A', // Fallback if SequelLabel is missing
        sequel: movie.sequel?.value || 'N/A', // Fallback if SequelLabel is missing

    }));

    return movie;
}

// Render the movie in the movie page
async function renderMovie(movie) {
    movie = movie[0];
    const mainInfo = document.querySelector('.main-info');
    mainInfo.querySelector('.name').textContent = movie.name;

    const releaseDate = document.querySelector('.releaseDate');
    const old_date = new Date(movie.releaseDate);
    const month = old_date.getUTCMonth() + 1; // months from 1-12
    const day = old_date.getUTCDate();
    const year = old_date.getUTCFullYear();
    const newDate = year + "/" + month + "/" + day;
    movie.releaseDate = newDate;
    releaseDate.textContent = movie.releaseDate;

    const director = document.querySelector('.director');
    director.textContent = movie.director;

    const screenwriter = document.querySelector('.screenwriter');
    screenwriter.textContent = movie.screenwriter;

    const producer = document.querySelector('.producer');
    producer.textContent = movie.producer;

    const sequel = document.querySelector('.sequelLabel');

    if (movie.sequel == 'N/A') {
        sequel.textContent = movie.sequel;

    }
    else {
        const sequel_link = document.createElement('a');
        var text_id = new String(movie.sequel.substring(31))
        sequel_link.href = `movie.html?id=${text_id}`;
        sequel_link.innerHTML = ` 
          <div>
              <div class="name">${movie.sequelLabel}</div>
          </div>`;

        // Add sequel link to the container
        sequel.appendChild(sequel_link);
    }

    const duration = document.querySelector('.duration');
    duration.textContent = movie.duration;

    const imdbID = document.querySelector('.imdbID');
    imdbID.textContent = movie.imdbID;

    const metacriticScore = document.querySelector('.metacriticScore');
    metacriticScore.textContent = movie.metacriticScore;

    const eirinRating = document.querySelector('.eirinRating');
    eirinRating.textContent = movie.eirinRating;

    const productionCompany = document.querySelector('.productionCompany');
    productionCompany.textContent = movie.productionCompany;

    const poster = document.querySelector('.poster');

    // Fetch poster URL asynchronously
    const posterUrl = await getSpecificMoviePosterURLFromTMDb(movie.tmdbID);

    // Create and populate the movie poster
    const poster_fetched = document.createElement("div");
    poster_fetched.innerHTML = `
      <div>
          <img src="${posterUrl}" alt="${movie.name} Poster" class="movie-image">
      </div>
    `;
    // Add poster to the container
    poster.appendChild(poster_fetched);
}

async function main() {
    const id = new URLSearchParams(window.location.search).get('id');

    const movies = await fetchMovie(id);
    renderMovie(movies);
}

main();