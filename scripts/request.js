function pokemonsRequestWikiData() {
  return `SELECT DISTINCT ?pokemon ?pokemonLabel ?pokedexNumber ?generationLabel 
      (GROUP_CONCAT(DISTINCT ?typeLabel; separator=", ") AS ?types) 
      WHERE {
  
      # Identifier les Pokémon
      ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .  # Classe Pokémon

      # Récupérer le numéro de Pokédex
      ?pokemon p:P1685 ?s .
      ?s ps:P1685 ?pokedexNumber .
      ?s pq:P972 wd:Q20005020.

      # Identifier la génération avec P4584
      ?pokemon wdt:P4584 ?generation .
      ?generation rdfs:label ?generationLabel .

      # Identifier les types avec des références
      ?pokemon p:P31 ?typeStatement .
      ?typeStatement ps:P31 ?type ;
                    prov:wasDerivedFrom ?reference .  # Vérifie la présence d'une référence

      # Vérifier que le type est un "type de Pokémon"
      ?type wdt:P1552 wd:Q1266830 .

      # Récupérer les labels en français, puis en anglais si non disponible
      ?pokemon rdfs:label ?pokemonLabel .
      ?type rdfs:label ?typeLabel .

      # Filtrer pour récupérer uniquement le label en français, ou anglais si le français n'existe pas
      FILTER((LANG(?pokemonLabel) = "fr"))
      FILTER((LANG(?typeLabel) = "fr"))
      FILTER((LANG(?generationLabel) = "fr"))

    }
    GROUP BY ?pokemon ?pokemonLabel ?pokedexNumber ?generationLabel
    ORDER BY xsd:integer(?pokedexNumber)
    `;
}

function pokemonRequestWikiData(id) {
  const formattedId = id.toString().padStart(3, '0');
  return `SELECT DISTINCT ?pokemon ?pokemonLabel ?pokedexNumber ?generationLabel
      (GROUP_CONCAT(DISTINCT ?typeLabel; separator=", ") AS ?types)
      WHERE {
  
      # Identifier les Pokémon
      ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .  # Classe Pokémon

      # Récupérer le numéro de Pokédex
      ?pokemon p:P1685 ?s .
      ?s ps:P1685 "${formattedId}" .
      ?s pq:P972 wd:Q20005020.

      # Identifier la génération avec P4584
      ?pokemon wdt:P4584 ?generation .
      ?generation rdfs:label ?generationLabel .

      # Identifier les types avec des références
      ?pokemon p:P31 ?typeStatement .
      ?typeStatement ps:P31 ?type .

      # Récupérer les labels en français, puis en anglais si non disponible
      ?pokemon rdfs:label ?pokemonLabel .
      ?type rdfs:label ?typeLabel .

      # Filtrer pour récupérer uniquement le label en français, ou anglais si le français n'existe pas
      FILTER((LANG(?pokemonLabel) = "fr"))
      FILTER((LANG(?typeLabel) = "fr"))
      FILTER((LANG(?generationLabel) = "fr"))
    }
    GROUP BY ?pokemon ?pokemonLabel ?pokedexNumber ?generationLabel
    `;
}


function pokemonEvolutionsRequest(id) {
  // Formater l'ID pour qu'il ait toujours 3 chiffres avec des zéros devant
  const formattedId = id.toString().padStart(3, '0');
  return `SELECT DISTINCT ?pokemon ?pokemonLabel (GROUP_CONCAT(DISTINCT ?evolLabel; separator=", ") AS ?evolLabels) (GROUP_CONCAT(DISTINCT ?evolNumber; separator=", ") AS ?evolNumbers) WHERE {
    
        # Identifier les Pokémon
        ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .  # Classe Pokémon

        # Récupérer le numéro de Pokédex
        ?pokemon p:P1685 ?s .
        ?s ps:P1685 "${formattedId}" .
        ?s pq:P972 wd:Q20005020.

        # Identifier la ligne évolutive du Pokémon
        ?pokemon wdt:P361 ?evolLineStatement .
        ?evolLineStatement wdt:P31 wd:Q15795637 .
        ?evolLineStatement wdt:P527 ?evol .

        # Récupérer les labels du Pokémon
        ?pokemon rdfs:label ?pokemonLabel .
        ?evol rdfs:label ?evolLabel .
        ?evol p:P1685 ?evolNumberS .
        ?evolNumberS ps:P1685 ?evolNumber .
        ?evolNumberS pq:P972 wd:Q20005020.

        # Filtrer les labels en français
        FILTER((LANG(?pokemonLabel) = "fr"))
        FILTER((LANG(?evolLabel) = "fr"))
    }
    GROUP BY ?pokemon ?pokemonLabel
    `;
}

