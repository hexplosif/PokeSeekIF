const secondarySearchAutocomplete = document.getElementById('secondary-search-autocomplete');
const secondarySearchButton = document.getElementById('secondary-search-button');
const secondarySearch = document.getElementById('secondary-search');

let result = null;
let currentQuery = '';
let controller = null;

function goToFirstResult() {
    if (result) {
        location.assign(`pokemon.html?id=${result.id}`);
    }
}

async function submitPokemon(q) {
    currentQuery = q; // Stocke la requête actuelle
    if (controller) {
        controller.abort(); // Annule la requête précédente si elle est encore en cours
    }
    controller = new AbortController(); // Crée un nouveau contrôleur pour cette requête
    const signal = controller.signal;

    const searchPokemonQuery = pokemonSearchRequest(q, 5);
    const url = getQueryUrl(WIKIDATA_API, searchPokemonQuery);

    try {
        const response = await fetch(url, { signal }).then(response => response.json());
        if (currentQuery !== q) return; // Ignore les résultats si l'input a changé
        const pokemons = response.results.bindings.map(pokemon => ({
            id: parseInt(pokemon.pokedexNumber.value),
            name: pokemon.pokemonLabel.value,
        }));

        result = pokemons[0];
        secondarySearchAutocomplete.innerText = `${secondarySearch.value} — ${pokemons[0].name}`;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Requête annulée pour une nouvelle recherche.');
        } else {
            console.error('Erreur lors de la récupération des Pokémon:', error);
        }
    }
}

function main() {

    secondarySearchButton.addEventListener('click', goToFirstResult);

    secondarySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goToFirstResult();
        }
    });

    secondarySearch.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            e.stopPropagation();
            secondarySearchResultsContainer.querySelector('a')?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            e.stopPropagation();
            secondarySearchResultsContainer.querySelector('.recherche-categorie:last-child ul:last-child li:last-child a')?.focus();
        }
    });

    secondarySearch.addEventListener('input', () => {
        const q = secondarySearch.value.toLocaleLowerCase();
        if (q.length > 0) {
            currentQuery = q; // Met à jour la requête actuelle
            secondarySearchAutocomplete.innerText = `${secondarySearch.value} — Recherche…`;
            submitPokemon(q);
        } else {
            if (controller) {
                controller.abort(); // Annule la requête en cours si l'input est vidé
            }
            currentQuery = ''; // Réinitialise la requête actuelle
            secondarySearchAutocomplete.innerText = '';
            result = null; // Réinitialise le résultat
        }
    });
}

main();
