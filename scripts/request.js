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

function pokemonsRequestTriplyDB() {}

function moviesRequestWikiData() {
  return `SELECT DISTINCT 
  ?movie 
  ?movieLabel 
  (MIN(?releaseDate) AS ?earliestReleaseDate) 
  ?originalTitle 
  ?sequelLabel 
  ?directorLabel 
  ?screenwriterLabel 
  ?producerLabel 
  ?productionCompanyLabel 
  ?duration 
  ?colorLabel 
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
  OPTIONAL { ?movie wdt:P57  ?director. }    # Director
  OPTIONAL { ?movie wdt:P1476 ?originalTitle. } # Original title
  OPTIONAL { ?movie wdt:P156  ?sequel. }     # Sequels
  OPTIONAL { ?movie wdt:P58   ?screenwriter. } # Screenwriter
  OPTIONAL { ?movie wdt:P162  ?producer. }   # Producer
  OPTIONAL { ?movie wdt:P272  ?productionCompany. } # Production company
  OPTIONAL { ?movie wdt:P2047 ?duration. }   # Duration
  OPTIONAL { ?movie wdt:P462  ?color. }      # Color

  # Metacritic review score
  OPTIONAL { 
    ?movie p:P444 ?metacriticStatement. 
    ?metacriticStatement ps:P444 ?metacriticScore. 
    ?metacriticStatement pq:P447 wd:Q150248. 
  }

  # EIRIN film rating
  OPTIONAL { ?movie wdt:P3834 ?eirinRating. } # EIRIN film rating

  # Language labels
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
GROUP BY ?movie ?movieLabel ?originalTitle ?sequelLabel ?directorLabel ?screenwriterLabel 
         ?producerLabel ?productionCompanyLabel ?duration ?colorLabel ?imdbID 
         ?metacriticScore ?eirinRatingLabel
ORDER BY ?earliestReleaseDate
`;
}

function pokemonsRequestTriplyDB() {
    
}