// Get all pokemons from Wikidata
async function fetchPokemons() {
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

// Render the pokemons in the pokedex
function renderPokemons(pokemons) {

    const loader = document.getElementById('loader');
    loader.style.display = 'none';
    const pokedex = document.getElementById('pokedex');
    pokemons.forEach(pokemon => {
        const card = document.createElement('a');
        card.className = 'pkmn-card border border-2 border-dark rounded-3 overflow-hidden shadow-lg text-decoration-none';
        card.href = `pokemon.html?id=${pokemon.id}`;
        card.innerHTML = `
            <div class="card-header">
                <div class="number">${pokemon.id}</div>
                <div class="name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase()}</div>
            </div>
            <div class="card-body">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parseInt(pokemon.id)}.png" alt="${pokemon.name}" class="card-img-top">
            </div>
            <div class="card-type">
                ${pokemon.types.map(type => `<div class="${pokemon.types.length === 2 ? 'two-types' : 'one-type'} ${type.toLowerCase()}">${type.split(' ')[0]}</div>`).join('')}
            </div>
        `;
        pokedex.appendChild(card);
    });
}

async function main() {
    const pokemons = await fetchPokemons();
    renderPokemons(pokemons);
}

main();