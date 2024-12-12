// Get all pokemons from Wikidata
async function fetchPokemons() {
    const query = pokemonsRequestWikiData();
    const url = getQueryUrl(WIKIDATA_API, query);
    const response = await fetch(url).then(response => response.json());
    return response.results.bindings.map(pokemon => ({
        id: parseInt(pokemon.pokedexNumber.value),
        name: pokemon.pokemonLabel.value,
        types: pokemon.types.value.split(', '),
    }));
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
                ${pokemon.types.map(type => `<div class="${pokemon.types.length === 2 ? 'two-types' : 'one-type'} ${type.split(' ')[3].toLowerCase().replace("é","e").replace("è","e")}">
                    ${type.split(' ')[3].charAt(0).toUpperCase() + type.split(' ')[3].slice(1).toLowerCase()}
                </div>`).join('')}
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