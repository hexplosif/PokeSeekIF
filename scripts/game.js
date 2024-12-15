async function fetchGame(id) {
    const query = gameRequestSpecificWikiData(id);

    const url = getQueryUrl(WIKIDATA_API, query);
    const response = await fetch(url);
    const data = await response.json();

    return data.results.bindings.map(game => ({
        id: game.videogame.value,
        name: game.videogameLabel.value,
        releaseDate: game.releaseDates?.value || 'Unknown',
        director: game.directors?.value || 'Unknown',
        composer: game.composers?.value || 'Unknown',
        producer: game.producers?.value || 'Unknown',
        platform: game.platforms?.value || 'Unknown',
        genre: game.genres?.value || 'Unknown',
        mode: game.gameModes?.value || 'Unknown',
        engine: game.softwareEngines?.value || 'Unknown',
        logoImage: game.logoImage?.value || null,
    }));

}


async function renderGame(game) {
    game = game[0];

    // Populate main details
    document.querySelector('.main-info .name').textContent = game.name || 'Unknown';
    document.querySelector('.releaseDate').textContent = game.releaseDate || 'Unknown';
    document.querySelector('.director').textContent = game.director || 'Unknown';
    document.querySelector('.composer').textContent = game.composer || 'Unknown';
    document.querySelector('.producer').textContent = game.producer || 'Unknown';
    document.querySelector('.platform').textContent = game.platform || 'Unknown';
    document.querySelector('.genre').textContent = game.genre || 'Unknown';
    document.querySelector('.mode').textContent = game.mode || 'Unknown';
    document.querySelector('.engine').textContent = game.engine || 'Unknown';

    // Display game poster
    const poster = document.querySelector('.poster');
    poster.innerHTML = ''; // Clear previous content
    if (game.logoImage) {
        const imgElement = document.createElement('img');
        imgElement.src = game.logoImage;
        imgElement.alt = `${game.name} Poster`;
        imgElement.className = 'poster';
        poster.appendChild(imgElement);
    } else {
        poster.textContent = 'Poster not available.';
    }
}


async function main() {
    const id = new URLSearchParams(window.location.search).get('id');
    const game = await fetchGame(id);
    await renderGame(game);
}


main();