let offset = 0;
const limit = 15;
let totalPokemon = 0;
const pokeSection = document.getElementById('poke');

const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const firstButton = document.getElementById('first');
const lastButton = document.getElementById('last');

const name = document.getElementById('name');
const id = document.getElementById('id');
const type = document.getElementById('type');

const search = document.getElementById('search');
const clear = document.getElementById('clear');


const dialog = document.getElementById('pokemonDialog');
async function getPokemons() {
  try {
    let url = `http://localhost:3000/api/pokemon?offset=${offset}&limit=${limit}`;
    if (name.value.trim()) url += `&name=${name.value.trim()}`;
    if (id.value.trim()) url += `&id=${id.value.trim()}`;
    if (type.value) url += `&type=${type.value}`;


    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    const data = await res.json();

    pokeSection.innerHTML = '';

    const info = async (id) => {
      try {
        const data = await fetch(`http://localhost:3000/api/pokemon?id=${id}`);
        if (!data.ok) throw new Error('no salio');
        const dataJson = await data.json();
        const pokemon = dataJson.results[0];
        dialog.id = id;

        document.getElementById('pokeName').textContent = pokemon.name;
        document.getElementById('pokeImg').src = pokemon.sprite;
        document.getElementById('pokeTypes').textContent = `Tipos: ${pokemon.types.join(', ')}`;
        document.getElementById('altura').textContent = `Altura:  ${pokemon.height}`;
        document.getElementById('peso').textContent = `Peso: ${pokemon.weight}`;
        pokemon.stats.map(s => {
          const div = document.createElement('div');
          const progress = document.createElement('progress');
          const label = document.createElement('label');

          div.classList.add('flex', 'items-center', 'justify-center', 'border', 'p-4', 'm-0')

          label.innerHTML = `<span>${s.stat.name}</span>  <span> ${s.base_stat}</span>`;
          label.classList.add('min-w-2/6', 'justify-between', 'max-w-2/6', 'flex', 'mr-1');
          div.appendChild(label);

          progress.value = s.base_stat;
          progress.max = 255;
          progress.min = 20;
          progress.classList.add('w-3/5', 'h-2', 'rounded-full', 'ml-2');
          progress.classList.add('w-full', 'h-3', 'rounded-full', 'overflow-hidden', 'accent-blue-500', 'bg-gray-200');

          div.appendChild(progress);

          document.getElementById('stats').appendChild(div);
        });


        dialog.showModal();
      } catch (error) {
        console.error(error);
      }
    };


    function previo(e) {
      const card = e.target.closest('dialog');
      info(Number(card.id) - 1);
    }


    function siguiente(e) {
      const card = e.target.closest('dialog');
      info(Number(card.id) + 1);
      console.log(card.id);
    }


    document.getElementById('nextPoke').addEventListener('click', (e) => {
      siguiente(e);
    })


    document.getElementById('prevPoke').addEventListener('click', (e) => {
      previo(e);
    })
    totalPokemon = data.total ?? 0;

    data.results.forEach(pokemon => {
      const card = document.createElement('div');
      card.classList.add('bg-gray-100', 'rounded-2xl', 'p-4', 'shadow', 'hover:shadow-lg', 'transition', 'duration-300', 'text-center', "hover:scale-102", 'hover:cursor-pointer');
      card.innerHTML = `
        <img src='${pokemon.sprite}' class='mx-auto w-32 h-32' />
        <h2 class="text-xl capitalize font-semibold mt-2">${pokemon.name}</h2>
        <p class="text-gray-600">Tipo: ${pokemon.types.join(', ')}</p>
      `;
      card.addEventListener('click', () => info(pokemon.id));
      card.id = pokemon.id;
      pokeSection.appendChild(card);
    });



    prevButton.disabled = offset <= 0;
    nextButton.disabled = offset + limit >= totalPokemon;
    firstButton.disabled = offset <= 0;
    lastButton.disabled = offset + limit >= totalPokemon;

  } catch (error) {
    console.error('Error al obtener los pokemones:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => getPokemons());

nextButton.onclick = () => { offset += limit; getPokemons(); };
firstButton.onclick = () => { offset = 0; getPokemons(); };
prevButton.onclick = () => { if (offset >= limit) offset -= limit; getPokemons(); };
lastButton.onclick = () => { offset = Math.floor((totalPokemon - 1) / limit) * limit; getPokemons(); };
search.onclick = () => { offset = 0; getPokemons(); };
clear.onclick = () => { name.value = ''; id.value = ''; type.value = ''; offset = 0; getPokemons(); };

function cerrar() {
  dialog.close();
}

