import { useMachine } from "@xstate/react";

import { PokemonImage, Pokemon, PokemonList, Pages } from "./Components";
import pokemonViewerMachine from "./pokemonMachine";

import "./App.css";

function App() {
  const [
    {
      context: { pageCount, pokemonList, selectedPokemon },
      matches,
    },
    send,
  ] = useMachine(pokemonViewerMachine);

  return (
    <div className="app">
      {matches("Error") && (
        <div>We encountered an error. Please try again later.</div>
      )}
      {!matches("Error") && (
        <div className="container">
          <div>
            <PokemonList
              pokemonList={pokemonList}
              onClick={(id) => {
                send({
                  type: "PokemonIdSet",
                  id,
                });
              }}
            />
            <Pages
              pageCount={pageCount}
              onClick={(page) =>
                send({
                  type: "CurrentPageSet",
                  page,
                })
              }
            />
          </div>
          <div>
            <Pokemon pokemon={selectedPokemon} />
          </div>
          <div>
            <PokemonImage pokemon={selectedPokemon} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
