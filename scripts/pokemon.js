// Get pokemon data from TriplyDB
async function fetchPokemon(id) {

    const gamesQuery = pokemonGamesRequest(id);
    const gamesUrl = getQueryUrl(WIKIDATA_API, gamesQuery);
    const response1 = await fetch(gamesUrl).then(response => response.json());
    const games = response1.results.bindings.map(game => {
        return {
            id: game.gameId.value.substring(31),
            name: game.gameLabel.value,
            publicationDate: game.publicationDate.value.split('-')[0]
        };
    });

    const statQuery = pokemonRequestTriplyDB(id);
    const statUrl = getQueryUrl(TRIPLY_DB_API, statQuery);
    const stats = await fetch(statUrl).then(response => response.json());

    const pokemonQuery = pokemonRequestWikiData(id);
    const pokemonUrl = getQueryUrl(WIKIDATA_API, pokemonQuery);
    const response3 = await fetch(pokemonUrl).then(response => response.json());
    const pokemon = response3.results.bindings;  
    
    console.log(response3);

    const evolutionQuery = pokemonEvolutionsRequest(id);
    const evolutionUrl = getQueryUrl(WIKIDATA_API, evolutionQuery);
    const response2 = await fetch(evolutionUrl).then(response => response.json());
    const evolutions = response2.results.bindings;

    let currentEvolution = {
        name: pokemon[0].pokemonLabel.value,
        number: parseInt(id)
    };
    let base = {
        name: pokemon[0].pokemonLabel.value,
        number: parseInt(id)
    }
    let niveau1 = undefined;
    let niveau2 = undefined;

    // Check si le pokemon a des évolutions
    if (evolutions.length > 0) {
        // Extraire les noms d'évolution et les numéros d'évolution
        const evolLabels = evolutions[0].evolLabels.value.split(', ');
        const evolNumbers = evolutions[0].evolNumbers.value.split(', ');

        // Créer un tableau des évolutions (label et numéro) et trier par numéro
        const evolutionsWithNumbers = evolLabels.map((label, index) => ({
            name: label,
            number: parseInt(evolNumbers[index])
        }));

        // Trier les évolutions par numéro
        evolutionsWithNumbers.sort((a, b) => (a.number) - (b.number));

        // Trouver l'évolution du Pokémon actuel (ID)

        currentEvolution = evolutionsWithNumbers.find(evolution => evolution.number === parseInt(id));
        
        base = evolutionsWithNumbers[0];
        niveau1 = evolutionsWithNumbers[1];
        niveau2 = evolutionsWithNumbers[2];
    }

    // SI le Pokémon n'existe pas dans TriplyDB, on utilise l'API de PokeAPI

    if (stats.length === 0) {
        const statsAPI = await fetchStatsViaPokeAPI(id);
        return {
            id: id,
            name: pokemon[0].pokemonLabel.value,
            description: "La description de ce Pokémon n'est pas disponible.",
            height: statsAPI.height,
            weight: statsAPI.weight,
            baseHP: statsAPI.baseHP,
            baseAttack: statsAPI.baseAttack,
            baseDefense: statsAPI.baseDefense,
            baseSpAtk: statsAPI.baseSpAtk,
            baseSpDef: statsAPI.baseSpDef,
            baseSpeed: statsAPI.baseSpeed,
            types: pokemon[0].types.value.split(', '),
            generation: pokemon[0].generationLabel.value.split(' ')
                .slice(0, 2) // Prendre seulement les deux premiers mots
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Mettre la première lettre en majuscule
                .join(' '), // Rejoindre les mots
            evolutions: {
                base: base,
                niveau1: niveau1,
                niveau2: niveau2,
                current: currentEvolution,
            },
            games: games,
        };
    }

    // Organiser les données pour l'affichage
    return {
        id: id,
        name: pokemon[0].pokemonLabel.value,
        description: stats[0].description,
        height: stats[0].length,
        weight: stats[0].weight,
        baseHP: stats[0].baseHP,
        baseAttack: stats[0].baseAttack,
        baseDefense: stats[0].baseDefense,
        baseSpAtk: stats[0].baseSpAtk,
        baseSpDef: stats[0].baseSpDef,
        baseSpeed: stats[0].baseSpeed,
        types: pokemon[0].types.value.split(', '),
        generation: pokemon[0].generationLabel.value.split(' ')
            .slice(0, 2) // Prendre seulement les deux premiers mots
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Mettre la première lettre en majuscule
            .join(' '), // Rejoindre les mots
        evolutions: {
            base: base,
            niveau1: niveau1,
            niveau2: niveau2,
            current: currentEvolution,
        },
        games: games,
    };
}

