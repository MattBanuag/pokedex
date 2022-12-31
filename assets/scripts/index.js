'use strict';
// UTILITY FUNCTIONS
// Add Event Listener Function
function onEvent(event, selector, callback) {
    return selector.addEventListener(event, callback);
}
// Query Selector Function
function select(selector, parent = document) {
    return parent.querySelector(selector);
}

// Query Selector All Function
function selectAll(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
}

// HTML DOCUMENT BRIDGE
const pokemonCards = select('.pokemon-cards');

// FETCHING DATA FROM POKEAPI
const options = {
    method: 'GET',
    mode: 'cors'
};

async function fetchPokemon() {
    for(let i = 1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        
        try {
            const result = await fetch(url, options);

            if(!result.ok) {
                throw new Error(`${result.statusText} (${result.status})`);
            }

            const data = await result.json();
            let pokeId = data.id;
            let pokeName = data.name;
            pokemonCards.innerHTML += `
                <div class="card">
                    <figure>
                        <img src="${data.sprites['front_default']}" alt="" class="pokemon-img">
                    </figure>
                    <p class="pokemon-number">#${String(pokeId).padStart(3, '0')}</p>
                    <p class="pokemon-name">
                        ${pokeName.charAt(0).toUpperCase()}${pokeName.slice(1, pokeName.length)}
                    </p>
                </div>
            `;
        } catch(error) {
            pokemonCards.innerHTML = `
                <h2>Sorry, there was an error fetching the Pokémon</h2>
            `;
        }
    }
}

fetchPokemon();
