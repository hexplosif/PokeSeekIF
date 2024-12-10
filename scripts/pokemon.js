// Get pokemon data from TriplyDB
async function fetchPokemon() {
    const query = pokemonsRequestTriplyDB();
    const url = getQueryUrl(TRIPLY_DB_API, query);
    const response = await fetch(url).then(response => response.json());
    const pokemons = response.map(pokemon => ({
        id: pokemon.nb,
        name: pokemon.name,
        description: pokemon.description,
        species: pokemon.speciesLabel,
        baseHP: pokemon.baseHP,
        baseAttack: pokemon.baseAttack,
        baseDefense: pokemon.baseDefense,
        baseSpAtk: pokemon.baseSpAtk,
        baseSpDef: pokemon.baseSpDef,
        baseSpeed: pokemon.baseSpeed,
        height: pokemon.length,
        weight: pokemon.weight,
        types: pokemon.types.split(', '),
    }));
    return pokemons;
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
    height.style.width = Math.min(pokemon.height/10 / MAX_HEIGHT * 100, 100) + '%';
    height.textContent = pokemon.height/10 + ' m';

    const weight = document.querySelector('.weight');
    weight.style.width = Math.min(pokemon.weight/10 / MAX_WEIGHT * 100, 100) + '%';
    weight.textContent = pokemon.weight/10 + ' kg';

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
    generation.querySelector('.name').textContent = pokemon.generation;
}

async function main() {
    const pokemons = await fetchPokemon();
    const id = new URLSearchParams(window.location.search).get('id') - 1;
    renderPokemon(pokemons[id]);
}

main();