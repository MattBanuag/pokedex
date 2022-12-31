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
/*
    Fetches data all at once which enhances our code
    and gets the data smoothly. Credit to James Quick for
    the advice :)
*/
const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    Promise.all(promises).then((results) => {
        const data = results.map((result) => ({
            name: result.name,
            image: result.sprites['front_default'],
            type: result.types.map((type) => type.type.name).join(', '),
            id: result.id
        }));
        displayPokemon(data);
    });
};

const displayPokemon = (data) => {
    const pokemonData = data
        .map(
            (pokemon) => `
        <div class="card">
            <figure>
                <img src="${pokemon.image}" alt="" class="pokemon-img">
            </figure>
            <p class="pokemon-number">#${String(pokemon.id).padStart(3, '0')}</p>
            <p class="pokemon-name">
                ${pokemon.name.charAt(0).toUpperCase()}${pokemon.name.slice(1, pokemon.name.length)}
            </p>
            <ul>
                <li>
                    ${pokemon.type}
                </li>
            </ul>
        </div>
    `
        ).join('');
    pokemonCards.innerHTML = pokemonData;
};

fetchPokemon();

