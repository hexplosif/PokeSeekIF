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
    `
}

function pokemonsRequestTriplyDB() {
    return `PREFIX+poke%3a+<https%3a//triplydb.com/academy/pokemon/vocab/>+prefix+rdfs%3a+<http%3a//www.w3.org/2000/01/rdf-schema%23>+SELECT+%3fname+%3fdescription+%3fspeciesLabel+%3fbaseHP+%3fbaseAttack+%3fbaseDefense+%3fbaseSpAtk+%3fbaseSpDef+%3fbaseSpeed+%3flength+%3fweight+%3fnb+(GROUP_CONCAT(%3ftypeLabel%3b+separator%3d',+')+AS+%3ftypes)+WHERE+{%3fpokemon+poke%3aname+%3fname%3b+poke%3adescription+%3fdescription%3b+poke%3atype+%3ftype%3b+poke%3aspecies+%3fspecies%3b+poke%3abaseHP+%3fbaseHP%3b+poke%3abaseAttack+%3fbaseAttack%3b+poke%3abaseDefense+%3fbaseDefense%3b+poke%3abaseSpAtk+%3fbaseSpAtk%3b+poke%3abaseSpDef+%3fbaseSpDef%3b+poke%3abaseSpeed+%3fbaseSpeed%3b+poke%3alength+%3flength%3b+poke%3aweight+%3fweight%3b+poke%3anationalNumber+%3fnb+.+%3fspecies+rdfs%3alabel+%3fspeciesLabel+.+%3ftype+rdfs%3alabel+%3ftypeLabel+FILTER(lang(%3fdescription)+%3d+'fr-fr'+%26%26+lang(%3fname)+%3d+'fr-fr')}+GROUP+BY+%3fname+%3fdescription+%3fspeciesLabel+%3fbaseHP+%3fbaseAttack+%3fbaseDefense+%3fbaseSpAtk+%3fbaseSpDef+%3fbaseSpeed+%3flength+%3fweight+%3fnb+ORDER+BY+%3fnb`
}