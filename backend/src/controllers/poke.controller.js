export const getPoke = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15;
    const offset = parseInt(req.query.offset) || 0;
    const { name, id, type } = req.query || {};

    const fetchPokemon = async (identifier) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier.toLowerCase()}`);
      if (!response.ok) throw new Error('Pokemon not found');
      const data = await response.json(); 

      const json = {
        id: data.id,
        name: data.name,
        sprite: data.sprites.other['official-artwork'].front_default,
        types: data.types.map(t => t.type.name)
      };

      if(!isNaN(Number(identifier))) {
        json['height'] = data.height;
        json['weight'] = data.weight;
        json['stats']  = data.stats;
        return json;
      }

      return json ;
    };

    // 🔹 Buscar por ID o nombre
    if (id || name) {
      const identifier = id || name;
      const pokemon = await fetchPokemon(identifier);
      return res.json({
        ok: true,
        results: [pokemon]
      });
    }

    // 🔹 Filtrar por tipo
    if (type) {
      const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
      if (!typeRes.ok) throw new Error('Type not found');

      const typeData = await typeRes.json();
      const pokemonSlice = typeData.pokemon.slice(offset, offset + limit);
      const results = await Promise.all(
        pokemonSlice.map((p) => fetchPokemon(p.pokemon.name))
      );

      return res.json({
        ok: true,
        offset,
        limit,
        total: typeData.pokemon.length,
        results
      });
    }

    // 🔹 Paginado general
    const listRest = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const listData = await listRest.json();
    const pokemonList = await Promise.all(
      listData.results.map((pokemon) => fetchPokemon(pokemon.name))
    );

    return res.json({
      ok: true,
      offset,
      limit,
      total: listData.count,
      next: listData.next,
      previous: listData.previous,
      results: pokemonList
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', details: error.message });
  }
};