function fetchStatsViaPokeAPI(id) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => {
            return {
                height: data.height,
                weight: data.weight,
                baseHP: data.stats[0].base_stat,
                baseAttack: data.stats[1].base_stat,
                baseDefense: data.stats[2].base_stat,
                baseSpAtk: data.stats[3].base_stat,
                baseSpDef: data.stats[4].base_stat,
                baseSpeed: data.stats[5].base_stat,
            };
        });
}


// Render the pokemon in the pokemon page
function renderPokemon(pokemon) {
    const mainInfo = document.querySelector('.main-info');
    mainInfo.querySelector('.number').textContent = pokemon.id;
    mainInfo.querySelector('.name').textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase();

    const image = document.querySelector('.pokemon');
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    image.alt = pokemon.name;

    const description = document.querySelector('.description');
    description.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = pokemon.description;
    description.appendChild(p);

    const height = document.querySelector('.height');
    height.style.width = Math.min(pokemon.height / 10 / MAX_HEIGHT * 100, 100) + '%';
    height.textContent = pokemon.height / 10 + ' m';

    const weight = document.querySelector('.weight');
    weight.style.width = Math.min(pokemon.weight / 10 / MAX_WEIGHT * 100, 100) + '%';
    weight.textContent = pokemon.weight / 10 + ' kg';

    const hp = document.querySelector('.hp');
    hp.style.width = Math.min(pokemon.baseHP / MAX_HP * 100, 100) + '%';
    hp.textContent = pokemon.baseHP;

    const attack = document.querySelector('.attack');
    attack.style.width = Math.min(pokemon.baseAttack / MAX_ATTACK * 100, 100) + '%';
    attack.textContent = pokemon.baseAttack;

    const defense = document.querySelector('.defense');
    defense.style.width = Math.min(pokemon.baseDefense / MAX_DEFENSE * 100, 100) + '%';
    defense.textContent = pokemon.baseDefense;

    const spAtk = document.querySelector('.spe-attack');
    spAtk.style.width = Math.min(pokemon.baseSpAtk / MAX_SP_ATK * 100, 100) + '%';
    spAtk.textContent = pokemon.baseSpAtk;

    const spDef = document.querySelector('.spe-defense');
    spDef.style.width = Math.min(pokemon.baseSpDef / MAX_SP_DEF * 100, 100) + '%';
    spDef.textContent = pokemon.baseSpDef;

    const speed = document.querySelector('.speed');
    speed.style.width = Math.min(pokemon.baseSpeed / MAX_SPEED * 100, 100) + '%';
    speed.textContent = pokemon.baseSpeed;

    const total = document.querySelector('.total');
    var totalValue = +pokemon.baseHP + +pokemon.baseAttack + +pokemon.baseDefense + +pokemon.baseSpAtk + +pokemon.baseSpDef + +pokemon.baseSpeed;
    total.style.width = Math.min(totalValue / MAX_TOTAL * 100, 100) + '%';
    total.textContent = totalValue;

    const types = document.querySelector('.types');
    types.innerHTML = '';
    pokemon.types.forEach(type => {
        const div = document.createElement('div');
        console.log(type);
        //if two type class = two-types, if not one-type with the type like before
        div.className = pokemon.types.find(type => type.split(' ')[0] === 'Pokémon').length === 2 ? 'two-types' : 'one-type';
        if (type.split(' ')[1] === 'légendaire') {
            document.querySelector('.legendary-tag').style.display = 'block';
        } else if (type.split(' ')[1] === 'fabuleux') {
            document.querySelector('.mythical-tag').style.display = 'block';
        } else if (type.split(' ')[2] === 'départ') {
            document.querySelector('.starter-tag').style.display = 'block';
        } else if (type.split(' ')[0] === 'Pokémon') {
            div.className += ' ' + type.split(' ')[3].toLowerCase().replace("é","e").replace("è","e");
            div.textContent = type.split(' ')[3].charAt(0).toUpperCase() + type.split(' ')[3].slice(1).toLowerCase();
            types.appendChild(div);
        }
    });

    const generation = document.querySelector('.generation');
    generation.querySelector('.name').innerHTML = '';
    generation.querySelector('.name').textContent = pokemon.generation;

    const evolutions = document.querySelector('.evolutions');

    const base = document.createElement('a');
    
    // Si le Pokémon actuel est le Pokémon de base

    if (parseInt(pokemon.id) === pokemon.evolutions.base.number) {
        base.className = 'evolution actual';
    } else {
        base.className = 'evolution';
    }
    base.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.evolutions.base.number}.png" alt="${pokemon.evolutions.base.name}" class="evolution-pokemon">
        <div class="name text-decoration-none">${pokemon.evolutions.base.name}</div>
    `;
    base.href = `pokemon.html?id=${pokemon.evolutions.base.number}`;

    evolutions.appendChild(base);

    if (pokemon.evolutions.niveau1 !== undefined) {
        const niveau1 = document.createElement('a');
        // Si le Pokémon actuel est le premier niveau d'évolution
        if (parseInt(pokemon.id) === pokemon.evolutions.niveau1.number) {
            niveau1.className = 'evolution actual';
        } else {
            niveau1.className = 'evolution';
        }
        niveau1.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.evolutions.niveau1.number}.png" alt="${pokemon.evolutions.niveau1.name}" class="evolution-pokemon">
            <div class="name text-decoration-none">${pokemon.evolutions.niveau1.name}</div>
        `;
        niveau1.href = `pokemon.html?id=${pokemon.evolutions.niveau1.number}`;
        evolutions.appendChild(niveau1);
    }

    if (pokemon.evolutions.niveau2 !== undefined) {
        const niveau2 = document.createElement('a');
        // Si le Pokémon actuel est le deuxième niveau d'évolution
        if (parseInt(pokemon.id) === pokemon.evolutions.niveau2.number) {
            niveau2.className = 'evolution actual';
        } else {
            niveau2.className = 'evolution';
        }
        niveau2.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.evolutions.niveau2.number}.png" alt="${pokemon.evolutions.niveau2.name}" class="evolution-pokemon">
            <div class="name text-decoration-none">${pokemon.evolutions.niveau2.name}</div>
        `;
        niveau2.href = `pokemon.html?id=${pokemon.evolutions.niveau2.number}`;
        evolutions.appendChild(niveau2);
    }

    const games = document.querySelector('.games-container');
    games.innerHTML = '';
    if (pokemon.games.length === 0) {
        document.querySelector('.games-title').style.display = 'none';
    }
    console.log(pokemon.games);

    pokemon.games.forEach(game => {
        const gameElement = document.createElement('a');
        gameElement.className = 'game';
        gameElement.innerHTML = `
            <div class="name">${game.name} (${game.publicationDate})</div>
        `;
        gameElement.href = "game.html?id=" + game.id;
        games.appendChild(gameElement);
    });

}

async function main() {
    const id = new URLSearchParams(window.location.search).get('id');
    const pokemon = await fetchPokemon(id);
    renderPokemon(pokemon);
}

main();