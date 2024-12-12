const searchAutocomplete = document.getElementById('search-autocomplete');
const searchResultsContainer = document.getElementById('searchResultsContainer');
const searchButton = document.getElementById('searchButton');
const search = document.getElementById('search');
let meilleurResultat = null;
let controller = null;
let currentQuery = null;

function goToFirstResult() {
    if (meilleurResultat) {
        location.assign(`pokemon.html?id=${meilleurResultat.id}`)
    }
}


async function submitPokemon(q) {
    currentQuery = q; // Stocke la requête actuelle
    controller = new AbortController();
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

        renderResults(pokemons, 'pokemon');
        meilleurResultat = pokemons[0];
        searchAutocomplete.innerText = `${search.value} — ${pokemons[0].name}`;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Erreur lors de la récupération des Pokémon:', error);
        }
    }
}

async function submitGames(q) {
    currentQuery = q; // Stocke la requête actuelle
    controller = new AbortController();
    const signal = controller.signal;

    const searchGamesQuery = gameSearchRequest(q, 5);
    const url = getQueryUrl(WIKIDATA_API, searchGamesQuery);

    try {
        const response = await fetch(url, { signal }).then(response => response.json());
        if (currentQuery !== q) return; // Ignore les résultats si l'input a changé
        const games = response.results.bindings.map(game => ({
            id: game.videogame.value,
            name: game.videogameLabel.value,
        }));

        renderResults(games, 'game');
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Erreur lors de la récupération des jeux:', error);
        }
    }
}

async function submitMovies(q) {
    currentQuery = q; // Stocke la requête actuelle
    controller = new AbortController();
    const signal = controller.signal;

    const searchMoviesQuery = movieSearchRequest(q, 5);
    const url = getQueryUrl(WIKIDATA_API, searchMoviesQuery);

    try {
        const response = await fetch(url, { signal }).then(response => response.json());
        if (currentQuery !== q) return; // Ignore les résultats si l'input a changé
        const movies = response.results.bindings.map(movie => ({
            id: movie.movie.value,
            name: movie.movieLabel.value,
        }));

        renderResults(movies, 'movie');
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Erreur lors de la récupération des films:', error);
        }
    }
}

function renderResults(results, type) {
    if (results.length > 0) {
        const category = document.createElement('div')
        category.className = 'recherche-categorie'
        const title = document.createElement('h2')
        if (type === 'pokemon') {
            title.innerText = 'Pokémon'
        } else if (type === 'game') {
            title.innerText = 'Game'
        } else if (type === 'movie') {
            title.innerText = 'Movie'
        }
        category.appendChild(title)
        const ul = document.createElement('ul')
        results.forEach(result => {
            const li = document.createElement('li')
            const a = document.createElement('a')
            if (type === 'pokemon') {
                a.href = `pokemon.html?id=${result.id}`
            } else if (type === 'game') {
                a.href = `game.html?id=${result.id.substring(31)}`
            } else if (type === 'movie') {
                a.href = `movie.html?id=${result.id.substring(31)}`
            }
            a.innerText = result.name
            a.addEventListener('focus', () => {
                meilleurResultat = { id: result.id, type: type }
            }
            )
            li.appendChild(a)
            ul.appendChild(li)
        })
        category.appendChild(ul)
        searchResultsContainer.appendChild(category)
    }
}

function resetResults() {
    searchResultsContainer.innerHTML = ''
    meilleurResultat = null
    if (controller) {
        controller.abort()
    }
}

function main() {

    searchButton.addEventListener('click', goToFirstResult)

    search.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goToFirstResult()
        }
    })

    search.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            e.stopPropagation()
            searchResultsContainer.querySelector('a')?.focus()
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            e.stopPropagation()
            searchResultsContainer.querySelector('.recherche-categorie:last-child ul:last-child li:last-child a')?.focus()
        }
    })

    search.addEventListener('input', () => {
        const q = search.value.toLocaleLowerCase()
        if (q.length > 0) {
            resetResults()
            searchAutocomplete.innerText = `${search.value} — Recherche…`
            submitPokemon(q)
            submitGames(q)
            submitMovies(q)
        } else {
            searchAutocomplete.innerText = ''
            resetResults()
        }
    })

    searchResultsContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            e.stopPropagation()

            const direction = (e.key === 'ArrowDown') ? +1 : -1
            const liens = [...searchResultsContainer.querySelectorAll('a')]
            if (liens && liens.length > 0) {
                const index = liens.indexOf(document.activeElement)
                if (index == -1) {
                    // le focus n'est pas sur une ancre
                    liens[0].focus()
                } else {
                    const nextIndex = index + direction
                    if (nextIndex < 0) {
                        search.focus() // on focus l'entrée
                    } else if (nextIndex >= liens.length) {
                        search.focus() // on boucle
                    } else {
                        liens[nextIndex].focus()
                    }
                }
            }
        }
    })
}

main()
