function pokemonsRequest() {
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
    `
  }