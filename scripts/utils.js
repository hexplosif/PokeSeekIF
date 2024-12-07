// Constants
const DBPEDIA_API = 'https://dbpedia.org/sparql'
const WIKIDATA_API = 'https://query.wikidata.org/sparql'

// Functions
function getQueryUrl(api, query) {
  return api + '?query=' + encodeURIComponent(query) + '&format=json'
}
