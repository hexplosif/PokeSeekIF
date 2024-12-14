async function fetchGame(id) {
    const query = gameRequestSpecificWikiData(id);
    console.log("Generated SPARQL Query:\n", query);

    const url = getQueryUrl(WIKIDATA_API, query);
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response Data:", data);

        if (!data.results.bindings || data.results.bindings.length === 0) {
            throw new Error("No data found for the provided game ID.");
        }

        return data.results.bindings.map(game => ({
            id: game.videogame.value,
            name: game.videogameLabel.value,
            releaseDate: game.releaseDates?.value || 'Unknown',
            director: game.directors?.value || 'Unknown',
            platform: game.platforms?.value || 'Unknown',
            genre: game.genres?.value || 'Unknown',
            mode: game.gameModes?.value || 'Unknown',
            engine: game.softwareEngines?.value || 'Unknown',
            logoImage: game.logoImage?.value || null,
        }));
    } catch (error) {
        console.error("Error fetching game data:", error);
        throw error;
    }
}




async function renderGame(game) {
    game = game[0];
    
    // Populate main details
    document.querySelector('.main-info .name').textContent = game.name;
    document.querySelector('.releaseDate').textContent = game.releaseDate;
    document.querySelector('.director').textContent = game.director;
    document.querySelector('.composer').textContent = game.composer || 'Unknown'; // Optional in fetch
    document.querySelector('.producer').textContent = game.producer || 'Unknown'; // Optional in fetch
    document.querySelector('.platform').textContent = game.platform;
    document.querySelector('.genre').textContent = game.genre;
    document.querySelector('.mode').textContent = game.mode;
    document.querySelector('.engine').textContent = game.engine;
    
    // Display game poster
    const poster = document.querySelector('.poster');
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
    try {
        const id = new URLSearchParams(window.location.search).get('id');
        console.log("Extracted ID:", id);
        if (!id) {
            throw new Error("Game ID not found in the URL.");
        }

        const game = await fetchGame(id);
        console.log("Fetched game data:", game);

        if (!game || game.length === 0) {
            throw new Error("No game data found.");
        }

        await renderGame(game);
    } catch (error) {
        console.error("Error in main function:", error);
        document.body.innerHTML = `<div class="error-message">Failed to load game details. Please try again later.</div>`;
    }
}




main();