// Constants
const DBPEDIA_API = 'https://dbpedia.org/sparql'
const WIKIDATA_API = 'https://query.wikidata.org/sparql'
const TRIPLY_DB_API = 'https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql'

// Functions
function getQueryUrl(api, query) {
  return api + '?query=' + encodeURIComponent(query) + '&format=json'
}
