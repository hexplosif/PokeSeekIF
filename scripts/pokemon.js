// Get pokemon data from TriplyDB
async function fetchPokemon(id) {
    const query = pokemonRequestTriplyDB(id);
    const url = getQueryUrl(TRIPLY_DB_API, query);
    const pokemon = await fetch(url).then(response => response.json());
    console.log(pokemon);

    const generationQuery = generationsRequest(id);
    const generationUrl = getQueryUrl(WIKIDATA_API, generationQuery);
    const response = await fetch(generationUrl).then(response => response.json());
    const generation = response.results.bindings;
    console.log(generation);

    const evolutionQuery = evolutionsRequest(id);
    const evolutionUrl = getQueryUrl(WIKIDATA_API, evolutionQuery);
    const response2 = await fetch(evolutionUrl).then(response => response.json());
    const evolutions = response2.results.bindings;
    console.log(evolutions);

    // Extraire les noms d'évolution et les numéros d'évolution
    const evolLabels = evolutions[0].evolLabels.value.split(', ');
    const evolNumbers = evolutions[0].evolNumbers.value.split(', ');

    // Créer un tableau des évolutions (label et numéro) et trier par numéro
    const evolutionsWithNumbers = evolLabels.map((label, index) => ({
        name: label,
        number: evolNumbers[index]
    }));

    // Trier les évolutions par numéro
    evolutionsWithNumbers.sort((a, b) => parseInt(a.number) - parseInt(b.number));

    // Trouver l'évolution du Pokémon actuel (ID)
    const currentEvolution = evolutionsWithNumbers.find(evolution => evolution.number === id);

    let preEvolution = null;
    let evolution = null;

    // Identifier la préévolution et l'évolution
    if (evolutionsWithNumbers.length >= 2) {
        // Si plusieurs évolutions, la première est la préévolution, la dernière est l'évolution
        preEvolution = evolutionsWithNumbers[0];
        evolution = evolutionsWithNumbers[evolutionsWithNumbers.length - 1];
    } else if (evolutionsWithNumbers.length === 1) {
        // Si une seule évolution, cette évolution est l'évolution
        evolution = evolutionsWithNumbers[0];
    }

    // Organiser les données pour l'affichage
    return {
        id: id,
        name: pokemon[0].name,
        description: pokemon[0].description,
        species: pokemon[0].speciesLabel,
        abilities: pokemon[0].abilities,
        height: pokemon[0].length,
        weight: pokemon[0].weight,
        baseHP: pokemon[0].baseHP,
        baseAttack: pokemon[0].baseAttack,
        baseDefense: pokemon[0].baseDefense,
        baseSpAtk: pokemon[0].baseSpAtk,
        baseSpDef: pokemon[0].baseSpDef,
        baseSpeed: pokemon[0].baseSpeed,
        types: pokemon[0].types.split(', '),
        generation: generation[0].generationLabel.value.split(' ')
            .slice(0, 2) // Prendre seulement les deux premiers mots
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Mettre la première lettre en majuscule
            .join(' '), // Rejoindre les mots
        evolutions: {
            preEvolution: preEvolution,
            current: { name: pokemon[0].name, number: id },
            evolution: evolution
        }
    };
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

    const abilities = document.querySelector('.abilitie');
    abilities.textContent = pokemon.abilities;

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
        //if two type class = two-types, if not one-type with the type like before
        div.className = pokemon.types.length === 2 ? 'two-types' : 'one-type';
        div.className += ' ' + type.toLowerCase();
        div.textContent = type.split(' ')[0];
        types.appendChild(div);
    });

    const generation = document.querySelector('.generation');
    generation.querySelector('.name').innerHTML = '';
    generation.querySelector('.name').textContent = pokemon.generation;

    const evolutions = document.querySelector('.evolutions');

    // Créer un tableau des évolutions
    const evolutionsList = [];

    // Ajouter le Pokémon actuel au tableau
    evolutionsList.push({
        name: pokemon.evolutions.current.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase(),
        number: pokemon.evolutions.current.number,
        type: 'current'
    });

    // Ajouter la préévolution (si elle existe)
    if (pokemon.evolutions.preEvolution) {
        evolutionsList.push({
            name: pokemon.evolutions.preEvolution.name,
            number: pokemon.evolutions.preEvolution.number,
            type: 'preEvolution'
        });
    }

    // Ajouter l'évolution (si elle existe)
    if (pokemon.evolutions.evolution) {
        evolutionsList.push({
            name: pokemon.evolutions.evolution.name,
            number: pokemon.evolutions.evolution.number,
            type: 'evolution'
        });
    }

    // Trier les évolutions par numéro
    evolutionsList.sort((a, b) => parseInt(a.number) - parseInt(b.number));

    // Réinitialiser le contenu des évolutions
    evolutions.innerHTML = '';

    // Créer les éléments d'évolution dans l'ordre
    evolutionsList.forEach((evolution, index) => {
        const evolutionElement = document.createElement('a');
        evolutionElement.style.textDecoration = 'none';

        const nameDiv = document.createElement('div');
        nameDiv.classList.add('name');
        nameDiv.style.color = 'white';
        nameDiv.textContent = evolution.name;

        const imageDiv = document.createElement('img');
        
        // Ajouter la classe spécifique à chaque type d'évolution (actual, evolution)
        if (evolution.type === 'current') {
            evolutionElement.classList.add('actual');
            imageDiv.classList.add('actual-pokemon');
        } else {
            evolutionElement.classList.add('evolution');
            imageDiv.classList.add('evolution-pokemon');
        }

        imageDiv.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parseInt(evolution.number)}.png`;
        imageDiv.alt = evolution.name;

        // Ajouter les éléments créés à la div d'évolution
        evolutionElement.appendChild(imageDiv);
        evolutionElement.appendChild(nameDiv);

        // Ajouter un lien vers la page du Pokémon
        evolutionElement.href = `pokemon.html?id=${evolution.number}`;

        // Ajouter l'élément d'évolution à la section
        evolutions.appendChild(evolutionElement);
    });
}

async function main() {
    const id = new URLSearchParams(window.location.search).get('id');
    const pokemon = await fetchPokemon(id);
    renderPokemon(pokemon);
}

main();