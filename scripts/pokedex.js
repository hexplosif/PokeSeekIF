// Get all pokemons from Wikidata
async function fetchPokemons() {
    const query = pokemonsRequestWikiData();
    const url = getQueryUrl(WIKIDATA_API, query);
    const response = await fetch(url).then(response => response.json());
    console.log(response.results.bindings);
    const pokemons = response.results.bindings.map(pokemon => ({
        id: pokemon.id.value,
        name: pokemon.pokemonLabel.value,
    }));
    return pokemons;
}

// Render the pokemons in the pokedex
function renderPokemons(pokemons) {

    const pokedex = document.getElementById('pokedex');
    pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pkmn-card border border-2 border-dark rounded-3 overflow-hidden shadow-lg';
        card.innerHTML = `
            <div class="card-header">
                <div class="number">${parseInt(pokemon.id)}</div>
                <div class="name">${pokemon.name}</div>
            </div>
            <div class="card-body">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parseInt(pokemon.id)}.png" alt="${pokemon.name}" class="card-img-top">
            </div>
            <div class="card-type">
               
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