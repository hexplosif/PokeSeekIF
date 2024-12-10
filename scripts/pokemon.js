// Get pokemon data from TriplyDB
async function fetchPokemon() {
    const query = pokemonsRequestTriplyDB();
    const url = getQueryUrl(TRIPLY_DB_API, query);
    const response = await fetch(url).then(response => response.json());
    console.log(response);
    const pokemons = response.results.bindings.map(pokemon => ({
        id: pokemon.nb.value,
        name: pokemon.name.value,
        description: pokemon.description.value,
        species: pokemon.speciesLabel.value,
        baseHP: pokemon.baseHP.value,
        baseAttack: pokemon.baseAttack.value,
        baseDefense: pokemon.baseDefense.value,
        baseSpAtk: pokemon.baseSpAtk.value,
        baseSpDef: pokemon.baseSpDef.value,
        baseSpeed: pokemon.baseSpeed.value,
        length: pokemon.length.value,
        weight: pokemon.weight.value,
        types: pokemon.types.value.split(', ')
    }));
    return pokemons;
}

// Render the pokemon in the pokemon page
function renderPokemon(pokemon) {
    const mainInfo = document.querySelector('.main-info');
    mainInfo.querySelector('.number').textContent = pokemon.id;
    mainInfo.querySelector('.name').textContent = pokemon.name;

    const description = document.querySelector('.description');
    description.querySelector('p').textContent = pokemon.description;

    const abilities = document.querySelector('.abilitie');
    abilities.textContent = pokemon.abilities;

    const height = document.querySelector('.height');
    height.style.width = pokemon.height;
    height.textContent = pokemon.height;

    const weight = document.querySelector('.weight');
    weight.style.width = pokemon.weight;
    weight.textContent = pokemon.weight;

    const hp = document.querySelector('.hp');
    hp.style.width = pokemon.baseHP;
    hp.textContent = pokemon.baseHP;

    const attack = document.querySelector('.attack');
    attack.style.width = pokemon.baseAttack;
    attack.textContent = pokemon.baseAttack;

    const defense = document.querySelector('.defense');
    defense.style.width = pokemon.baseDefense;
    defense.textContent = pokemon.baseDefense;

    const spAtk = document.querySelector('.spe-attack');
    spAtk.style.width = pokemon.baseSpAtk;
    spAtk.textContent = pokemon.baseSpAtk;

    const spDef = document.querySelector('.spe-defense');
    spDef.style.width = pokemon.baseSpDef;
    spDef.textContent = pokemon.baseSpDef;

    const speed = document.querySelector('.speed');
    speed.style.width = pokemon.baseSpeed;
    speed.textContent = pokemon.baseSpeed;

    const total = document.querySelector('.total');
    total.style.width = pokemon.baseHP + pokemon.baseAttack + pokemon.baseDefense + pokemon.baseSpAtk + pokemon.baseSpDef + pokemon.baseSpeed;
    total.textContent = pokemon.baseHP + pokemon.baseAttack + pokemon.baseDefense + pokemon.baseSpAtk + pokemon.baseSpDef + pokemon.baseSpeed;

    const types = document.querySelector('.types');
    types.innerHTML = '';
    pokemon.types.forEach(type => {
        const div = document.createElement('div');
        div.className = `two-types ${type.toLowerCase()}`;
        div.textContent = type;
        types.appendChild(div);
    });

    const generation = document.querySelector('.generation');
    generation.querySelector('.name').textContent = pokemon.generation;
}

async function main() {
    const pokemons = await fetchPokemon();
    renderPokemon(pokemons[0]);
}

main();