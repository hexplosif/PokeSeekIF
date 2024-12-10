// Constants
const DBPEDIA_API = 'https://dbpedia.org/sparql'
const WIKIDATA_API = 'https://query.wikidata.org/sparql'
const TRIPLY_DB_API = 'https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql'

const MAX_HP = 255
const MAX_ATTACK = 190
const MAX_DEFENSE = 230
const MAX_SP_ATK = 194
const MAX_SP_DEF = 230
const MAX_SPEED = 200
const MAX_TOTAL = 780
const MAX_HEIGHT = 3
const MAX_WEIGHT = 100

// Functions
function getQueryUrl(api, query) {
  return api + '?query=' + encodeURIComponent(query) + '&format=json'
}