function pokemonGamesRequest(id) {
  const formattedId = id.toString().padStart(3, '0');
  return `
  SELECT DISTINCT ?pokemon ?pokemonLabel ?gameLabel ?publicationDate WHERE {
        # Identify Pokémon directly by National Pokédex Number
        ?pokemon p:P1685 ?s ;  # National Pokédex Number     
                 wdt:P31/wdt:P279* wd:Q3966183 ;  # Class: Pokémon
                 p:P361 ?gs .          # Generation
        ?s ps:P1685 "${formattedId}" .
        ?s pq:P972 wd:Q20005020.
  
        ?gs ps:P361 ?g .
        ?g wdt:P31 wd:Q99973598 .
        ?g p:P31 ?gs2 .
        ?gs2 pq:P642 ?gg .
  
        ?gg p:P577 ?ds .
        ?ds ps:P577 ?publicationDate .
        ?ds pq:P291 wd:Q17 .
  

        # Retrieve labels
        ?pokemon rdfs:label ?pokemonLabel .
        ?gg rdfs:label ?gameLabel

        # FILTER for French labels
        FILTER(LANG(?pokemonLabel) = "fr")
        FILTER(LANG(?gameLabel) = "fr")
    }
    GROUP BY ?pokemon ?pokemonLabel ?gameLabel ?publicationDate
  `;
}

function pokemonRequestTriplyDB(id) {
  return `
    PREFIX poke: <https://triplydb.com/academy/pokemon/vocab/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?name ?description ?baseHP ?baseAttack ?baseDefense ?baseSpAtk ?baseSpDef ?baseSpeed ?length ?weight
    WHERE {
      ?pokemon poke:name ?name;
              poke:description ?description;
              poke:baseHP ?baseHP;
              poke:baseAttack ?baseAttack;
              poke:baseDefense ?baseDefense;
              poke:baseSpAtk ?baseSpAtk;
              poke:baseSpDef ?baseSpDef;
              poke:baseSpeed ?baseSpeed;
              poke:length ?length;
              poke:weight ?weight;
              poke:nationalNumber ${id};

      FILTER(LANG(?description) = 'fr-fr' && LANG(?name) = 'fr-fr')
    }
    GROUP BY ?name ?description ?baseHP ?baseAttack ?baseDefense ?baseSpAtk ?baseSpDef ?baseSpeed ?length ?weight
  `;
}

function moviesRequestSpecificWikiData(id) {
  return `SELECT DISTINCT 
  ?movie 
  ?movieLabel 
  (MIN(?releaseDate) AS ?earliestReleaseDate) 
  ?sequelLabel 
  ?sequel
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
  OPTIONAL { ?movie wdt:P156 ?sequel. }  # Sequel
  OPTIONAL { 
    ?movie p:P444 ?metacriticStatement. 
    ?metacriticStatement ps:P444 ?metacriticScore. 
    ?metacriticStatement pq:P447 wd:Q150248. 
  }

  FILTER(?movie = ${id})

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
  ?sequel
  ?metacriticScore
  ?eirinRatingLabel
ORDER BY ?earliestReleaseDate
`;
}


function moviesRequestWikiData() {
  return `SELECT DISTINCT 
  ?movie 
  ?movieLabel 
  (MIN(?releaseDate) AS ?earliestReleaseDate) 
  (GROUP_CONCAT(DISTINCT ?directorLabel; separator=",") AS ?directors)
  (GROUP_CONCAT(DISTINCT ?screenwriterLabel; separator=",") AS ?screenwriters)
  ?tmdbID
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
  OPTIONAL { ?movie wdt:P4947 ?tmdbID. }     # TMDb ID

  
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,fr". 
  }
}
GROUP BY 
  ?movie
  ?movieLabel
  ?tmdbID
ORDER BY ?earliestReleaseDate
`;
}

function gamesRequestWikiData() {
  return `
    SELECT DISTINCT ?videogame ?videogameLabel ?releaseDate ?directorLabel ?locationLabel ?logoImage
    WHERE {
      ?videogame wdt:P31 wd:Q7889;
                 wdt:P179 wd:Q24558579.
      OPTIONAL { ?videogame wdt:P577 ?releaseDate. }
      OPTIONAL { ?videogame wdt:P57 ?director. }
      OPTIONAL { ?videogame wdt:P840 ?location. }
      OPTIONAL { ?videogame wdt:P154 ?logoImage. } # Retrieve the logo image property
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],fr,en". }
    }
    ORDER BY ?releaseDate
  `;
}

