import axios from "axios";
import { useEffect, useState } from "react";
import Pokemon from "../Pokemon/Pokemon";
import "./PokemonList.css";

function PokemonList() {

    // Creating too manny useStates is a bad approach. Instead we can use a single useState which is of type Object.
    // const [pokemonList, setPokemonList] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [nextUrl, setNextUrl] = useState("");
    // const [prevUrl, setPrevUrl] = useState("");
    // const [pokedexUrl, setPokedexUrl] = useState("https://pokeapi.co/api/v2/pokemon");

    const [pokemonListState, setPokemonListState] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: "https://pokeapi.co/api/v2/pokemon",
        nextUrl: "",
        prevUrl: ""
    })



    async function downloadPokemons() {
        // setIsLoading(true); // --> Changing into Object
        setPokemonListState((state) => ({ ...state, isLoading: true }));
        const response = await axios.get(pokemonListState.pokedexUrl); // Downloads list of 20 Pokemons

        const pokemonResults = response.data.results; //We  get the Array of Pokemons

        // setNextUrl(response.data.next); --> Changing into Object
        // setPrevUrl(response.data.previous); --> Changing into Object
        setPokemonListState((state) => ({
            ...state,
            nextUrl: response.data.next,
            prevUrl: response.data.previous
        }));

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

        // setPokemonList(pokeListResult); --> Changing into Object
        // setIsLoading(false); --> Changing into Object
        setPokemonListState((state) => ({
            ...state,
            pokemonList: pokeListResult,
            isLoading: false
        }));
    }

    useEffect(() => {
        downloadPokemons();
    }, [pokemonListState.pokedexUrl]);



    return (
        <>
            <div className="pokemon-list-wrapper">
                <div className="pokemon-wrapper" >
                    {(pokemonListState.isLoading) ? "Loading..." :
                        pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)
                    }
                </div>
                <div className="controls">
                    <button disabled={pokemonListState.prevUrl == null} onClick={() => {
                        const urltoSet = pokemonListState.prevUrl;
                        setPokemonListState({ ...pokemonListState, pokedexUrl: urltoSet })
                    }} >Previous</button>
                    <button disabled={pokemonListState.nextUrl == null} onClick={() => {
                        const urltoSet = pokemonListState.nextUrl;
                        setPokemonListState({ ...pokemonListState, pokedexUrl: urltoSet })
                    }
                    } >Next</button>
                </div>
            </div>
        </>

    )

}

export default PokemonList;