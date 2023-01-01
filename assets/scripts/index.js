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
const searchInput = select('.search-input');
const pokemonCards = select('.pokemon-cards');
const dialog = select('dialog');

// SEARCH AND DISPLAY
onEvent('input', searchInput, (e) => {
    const searchString = e.target.value.toLowerCase();
    console.log(searchString);
});

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
        <div class="card" onclick="selectPokemon(${pokemon.id})">
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

// FETCHING AND DISPLAYING A POKEMON'S STATS DYNAMICALLY
const selectPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const result = await fetch(url);
    const pokemon = await result.json();
    showCard(pokemon);
}

const showCard = (pokemon) => {
    dialog.innerHTML = `
        <article class="dialog-head">
            <p class="pokemon-number">
                #${String(pokemon.id).padStart(3, '0')} | ${pokemon.name.charAt(0)
                .toUpperCase()}${pokemon.name.slice(1, pokemon.name.length)}
            </p>
            <p><small>HP</small>${pokemon.stats[0].base_stat}</p>
        </article>

        <figure>
            <img src="${pokemon.sprites['front_default']}" alt="" class="pokemon-card-img">
        </figure>

        <article class="dialog-body">
            <p>Type: <span>${pokemon.types.map((type) => type.type.name).join(', ')}</span></p>
            <p>Weight: ${pokemon.weight} | Height: ${pokemon.height}</p>
            <p>
                <small>ATK</small>${pokemon.stats[1].base_stat} | <small>DEF</small>${pokemon.stats[2].base_stat}
            </p>
        </article>
    `;
    dialog.showModal();
};

// Closing Modal
onEvent('click', dialog, function(event) {
    const rect = this.getBoundingClientRect();

    if(event.clientY < rect.top || event.clientY > rect.bottom || 
      event.clientX < rect.left || event.clientX > rect.right) {
        dialog.close();
    }
});

fetchPokemon();

