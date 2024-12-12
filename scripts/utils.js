// API Configuration
const DBPEDIA_API = 'https://dbpedia.org/sparql'
const WIKIDATA_API = 'https://query.wikidata.org/sparql'
const TRIPLY_DB_API = 'https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql'

// TMDB API Configuration
const API_KEY = "5839557fa234ebf4cdc0837c8c37c3b1";
const TMDb_BASE_URL = "https://api.themoviedb.org/3/movie/";
const TMDb_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300/";

// Constants
const MAX_HP = 255
const MAX_ATTACK = 190
const MAX_DEFENSE = 230
const MAX_SP_ATK = 194
const MAX_SP_DEF = 230
const MAX_SPEED = 200
const MAX_TOTAL = 780
const MAX_HEIGHT = 3
const MAX_WEIGHT = 150

// Functions
function getQueryUrl(api, query) {
  return api + '?query=' + encodeURIComponent(query) + '&format=json'
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

function extractIdFromWikidataUrl(url) {
  return url?.match(/entity\/(Q\d+)$/)?.[1];
}
