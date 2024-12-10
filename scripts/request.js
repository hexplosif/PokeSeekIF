function pokemonsRequestWikiData() {
  return `SELECT DISTINCT ?pokemon ?pokemonLabel ?id ?image
    WHERE
    {
        # Identifiez les Pokémon et leur numéro dans le Pokédex National
        ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .
        ?pokemon p:P1685 ?statement.
        ?statement ps:P1685 ?id;
                pq:P972 wd:Q20005020.
        FILTER (! wikibase:isSomeValue(?id) )   
        
        # Filtrage des langues
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],fr,en". }
    }
    ORDER BY (xsd:integer(?id))
    `;
}

function pokemonsRequestTriplyDB() {
  return `PREFIX poke: <https://triplydb.com/academy/pokemon/vocab/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?name ?description ?speciesLabel ?baseHP ?baseAttack ?baseDefense ?baseSpAtk ?baseSpDef ?baseSpeed ?length ?weight ?nb (GROUP_CONCAT(?typeLabel; separator=', ') AS ?types) WHERE {?pokemon poke:name ?name; poke:description ?description; poke:type ?type; poke:species ?species; poke:baseHP ?baseHP; poke:baseAttack ?baseAttack; poke:baseDefense ?baseDefense; poke:baseSpAtk ?baseSpAtk; poke:baseSpDef ?baseSpDef; poke:baseSpeed ?baseSpeed; poke:length ?length; poke:weight ?weight; poke:nationalNumber ?nb . ?species rdfs:label ?speciesLabel . ?type rdfs:label ?typeLabel FILTER(lang(?description) = 'fr-fr' && lang(?name) = 'fr-fr')} GROUP BY ?name ?description ?speciesLabel ?baseHP ?baseAttack ?baseDefense ?baseSpAtk ?baseSpDef ?baseSpeed ?length ?weight ?nb ORDER BY ?nb`;
}

function moviesRequestWikiData() {
  return `SELECT DISTINCT 
  ?movie 
  ?movieLabel 
  (MIN(?releaseDate) AS ?earliestReleaseDate) 
  ?sequelLabel 
  (GROUP_CONCAT(DISTINCT ?directorLabel; separator=",") AS ?directors)
  (GROUP_CONCAT(DISTINCT ?screenwriterLabel; separator=",") AS ?screenwriters)
  ?productionCompanyLabel 
  ?duration 
  ?tmdbID
  ?imdbID 
  ?metacriticScore 
  ?eirinRatingLabel
WHERE {
  # Find items that are instances of anime films or general films
  ?movie wdt:P31 ?movieType;
         wdt:P527* ?series. # Part of a series
  
  # Ensure the type is either anime film or general film
  VALUES ?movieType { wd:Q20650540 wd:Q11424 } # Anime film or general film

  # Ensure the series is related to Pokémon
  ?series wdt:P179 wd:Q97138261. # "Pokémon" series

  # Optional properties for additional information
  OPTIONAL { ?movie wdt:P577 ?releaseDate. } # Release date
  OPTIONAL { ?movie wdt:P345 ?imdbID. }      # IMDb ID
  OPTIONAL { ?movie wdt:P57  ?director. }    # Directors
  OPTIONAL { ?movie wdt:P58   ?screenwriter. } # Screenwriter
  OPTIONAL { ?movie wdt:P162  ?producer. }   # Producer
  OPTIONAL { ?movie wdt:P272  ?productionCompany. } # Production company
  OPTIONAL { ?movie wdt:P2047 ?duration. }   # Duration
  OPTIONAL { ?movie wdt:P3834 ?eirinRating. } # EIRIN film rating
  OPTIONAL { ?movie wdt:P4947 ?tmdbID. }     # TMDb ID
  OPTIONAL { ?movie wdt:P4969 ?sequel. }  # Sequel
  OPTIONAL { 
    ?movie p:P444 ?metacriticStatement. 
    ?metacriticStatement ps:P444 ?metacriticScore. 
    ?metacriticStatement pq:P447 wd:Q150248. 
  }

  
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,fr". 
  }
}
GROUP BY 
  ?movie
  ?movieLabel
  ?sequelLabel 
  ?productionCompanyLabel 
  ?duration
  ?tmdbID
  ?imdbID
  ?metacriticScore
  ?eirinRatingLabel
ORDER BY ?earliestReleaseDate
`;
}

function gamesRequestWikiData() {
  return `SELECT DISTINCT ?videogame ?videogameLabel ?releaseDate ?directorLabel ?locationLabel 
    WHERE {
      ?videogame wdt:P31 wd:Q7889;
                 wdt:P179 wd:Q24558579.
      OPTIONAL { ?videogame wdt:P577 ?releaseDate. }
      OPTIONAL { ?videogame wdt:P57 ?director. }
      OPTIONAL { ?videogame wdt:P840 ?location. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],fr,en". }
    }
    ORDER BY ?releaseDate
    `
}