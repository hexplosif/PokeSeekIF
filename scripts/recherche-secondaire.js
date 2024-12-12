const secondarySearchAutocomplete = document.getElementById('secondary-search-autocomplete')
const secondarySearchButton = document.getElementById('secondary-search-button')
const secondarySearch = document.getElementById('secondary-search')

let result = null

function goToFirstResult() {
    if (result) {
        location.assign(`pokemon.html?id=${result.id}`)
    }
}

async function submitPokemon(q) {
    const searchPokemonQuery = pokemonSearchRequest(q, 5);
    const url = getQueryUrl(WIKIDATA_API, searchPokemonQuery);
    const response = await fetch(url).then(response => response.json());
    const pokemons = response.results.bindings.map(pokemon => ({
        id: parseInt(pokemon.pokedexNumber.value),
        name: pokemon.pokemonLabel.value,
    }));
    result = pokemons[0]
    secondarySearchAutocomplete.innerText = `${secondarySearch.value} — ${pokemons[0].name}`
}

function main() {

    secondarySearchButton.addEventListener('click', goToFirstResult)

    secondarySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goToFirstResult()
        }
    })

    secondarySearch.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            e.stopPropagation()
            secondarySearchResultsContainer.querySelector('a')?.focus()
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            e.stopPropagation()
            secondarySearchResultsContainer.querySelector('.recherche-categorie:last-child ul:last-child li:last-child a')?.focus()
        }
    })

    secondarySearch.addEventListener('input', () => {
        const q = secondarySearch.value.toLocaleLowerCase()
        if (q.length > 0) {
            secondarySearchAutocomplete.innerText = `${secondarySearch.value} — Recherche…`
            submitPokemon(q)
        } else {
            secondarySearchAutocomplete.innerText = ''
        }
    })
}

main()
