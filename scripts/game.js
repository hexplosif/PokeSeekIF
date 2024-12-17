async function fetchGame(id) {
    const query = gameRequestSpecificWikiData(id);

    const url = getQueryUrl(WIKIDATA_API, query);
    const response = await fetch(url);
    const data = await response.json();

    return data.results.bindings.map(game => ({
        id: game.videogame.value,
        name: game.videogameLabel.value,
        releaseDate: game.releaseDates?.value || 'Unown',
        director: game.directors?.value || 'Unown',
        composer: game.composers?.value || 'Unown',
        producer: game.producers?.value || 'Unown',
        platform: game.platforms?.value || 'Unown',
        genre: game.genres?.value || 'Unown',
        mode: game.gameModes?.value || 'Unown',
        engine: game.softwareEngines?.value || 'Unown',
        logoImage: game.logoImage?.value || null,
    }));

}


async function renderGame(game) {
    game = game[0];

    // Populate main details
    document.querySelector('.main-info .name').textContent = game.name || 'Unown';
    document.querySelector('.releaseDate').textContent = game.releaseDate.split('T')[0].replace(/-/g, '/') || 'Unown';
    document.querySelector('.director').textContent = game.director || 'Unown';
    document.querySelector('.composer').textContent = game.composer || 'Unown';
    document.querySelector('.producer').textContent = game.producer || 'Unown';
    document.querySelector('.platform').textContent = game.platform || 'Unown';
    document.querySelector('.genre').textContent = game.genre || 'Unown';
    document.querySelector('.mode').textContent = game.mode || 'Unown';
    document.querySelector('.engine').textContent = game.engine || 'Unown';

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
        poster.textContent = 'Affiche non disponible.';
    }
}


async function main() {
    const id = new URLSearchParams(window.location.search).get('id');
    const game = await fetchGame(id);
    await renderGame(game);
}


main();