/* function gamesRequestWikiData(){
    return `SELECT ?videogame ?videogameLabel 
       (GROUP_CONCAT(DISTINCT ?directorLabel; separator=", ") AS ?directors)
       (GROUP_CONCAT(DISTINCT ?locationLabel; separator=", ") AS ?locations)
       (MAX(SUBSTR(STR(?unformattedReleaseDate), 1, 10)) AS ?releaseDate)
      WHERE {
        ?videogame wdt:P31 wd:Q7889;
                  wdt:P179 wd:Q24558579.
        OPTIONAL { ?videogame wdt:P577 ?unformattedReleaseDate. }
        OPTIONAL {
          ?videogame wdt:P57 ?director. 
          ?director rdfs:label ?directorLabel. 
          FILTER(LANG(?directorLabel) = "en").
        }
        OPTIONAL { 
          ?videogame wdt:P840 ?location. 
          ?location rdfs:label ?locationLabel. 
          FILTER(LANG(?locationLabel) = "en").
        }
        SERVICE wikibase:label { bd:serviceParam wikibase:LANGuage "[AUTO_LANGUAGE],fr, en". }
      }
      GROUP BY ?videogame ?videogameLabel
      ORDER BY ?releaseDate

    `
}*/


function pokemonSearchRequest(search, n = 1) {
  return `
    SELECT DISTINCT ?pokemon ?pokemonLabel ?pokedexNumber ?generationLabel 
      (GROUP_CONCAT(DISTINCT ?typeLabel; separator=", ") AS ?types) 
      WHERE {
  
      # Identifier les Pokémon
      ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .  # Classe Pokémon

      # Récupérer le numéro de Pokédex
      ?pokemon wdt:P1685 ?pokedexNumber .

      # Identifier la génération avec P4584
      ?pokemon wdt:P4584 ?generation .
      ?generation rdfs:label ?generationLabel .

      # Identifier les types avec des références
      ?pokemon p:P31 ?typeStatement .
      ?typeStatement ps:P31 ?type ;
                    prov:wasDerivedFrom ?reference .  # Vérifie la présence d'une référence

      # Récupérer les labels en français, puis en anglais si non disponible
      ?pokemon rdfs:label ?pokemonLabel .
      ?type rdfs:label ?typeLabel .

      # Filtrer pour récupérer uniquement le label en français, ou anglais si le français n'existe pas
      FILTER((LANG(?pokemonLabel) = "fr"))
      FILTER((LANG(?typeLabel) = "fr"))
      FILTER((LANG(?generationLabel) = "fr"))
      # search in the pokemon label not only in the beginning
      FILTER(CONTAINS(LCASE(?pokemonLabel), LCASE("${search}")))
    }
    GROUP BY ?pokemon ?pokemonLabel ?pokedexNumber ?generationLabel
    ORDER BY xsd:integer(?pokedexNumber)
    LIMIT ${n}
    `;
}

function movieSearchRequest(search, n = 1) {
  return `SELECT DISTINCT 
  ?movie 
  ?movieLabel 
WHERE {
  # Find items that are instances of anime films or general films
  ?movie wdt:P31 ?movieType;
         wdt:P527* ?series. # Part of a series
  
  # Ensure the type is either anime film or general film
  VALUES ?movieType { wd:Q20650540 wd:Q11424 } # Anime film or general film

  # Ensure the series is related to Pokémon
  ?series wdt:P179 wd:Q97138261. # "Pokémon" series
  
  ?movie rdfs:label ?movieLabel .
  FILTER((LANG(?movieLabel) = "fr"))
  
  FILTER(CONTAINS(LCASE(?movieLabel), LCASE("${search}")))
}
GROUP BY 
  ?movie
  ?movieLabel
LIMIT ${n}
`;
}

function gameSearchRequest(search, n = 1) {
  return `
    SELECT ?videogame ?videogameLabel
    WHERE {
      ?videogame wdt:P31 wd:Q7889;
                 wdt:P179 wd:Q24558579.
      ?videogame rdfs:label ?videogameLabel .
      FILTER((LANG(?videogameLabel) = "fr"))
      FILTER(CONTAINS(LCASE(?videogameLabel), LCASE("${search}")))
    }
    ORDER BY ?releaseDate
    LIMIT ${n}
  `;
}