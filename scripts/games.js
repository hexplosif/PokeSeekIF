// Fetch all games from Wikidata
async function fetchgames() {
    try {
        const query = gamesRequestWikiData();
        const url = getQueryUrl(WIKIDATA_API, query);
        const response = await fetch(url).then(response => response.json());
        console.log(response.results.bindings);

        // Map API response to game objects
        const games = response.results.bindings.map(game => ({
            name: game.videogameLabel?.value || 'Unknown',
            releaseDate: game.releaseDate?.value || 'Unknown',
            director: game.directorLabel?.value || 'Unknown',
            location: game.locationLabel?.value || 'Unknown',
        }));
        return games;
    } catch (error) {
        console.error("Error fetching games data:", error);
        return []; // Return an empty array on failure
    }
}

// Render the games in the table
function rendergames(games) {
    const gamesTableBody = document.querySelector('#games table tbody');

    // Clear any existing rows
    gamesTableBody.innerHTML = '';

    // Create and append rows for each game
    games.forEach(game => {
        const row = document.createElement('tr'); // Create a table row
        row.innerHTML = `
            <td>${game.name}</td>
            <td>${game.releaseDate}</td>
            <td>${game.director}</td>
            <td>${game.location}</td>
        `;
        gamesTableBody.appendChild(row);
    });
}

// Main function to fetch and display games
async function main() {
    const games = await fetchgames();
    rendergames(games);
}

main();
