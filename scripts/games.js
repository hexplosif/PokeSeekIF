async function fetchSPARQLGamesData() {
    const query = gamesRequestWikiData();
    const url = getQueryUrl(WIKIDATA_API, query);
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.results.bindings);
  
      return data.results.bindings.map((game) => ({
        id: game.videogame.value,
        name: game.videogameLabel.value,
        logoImage: game.logoImage?.value || null, // Include the logo image URL
      }));
    } catch (error) {
      console.error("Error fetching SPARQL data:", error);
      return [];
    }
  }
  


  async function renderGames(games) {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
    const gamesContainer = document.getElementById("games-container");
    gamesContainer.innerHTML = '';

    for (const game of games) {
        const card = document.createElement('a');
        card.className = "game-card border border-2 border-dark rounded-3 overflow-hidden shadow-lg text-white m-3";
        card.style.flex = "1 1 calc(25% - 30px)";
        card.innerHTML = `
            <div class="card-header bg-secondary text-white text-center p-2">
                <div class="name">${game.name}</div>
            </div>
           

            <div class="card-middle">
                ${game.logoImage 
                  ? `<img src="${game.logoImage}" alt="${game.name}" class="game-image">` 
                  : '<div class="no-image">Image non disponible sur wikidata ...</div>'}
            </div>
        `;
        card.href = "game.html?id=" + game.id.substring(31);
        gamesContainer.appendChild(card);
    }
}


async function main() {
    const games = await fetchSPARQLGamesData();
    renderGames(games);
}

main();