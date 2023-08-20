import axios from "axios";
import { useEffect, useState } from "react";
import Pokemon from "../Pokemon/Pokemon";
import "./PokemonList.css";

function PokemonList() {

    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const POKEDEX_URL = "https://pokeapi.co/api/v2/pokemon" ;

    async function downloadPokemons() {
        const response = await axios.get(POKEDEX_URL); // Downloads list of 20 Pokemons

        const pokemonResults = response.data.results; //We  get the Array of Pokemons

        // Iterating the Array using their url, to create an array of Promises, that downloads those 20 pokemons
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));

        // Passing the array fethed of Pokemon to axios.all
        const pokemonData = await axios.all(pokemonResultPromise); // Array of 20 Pokemon (Detailed Data)

        // Iterating on array of detailed data, and extracting only Id, Name and Image
        const pokeListResult = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types: pokemon.types
            }

        });

        
        console.log(pokeListResult);
        setPokemonList(pokeListResult);
        setIsLoading(false);
    }

    useEffect(() => {
        downloadPokemons();
    }, [])



    return (
        <>
            <div className="pokemon-list-wrapper">
                <div>Pokemon List</div>
                {(isLoading) ? "Loading..." : 
                    pokemonList.map((p)=> <Pokemon name={p.name} image={p.image} key={p.id} /> )
                }
            </div>
        </>

    )


}

export default PokemonList;